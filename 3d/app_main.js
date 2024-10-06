import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';

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
        this.semiMajorAxis = semiMajorAxis; // Distance from the Sun
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
        this.mesh.position.z = radius * Math.sin(this.angle); // Update z position
        
        // Update rotation
        this.rotationAngle += (360 / this.rotationPeriod) * (timeElapsed / 3600); // Rotation speed in degrees
        this.mesh.rotation.y = THREE.MathUtils.degToRad(this.rotationAngle); // Convert to radians

        // Update ring position if it exists
        if (this.ringMesh) {
            this.ringMesh.position.copy(this.mesh.position);
        }
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

// Create the Moon
const moonGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const moonTexture = textureLoader.load('textures/moon.jpg');
const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

// Set camera position
camera.position.z = 120;

// Position the moon
const earth = planets[2]; // Reference to Earth
moon.position.set(earth.mesh.position.x + 2, 0, earth.mesh.position.z); // Position the moon relative to Earth

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

// Handle clicks to show celestial body details
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let lockedPlanet = null;

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([...planets.map(planet => planet.mesh), sun, moon]);
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        
        if (clickedObject === sun) {
            // Show popup for Sun
            popup.innerHTML = `
                <strong>Sun</strong><br>
                <strong>Type:</strong> G-type Main-sequence Star<br>
                <strong>Distance:</strong> 0 AU (center of the solar system)<br>
                <strong>Radius:</strong> 695,508 km<br>
                <strong>Temperature:</strong> 5,500 °C<br>
                <strong>Mass:</strong> 1.989 × 10<sup>30</sup> kg<br>
            `;
            popup.style.display = 'block'; // Show the popup
            lockedPlanet = null; // Clear locked planet
        } else if (clickedObject === moon) {
            // Show popup for Moon
            popup.innerHTML = `
                <strong>Moon</strong><br>
                <strong>Type:</strong> Natural Satellite<br>
                <strong>Distance from Earth:</strong> 384,400 km<br>
                <strong>Orbital Period:</strong> 27.3 days<br>
                <strong>Rotation Period:</strong> 27.3 days<br>
                <strong>Mass:</strong> 7.342 × 10<sup>22</sup> kg<br>
            `;
            popup.style.display = 'block'; // Show the popup
            lockedPlanet = null; // Clear locked planet
        } else {
            const clickedPlanet = planets.find(planet => planet.mesh === clickedObject);
            // Show popup with planet description
            popup.innerHTML = `
                <strong>${clickedPlanet.name}</strong><br>
                <strong>Distance from Sun:</strong> ${clickedPlanet.semiMajorAxis} AU<br>
                <strong>Orbital Period:</strong> ${clickedPlanet.orbitalPeriod} Earth years<br>
                <strong>Rotation Period:</strong> ${clickedPlanet.rotationPeriod} hours<br>
                <strong>Mass:</strong> TBD<br>
            `;
            popup.style.display = 'block'; // Show the popup
            lockedPlanet = clickedPlanet; // Set locked planet
        }
    } else {
        popup.style.display = 'none'; // Hide popup if nothing is clicked
        lockedPlanet = null; // Clear locked planet
    }
});

// Create time scale slider
const sliderContainer = document.createElement('div');
sliderContainer.style.position = 'absolute';
sliderContainer.style.top = '10px';
sliderContainer.style.left = '10px';
sliderContainer.style.zIndex = 1000;

const slider = document.createElement('input');
slider.type = 'range';
slider.min = '1';
slider.max = '10';
slider.value = '1';
slider.step = '1';
slider.style.width = '300px';

const sliderLabel = document.createElement('span');
sliderLabel.innerText = 'Time Scale: 1x';

sliderContainer.appendChild(slider);
sliderContainer.appendChild(sliderLabel);
document.body.appendChild(sliderContainer);

// Update time scale when slider value changes
slider.addEventListener('input', (event) => {
    timeScale = Number(event.target.value);
    sliderLabel.innerText = `Time Scale: ${timeScale}x`;
});

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
let lastTime = Date.now();
let timeScale = 1; // Controls speed of the simulation

function animate() {
    requestAnimationFrame(animate);
    const currentTime = Date.now();
    const timeElapsed = (currentTime - lastTime) / 1000; // Time elapsed in seconds
    lastTime = currentTime;

    // Update planet positions
    planets.forEach(planet => planet.updatePosition(timeElapsed));

    // Update Moon position relative to Earth
    moon.position.set(
        earth.mesh.position.x + 2 * Math.cos(earth.angle),
        0,
        earth.mesh.position.z + 2 * Math.sin(earth.angle)
    );

    // Update controls and render the scene
    controls.update();
    renderer.render(scene, camera);
}

// Start the animation
animate();
