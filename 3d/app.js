import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
let timeScale = 1; // Default time scale for real-time simulation


// Define maximum number of trail points and fade duration
const details = [
    { name: 'Mercury', radius: 2439.7, distance: 57.9, period: 88, offset: -150, rotation_period: 58.6, info: {
        density: 5.43,
        gravity: 3.7,
        temperature: 167,
        moons: 0,
        made_of: 'Iron, Nickel',
        description: 'Mercury is the smallest planet in the Solar System and the closest to the Sun. Its orbit around the Sun takes 87.97 Earth days, the shortest of all the planets in the Solar System. It is named after the Roman deity Mercury, the messenger of the gods.'
    } },
    { name: 'Venus', radius: 6051.8, distance: 108.2, period: 224.7, offset: -90, rotation_period: -243, info: {
        density: 5.24,
        gravity: 8.87,
        temperature: 464,
        moons: 0,
        made_of: 'Silicate rock',
        description: 'Venus is the second planet from the Sun. It is named after the Roman goddess of love and beauty. As the brightest natural object in Earth\'s night sky after the Moon, Venus can cast shadows and can be, on rare occasion, visible to the naked eye in broad daylight.'
    } },
    { name: 'Earth', radius: 6371, distance: 149.6, period: 365.2, offset: 10, rotation_period: 1, info: {
        density: 5.52,
        gravity: 9.81,
        temperature: 15,
        moons: 1,
        made_of: 'Iron, Oxygen, Silicon, Magnesium, Sulfur, Nickel, Calcium, Aluminum',
        description: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life. According to radiometric dating and other evidence, Earth formed over 4.5 billion years ago.'
    }},
    { name: 'Mars', radius: 3389.5, distance: 227.9, period: 687, offset: 55, rotation_period: 1.03, info: {
        density: 3.93,
        gravity: 3.71,
        temperature: -65,
        moons: 2,
        made_of: 'Iron, Oxygen, Silicon, Magnesium, Sulfur, Nickel, Calcium, Aluminum',
        description: 'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, being larger than only Mercury. In English, Mars carries a name of the Roman god of war and is often referred to as the "Red Planet".'
    }},
    { name: 'Jupiter', radius: 69911, distance: 778.6, period: 4331, offset: 70, rotation_period: 0.41, info: {
        density: 1.33,
        gravity: 24.79,
        temperature: -145,
        moons: 79,
        made_of: 'Hydrogen, Helium',
        description: 'Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun, but two-and-a-half times that of all the other planets in the Solar System combined.'
    }},
    { name: 'Saturn', radius: 58232, distance: 1433.5, period: 10747, offset: -10, rotation_period: 0.44, info: {
        density: 0.69,
        gravity: 10.44,
        temperature: -178,
        moons: 62,
        made_of: 'Hydrogen, Helium',
        description: 'Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius about nine times that of Earth.'
    }},
    { name: 'Uranus', radius: 25362, distance: 2872.5, period: 30589, offset: 50, rotation_period: -0.72, info: {
        density: 1.27,
        gravity: 8.69,
        temperature: -216,
        moons: 27,
        made_of: 'Ice, Rock',
        description: 'Uranus is the seventh planet from the Sun. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System.'
    }},
    { name: 'Neptune', radius: 24622, distance: 4495.1, period: 59800, offset: -5, rotation_period: 0.67, info: {
        density: 1.64,
        gravity: 11.15,
        temperature: -214,
        moons: 14,
        made_of: 'Ice, Rock',
        description: 'Neptune is the eighth and farthest known planet from the Sun in the Solar System. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet.'
    }}
];

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
const light = new THREE.PointLight(0xfff7cc, 2, 500);
light.position.set(0, 0, 0); // Sun at the origin
scene.add(light);

// Create the Sun with a texture
const sunTexture = new THREE.TextureLoader().load('textures/sun.jpg');
const sunGeometry = new THREE.SphereGeometry(25, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create a star system with 10000 point lights
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, emissive: 0xffffff });
for (let i = 0; i < 25; i++) {
    const starLight = new THREE.PointLight(0xffffff, 0.5, 600); // Increase distance to 1000
    let x, y, z;
    do {
        x = THREE.MathUtils.randFloatSpread(1000);
        y = THREE.MathUtils.randFloatSpread(1000);
        z = THREE.MathUtils.randFloatSpread(1000);
    } while (Math.sqrt(x * x + y * y + z * z) < 700);
    starLight.position.set(x, y, z);
    scene.add(starLight);
}

