import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';

let timeScale = 1; // Default time scale for real-time simulation

// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth movement
controls.dampingFactor = 0.05;
controls.enableZoom = true; // Allow zooming

// Add a point light to represent the Sun
const light = new THREE.PointLight(0xffffff, 2, 500);
light.position.set(0, 0, 0); // Sun at the origin
scene.add(light);

// Create the Sun with a texture
const sunTexture = new THREE.TextureLoader().load('textures/sun.jpg');
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create a background
const spaceTexture = new THREE.TextureLoader().load('textures/stars_milkyway.jpg');
scene.background = spaceTexture;

// Texture loader for planets
const textureLoader = new THREE.TextureLoader();

// Planet class to create planets, trails, and update positions
class Planet {
    constructor(name, size, semiMajorAxis, eccentricity, orbitalPeriod, rotationPeriod, textureUrl, ringTextureUrl = null) {
        this.name = name;
        this.geometry = new THREE.SphereGeometry(size, 32, 32);
        this.material = new THREE.MeshBasicMaterial({
            map: textureLoader.load(textureUrl),
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.semiMajorAxis = semiMajorAxis;
        this.eccentricity = eccentricity;
        this.orbitalPeriod = orbitalPeriod;
        this.rotationPeriod = rotationPeriod;
        this.angle = 0;
        this.rotationAngle = 0;
        scene.add(this.mesh);

        // Trail setup
        this.trailGeometry = new THREE.BufferGeometry();
        this.trailMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
        this.trailPositions = new Float32Array(3000);
        this.trailGeometry.setAttribute('position', new THREE.BufferAttribute(this.trailPositions, 3));
        this.trail = new THREE.Line(this.trailGeometry, this.trailMaterial);
        this.trail.maxTrailLength = 3000; // Maximum trail length
        scene.add(this.trail);

        if (ringTextureUrl) {
            const ringGeometry = new THREE.RingGeometry(size * 1.5, size * 2, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                map: textureLoader.load(ringTextureUrl),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.7,
            });
            this.ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
            this.ringMesh.rotation.x = Math.PI / 2;
            scene.add(this.ringMesh);
        }
    }

    updatePosition(timeElapsed) {
        const angularSpeed = (2 * Math.PI) / (this.orbitalPeriod * 365) * timeScale;
        this.angle += angularSpeed * timeElapsed;
        this.angle %= 2 * Math.PI;

        const radius = this.semiMajorAxis * (1 - this.eccentricity * Math.cos(this.angle));
        this.mesh.position.x = radius * Math.cos(this.angle);
        this.mesh.position.z = radius * Math.sin(this.angle);
        
        const rotationAngularSpeed = (2 * Math.PI) / (this.rotationPeriod * 3600);
        this.rotationAngle += rotationAngularSpeed * timeElapsed;
        this.mesh.rotation.y = this.rotationAngle;

        if (this.ringMesh) {
            this.ringMesh.position.copy(this.mesh.position);
        }

        this.updateTrail();
    }

    updateTrail() {
        const trailPosition = this.mesh.position.clone();
        this.trailPositions.copyWithin(3, 0);
        this.trailPositions.set([trailPosition.x, trailPosition.y, trailPosition.z], 0);
        this.trail.geometry.attributes.position.needsUpdate = true;
    }
}

// Moon class for creating moons for planets
class Moon {
    constructor(parentPlanet, size, distance, orbitalPeriod, rotationPeriod, textureUrl) {
        this.parentPlanet = parentPlanet;
        this.geometry = new THREE.SphereGeometry(size, 32, 32);
        this.material = new THREE.MeshBasicMaterial({
            map: textureLoader.load(textureUrl),
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.distance = distance;
        this.orbitalPeriod = orbitalPeriod;
        this.rotationPeriod = rotationPeriod;
        this.angle = 0;
        this.rotationAngle = 0;
        scene.add(this.mesh);
    }

    updatePosition(timeElapsed) {
        const angularSpeed = (2 * Math.PI) / (this.orbitalPeriod);
        this.angle += angularSpeed * timeElapsed;
        this.angle %= 2 * Math.PI;

        const parentPos = this.parentPlanet.mesh.position;
        this.mesh.position.x = parentPos.x + this.distance * Math.cos(this.angle);
        this.mesh.position.z = parentPos.z + this.distance * Math.sin(this.angle);

        const moonRotationAngularSpeed = (2 * Math.PI) / (this.rotationPeriod * 3600);
        this.rotationAngle += moonRotationAngularSpeed * timeElapsed;
        this.mesh.rotation.y = this.rotationAngle;
    }
}

// Create planets with accurate sizes and Kepler parameters
const planets = [
    new Planet('Mercury', 0.38, 15, 0.2056, 0.24, 1407.6, 'textures/mercury.jpg'),
    new Planet('Venus', 0.95, 25, 0.0068, 0.615, 5832.5, 'textures/venus_surface.jpg'),
    new Planet('Earth', 1, 35, 0.0167, 1, 24, 'textures/earth.jpg'),
    new Planet('Mars', 0.53, 50, 0.0934, 1.881, 24.6, 'textures/mars.jpg'),
    new Planet('Jupiter', 11.2, 75, 0.0485, 11.86, 9.9, 'textures/jupiter.jpg'),
    new Planet('Saturn', 9.45, 100, 0.0565, 29.46, 10.7, 'textures/saturn.jpg', 'textures/saturn_ring.png'),
    new Planet('Uranus', 4, 130, 0.0464, 84.01, 17.2, 'textures/uranus.jpg'),
    new Planet('Neptune', 3.88, 160, 0.0086, 164.79, 16.1, 'textures/neptune.jpg'),
];

// Create a Moon for Earth
const moon = new Moon(planets[2], 0.27, 2.5, 27.3, 27.3, 'textures/moon.jpg');

camera.position.z = 200;

const speedSlider = document.createElement('input');
speedSlider.type = 'range';
speedSlider.min = '0.1';
speedSlider.max = '10';
speedSlider.value = '1';
speedSlider.step = '0.1';
speedSlider.style.position = 'absolute';
speedSlider.style.top = '10px';
speedSlider.style.left = '10px';
document.body.appendChild(speedSlider);

let lastTime = performance.now();
const animate = () => {
    const currentTime = performance.now();
    const timeElapsed = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    for (const planet of planets) {
        planet.updatePosition(timeElapsed * speedSlider.value);
    }
    moon.updatePosition(timeElapsed * speedSlider.value);

    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
};

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
