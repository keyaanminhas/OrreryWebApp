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

// Planet class to create planets and update positions
class Planet {
    constructor(name, size, semiMajorAxis, eccentricity, orbitalPeriod, rotationPeriod, textureUrl, ringTextureUrl = null) {
        this.name = name;
        this.geometry = new THREE.SphereGeometry(size, 32, 32);
        this.material = new THREE.MeshBasicMaterial({
            map: textureLoader.load(textureUrl),  // Load texture
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.semiMajorAxis = semiMajorAxis; // Distance from the Sun (in AU)
        this.eccentricity = eccentricity; // Orbit shape
        this.orbitalPeriod = orbitalPeriod; // Time to complete one orbit (in Earth years)
        this.rotationPeriod = rotationPeriod; // Time to complete one rotation (in Earth hours)
        this.angle = 0; // Current angle in the orbit
        this.rotationAngle = 0; // Current angle for rotation
        scene.add(this.mesh);

        // If a ring texture is provided, create the rings
        if (ringTextureUrl) {
            const ringGeometry = new THREE.RingGeometry(size * 1.5, size * 2, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                map: textureLoader.load(ringTextureUrl),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.7,
            });
            this.ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
            this.ringMesh.rotation.x = Math.PI / 2; // Rotate the ring to be flat
            scene.add(this.ringMesh);
        }
    }

    updatePosition(timeElapsed) {
        // Calculate the angle based on time elapsed
        const angularSpeed = (2 * Math.PI) / (this.orbitalPeriod * 365) * timeScale; // Full orbit in radians per time unit (365 days in a year)
        this.angle += angularSpeed * timeElapsed; // Update angle
        this.angle %= 2 * Math.PI; // Keep angle within 0 to 2π

        // Calculate the distance from the Sun using the eccentricity and semi-major axis
        const radius = this.semiMajorAxis * (1 - this.eccentricity * Math.cos(this.angle)); // Simple approximation
        this.mesh.position.x = radius * Math.cos(this.angle); // Update x position
        this.mesh.position.z = radius * Math.sin(this.angle);
        
        // Update rotation
        const rotationAngularSpeed = (2 * Math.PI) / (this.rotationPeriod * 3600); // Convert rotation period to seconds
        this.rotationAngle += rotationAngularSpeed * timeElapsed; // Rotation speed in radians
        this.mesh.rotation.y = this.rotationAngle; // Update rotation around Y-axis

        // Update ring position if it exists
        if (this.ringMesh) {
            this.ringMesh.position.copy(this.mesh.position);
        }
    }
}

// Moon class to create moons for planets
class Moon {
    constructor(parentPlanet, size, distance, orbitalPeriod, rotationPeriod, textureUrl) {
        this.parentPlanet = parentPlanet;
        this.geometry = new THREE.SphereGeometry(size, 32, 32);
        this.material = new THREE.MeshBasicMaterial({
            map: textureLoader.load(textureUrl),  // Load texture
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.distance = distance; // Distance from the parent planet
        this.orbitalPeriod = orbitalPeriod; // Time to complete one orbit (in Earth days)
        this.rotationPeriod = rotationPeriod; // Time to complete one rotation (in Earth hours)
        this.angle = 0; // Current angle in the orbit
        this.rotationAngle = 0; // Current angle for rotation
        scene.add(this.mesh);
    }

    updatePosition(timeElapsed) {
        // Calculate the angle based on time elapsed
        const angularSpeed = (2 * Math.PI) / (this.orbitalPeriod); // Full orbit in radians per time unit (in days)
        this.angle += angularSpeed * timeElapsed; // Update angle
        this.angle %= 2 * Math.PI; // Keep angle within 0 to 2π

        // Update moon's position relative to its parent planet
        const parentPos = this.parentPlanet.mesh.position;
        this.mesh.position.x = parentPos.x + this.distance * Math.cos(this.angle);
        this.mesh.position.z = parentPos.z + this.distance * Math.sin(this.angle);

        // Update rotation
        const moonRotationAngularSpeed = (2 * Math.PI) / (this.rotationPeriod * 3600); // Convert rotation period to seconds
        this.rotationAngle += moonRotationAngularSpeed * timeElapsed; // Rotation speed in radians
        this.mesh.rotation.y = this.rotationAngle; // Update rotation around Y-axis
    }
}

// Create planets with accurate sizes (relative to Earth) and Kepler parameters
const planets = [
    new Planet('Mercury', 0.38, 10, 0.2056, 0.24, 1407.6, 'textures/mercury.jpg', null),
    new Planet('Venus', 0.95, 15, 0.0068, 0.615, 5832.5, 'textures/venus_surface.jpg', null),
    new Planet('Earth', 1, 20, 0.0167, 1, 24, 'textures/earth.jpg', null),
    new Planet('Mars', 0.53, 25, 0.0934, 1.881, 24.6, 'textures/mars.jpg', null),
    new Planet('Jupiter', 11.2, 40, 0.0485, 11.86, 9.9, 'textures/jupiter.jpg', null),
    new Planet('Saturn', 9.45, 50, 0.0565, 29.46, 10.7, 'textures/saturn.jpg', 'textures/saturn_ring.png'),
    new Planet('Uranus', 4, 70, 0.0464, 84.01, 17.2, 'textures/uranus.jpg', null),
    new Planet('Neptune', 3.88, 90, 0.0086, 164.79, 16.1, 'textures/neptune.jpg', null),
];

// Create a Moon for Earth
const moon = new Moon(planets[2], 0.27, 2.5, 27.3, 27.3, 'textures/moon.jpg'); // Earth (index 2)

// Set camera position
camera.position.z = 120;

// Create a popup element for planet descriptions
const popup = document.createElement('div');
popup.style.position = 'absolute';
popup.style.top = '10px';
popup.style.right = '10px';
popup.style.width = '300px';
popup.style.padding = '10px';
popup.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
popup.style.borderRadius = '8px';
popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
popup.style.display = 'none'; // Initially hidden
popup.style.zIndex = 1000;
document.body.appendChild(popup);

// Create a speed control slider
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

// Animation loop
let lastTime = performance.now();
const animate = () => {
    const currentTime = performance.now();
    const timeElapsed = (currentTime - lastTime) / 1000; // Time in seconds
    lastTime = currentTime;

    // Update planets and moons
    for (const planet of planets) {
        planet.updatePosition(timeElapsed * speedSlider.value); // Update with speed factor
    }
    moon.updatePosition(timeElapsed * speedSlider.value); // Update moon

    // Render scene
    controls.update(); // Update controls
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
};

animate();

// Event listener for mouse clicks on planets
renderer.domElement.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));

    if (intersects.length > 0) {
        const planet = intersects[0].object;
        const planetIndex = planets.findIndex(p => p.mesh === planet);
        if (planetIndex !== -1) {
            popup.style.display = 'block';
            popup.innerHTML = `<h3>${planets[planetIndex].name}</h3><p>Details about ${planets[planetIndex].name}...</p>`;
        }
    } else {
        popup.style.display = 'none'; // Hide if not clicking on any planet
    }
});

// Hide popup on click elsewhere
document.addEventListener('click', (event) => {
    if (!popup.contains(event.target) && !renderer.domElement.contains(event.target)) {
        popup.style.display = 'none';
    }
});

// Adjust the scene on window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