const starVertices = [];
const starSizes = [];
for (let i = 0; i < 25000; i++) {
    let x = THREE.MathUtils.randFloatSpread(1000)*3;
    let y = THREE.MathUtils.randFloatSpread(1000)*3;
    let z = THREE.MathUtils.randFloatSpread(1000)*3;
    do {
        x = THREE.MathUtils.randFloatSpread(1000) * 3;
        y = THREE.MathUtils.randFloatSpread(1000) * 3;
        z = THREE.MathUtils.randFloatSpread(1000) * 3;
    } while (Math.abs(x) < 300 && Math.abs(y) < 300 && Math.abs(z) < 300);
    starVertices.push(x, y, z);
    starSizes.push(THREE.MathUtils.randFloat(10, 100)); // Random size between 0.1 and 1
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Create a background

// Texture loader for planets
const textureLoader = new THREE.TextureLoader();

// Planet class to create planets and update positions
class Planet {
    constructor(name, size, semiMajorAxis, eccentricity, orbitalPeriod, rotationPeriod, textureUrl, ringTextureUrl = null, initialAngle) {
        this.name = name;
        this.geometry = new THREE.SphereGeometry(size, 32, 32);
        this.material = new THREE.MeshPhongMaterial({
            map: textureLoader.load(textureUrl),  // Load texture
            emissive: 0x000000 // Initialize emissive property
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.semiMajorAxis = semiMajorAxis; // Distance from the Sun (in AU)
        this.eccentricity = eccentricity; // Orbit shape
        this.orbitalPeriod = orbitalPeriod; // Time to complete one orbit (in Earth years)
        this.rotationPeriod = rotationPeriod; // Time to complete one rotation (in Earth hours)
        this.angle = initialAngle; // Current angle in the orbit
        this.rotationAngle = 0; // Current angle for rotation
        this.ringMesh = null; // Initialize ringMesh to null
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
        this.angle -= angularSpeed * timeElapsed; // Update angle
        this.angle %= 2 * Math.PI; // Keep angle within 0 to 2π
    
        // Calculate the distance from the Sun using the eccentricity and semi-major axis
        const radius = 50 + this.semiMajorAxis * 4 * (1 - this.eccentricity * Math.cos(this.angle)); // Simple approximation
        this.mesh.position.x = radius * Math.cos(this.angle); // Update x position
        this.mesh.position.z = radius * Math.sin(this.angle);
    
        // Update rotation if planetary rotation is enabled
        if (document.getElementById('planetaryRotationCheckbox').checked) {
            const rotationAngularSpeed = (2 * Math.PI) / (this.rotationPeriod * 3600); // Convert rotation period to seconds
            this.rotationAngle += rotationAngularSpeed * timeElapsed; // Rotation speed in radians
            this.mesh.rotation.y = this.rotationAngle; // Update rotation around Y-axis
        }
    
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
        this.geometry = new THREE.SphereGeometry(size/2 + 3, 32, 32);
        this.material = new THREE.MeshBasicMaterial({
            map: textureLoader.load(textureUrl),  // Load texture
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.distance = distance; // Distance from the parent planet
        this.orbitalPeriod = orbitalPeriod; // Time to complete one orbit (in Earth days)
        this.rotationPeriod = rotationPeriod; // Time to complete one rotation (in hours)
        this.rotationAngle = 0; // Initial rotation angle
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

        // Update rotation if planetary rotation is enabled
        if (document.getElementById('planetaryRotationCheckbox').checked) {
            const moonRotationAngularSpeed = (2 * Math.PI) / (this.rotationPeriod * 3600); // Convert rotation period to seconds
            this.rotationAngle += moonRotationAngularSpeed * timeElapsed; // Rotation speed in radians
            this.mesh.rotation.y = this.rotationAngle; // Update rotation around Y-axis
        }
    }
}

// Create a checkbox for toggling stars

const starCheckbox = document.getElementById('starsCheckbox');

// Load star checkbox state from localStorage
const starCheckboxState = localStorage.getItem('starsCheckbox');
if (starCheckboxState !== null) {
    starCheckbox.checked = JSON.parse(starCheckboxState);
} else {
    starCheckbox.checked = true; // Default to checked on first boot
}

// Function to toggle stars visibility
const toggleStars = () => {
    stars.visible = starCheckbox.checked;
    scene.children.forEach(child => {
        // if (child instanceof THREE.PointLight && child !== light) {
        //     child.visible = starCheckbox.checked;
        // }
    });
    localStorage.setItem('starsCheckbox', JSON.stringify(starCheckbox.checked));
};

// Initial toggle based on checkbox state
toggleStars();

// Add event listener to checkbox
starCheckbox.addEventListener('change', toggleStars);

// Create planets with accurate sizes (relative to Earth) and Kepler parameters
const planets = [
    new Planet('Mercury', 0.38, 10, 0.2056, 0.24, 1407.6, 'textures/mercury.jpg', null, details[0].offset),
    new Planet('Venus', 0.95, 15, 0.0068, 0.615, 5832.5, 'textures/venus_surface.jpg', null, details[1].offset),
    new Planet('Earth', 1, 20, 0.0167, 1, 24, 'textures/earth.jpg', null, details[2].offset),
    new Planet('Mars', 0.53, 25, 0.0934, 1.881, 24.6, 'textures/mars.jpg', null, details[3].offset),
    new Planet('Jupiter', 11.2, 40, 0.0485, 11.86, 9.9, 'textures/jupiter.jpg', null, details[4].offset),
    new Planet('Saturn', 9.45, 50, 0.0565, 29.46, 10.7, 'textures/saturn.jpg', 'textures/saturn_ring.png', details[5].offset),
    new Planet('Uranus', 4, 70, 0.0464, 84.01, 17.2, 'textures/uranus.jpg', null, details[6].offset),
    new Planet('Neptune', 3.88, 90, 0.0086, 164.79, 16.1, 'textures/neptune.jpg', null, details[7].offset),
];

// Create a Moon for Earth
const moon = new Moon(planets[2], 0.27, 2.5, 27.3, 27.3, 'textures/moon.jpg'); // Earth (index 2)

// Set camera position
camera.position.z = 120;

// Create a popup element for planet descriptions
function createModal(planet) {
    const modal = document.createElement('modal');
    modal.classList.add('modal');
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.color = 'white';
    modal.style.padding = '20px';
    modal.style.borderRadius = '10px';
    modal.style.zIndex = '1000';

    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.style.marginTop = '10px';
    closeButton.addEventListener('click', () => {
        modal.remove();
    });

    const planetInfo = `
    <h2>${planet.name}</h2>
    <p><strong>Radius:</strong> ${planet.radius} km</p>
    <p><strong>Distance from Sun:</strong> ${planet.distance} million km</p>
    <p><strong>Orbital Period:</strong> ${planet.period} days</p>
    <p><strong>Rotation Period:</strong> ${planet.rotation_period} days</p>
    <p><strong>Density:</strong> ${planet.info.density} g/cm³</p>
    <p><strong>Gravity:</strong> ${planet.info.gravity} m/s²</p>
    <p><strong>Temperature:</strong> ${planet.info.temperature} °C</p>
    <p><strong>Moons:</strong> ${planet.info.moons}</p>
    <p><strong>Composition:</strong> ${planet.info.made_of}</p>
    <p>${planet.info.description}</p>
    `;

    modal.innerHTML = planetInfo;
    modal.appendChild(closeButton);
    document.body.appendChild(modal);
}

// Create a speed control slider
const speedSlider = document.createElement('input');
speedSlider.type = 'range';
speedSlider.min = '0.1';
speedSlider.max = '1000';
speedSlider.value = '1';
speedSlider.step = '0.1';
speedSlider.style.position = 'absolute';
speedSlider.style.top = '10px';
speedSlider.style.left = '10px';
document.body.appendChild(speedSlider);

// Create a date display element
const dateDisplay = document.createElement('div');
dateDisplay.style.position = 'absolute';
dateDisplay.style.top = '10px';
dateDisplay.style.right = '10px';
dateDisplay.style.color = 'white';
dateDisplay.style.fontSize = '20px';
document.body.appendChild(dateDisplay);

// Create a pause/play button
const pausePlayButton = document.createElement('img');
pausePlayButton.src = './imgs/pause.png';
pausePlayButton.style.cursor = 'pointer';
pausePlayButton.style.position = 'absolute'
pausePlayButton.style.width = '40px';
pausePlayButton.style.top = '60px';
pausePlayButton.style.left = '10px';
document.body.appendChild(pausePlayButton);

let isPaused = false;
pausePlayButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pausePlayButton.src = isPaused ? './imgs/play.png' : './imgs/pause.png';
});

// Animation loop
let lastTime = performance.now();
const animate = () => {
    if (!isPaused) {
        const currentTime = performance.now();
        const timeElapsed = (currentTime - lastTime) / 1000; // Time in seconds
        lastTime = currentTime;

        // Update planets and moons
        for (const planet of planets) {
            planet.updatePosition(timeElapsed * speedSlider.value); // Update with speed factor
        }
        moon.updatePosition(timeElapsed * speedSlider.value); // Update moon
    }

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
            const planetDetails = details[planetIndex].info;
            createModal({ name: details[planetIndex].name, radius: details[planetIndex].radius, distance: details[planetIndex].distance, period: details[planetIndex].period, rotation_period: details[planetIndex].rotation_period, info: planetDetails })
            ;
        }
    }
});

// Event listener for touch events on planets
renderer.domElement.addEventListener('touchstart', (event) => {
    if (event.touches.length === 1) {
        const touch = event.touches[0];
        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));

        if (intersects.length > 0) {
            const planet = intersects[0].object;
            const planetIndex = planets.findIndex(p => p.mesh === planet);
            if (planetIndex !== -1) {
                const planetDetails = details[planetIndex].info;
                createModal({ name: details[planetIndex].name, radius: details[planetIndex].radius, distance: details[planetIndex].distance, period: details[planetIndex].period, rotation_period: details[planetIndex].rotation_period, info: planetDetails });
                controls.target.copy(planet.position);
                controls.update();
            }
        }
    }
});

let initialPinchDistance = null;
renderer.domElement.addEventListener('touchmove', (event) => {
    if (event.touches.length === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (initialPinchDistance === null) {
            initialPinchDistance = distance;
        } else {
            const delta = distance - initialPinchDistance;
            camera.position.z -= delta * 0.07; // Adjust the speed factor as needed
            initialPinchDistance = distance;
        }
    }
});

renderer.domElement.addEventListener('touchend', (event) => {
    if (event.touches.length < 2) {
        initialPinchDistance = null;
    }
});

// Event listener for mouse hover on planets
renderer.domElement.addEventListener('mousemove', (event) => {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));

    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        intersects[0].object.material.emissive.setHex(0x333300); // Add drop shadow effect
    } else {
        document.body.style.cursor = 'default';
        planets.forEach(planet => {
            if (planet.mesh.material.emissive) {
                planet.mesh.material.emissive.setHex(0x000000); // Remove drop shadow effect
            }
        });
    }
});

// Event listener for clicking/tapping on the Sun
renderer.domElement.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(sun);

    if (intersects.length > 0) {
        controls.target.copy(sun.position);
        controls.update();
    }
});

renderer.domElement.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

})

// Hide popup on click elsewhere
document.addEventListener('click', (event) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (!modal.contains(event.target) && !renderer.domElement.contains(event.target)) {
            modal.remove();
        }
    });
});

// Adjust the scene on window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Create a dropdown for selecting planets
const dropdown = document.createElement('select');
dropdown.style.position = 'absolute';
dropdown.style.top = '110px';
dropdown.style.left = '10px';
document.body.appendChild(dropdown);

// Populate the dropdown with planet names
details.forEach((planet, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.text = planet.name;
    dropdown.appendChild(option);
});

// Event listener for dropdown selection
dropdown.addEventListener('change', (event) => {
    const selectedIndex = event.target.value;
    const selectedPlanet = planets[selectedIndex];
    if (selectedPlanet) {
        controls.target.copy(selectedPlanet.mesh.position);
        controls.update();
        // Smoothly move the camera closer to the selected planet
        const targetPosition = new THREE.Vector3();
        targetPosition.copy(selectedPlanet.mesh.position);
        targetPosition.z += 5; // Adjust this value to control how close the camera gets
    }
});
// Create a zoom slider
const zoomSlider = document.createElement('input');
zoomSlider.type = 'range';
zoomSlider.min = '5';
zoomSlider.max = '75';
zoomSlider.value = '75'; // Default to the lowest value (widest FOV)
zoomSlider.step = '1';
zoomSlider.style.position = 'absolute';
zoomSlider.style.bottom = '150px';
zoomSlider.style.left = '-50px';
zoomSlider.style.transform = 'rotate(90deg)'
document.body.appendChild(zoomSlider);

// Event listener for zoom slider
zoomSlider.addEventListener('input', (event) => {
    camera.fov = event.target.value;
    camera.updateProjectionMatrix();
});