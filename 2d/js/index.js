function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth*4;
canvas.height = window.innerHeight*4;
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '-1';
canvas.style.transform = 'translate(-50%, -50%)';
document.getElementsByClassName("container")[0].appendChild(canvas);

const ctx = canvas.getContext('2d');

function drawStars() {
    for (let i = 0; i < 6400; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
}

drawStars();

let timeMultiplier = 0.005;
let time = 0;
let isPaused = false;
const center = [window.innerWidth / 2, window.innerHeight / 2];
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
    { name: 'Saturn', radius: 58232, distance: 1433.5, period: 10747, offset: -10, rotation_period: -365, info: {
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

let o_vel = details.map((planet) => {
    return 360 / planet.period;
});


const sun = document.createElement('div');
sun.classList.add('sun', 'zoom-in');
document.getElementsByClassName("container")[0].appendChild(sun);

const planetEls = [];

function createPlanetElements(planets) {
    planetEls.forEach(el => el.remove());
    planetEls.length = 0;

    planets.forEach((planet, index) => {
        let planetEl = document.createElement('img');
        planetEl.classList.add('planet');
        planetEl.src = `./imgs/${planet.name.toLowerCase()}.png`;
        planetEl.style.height = `${planet.radius / 696340 * 400 + 20}px`;
        planetEl.style.width = `auto`;
        planetEl.style.zIndex = 100;
        planetEl.style.left = `${center[0]}px`;
        planetEl.style.top = `${center[1]}px`;
        // planetEl.style.transformOrigin = `0 ${planet.radius / 696340 * 50}%`;
        document.getElementsByClassName("container")[0].appendChild(planetEl);
        planetEls.push(planetEl);
        setInterval(() => {
            updateAngle(planet, index, planetEl);
        }, 1000 / 60);
        planetEl.addEventListener('click', () => {
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
        });
    });
}

createPlanetElements(details.slice(0, 4));

const slider = document.createElement('input');
slider.classList.add('slider');
slider.type = 'range';
slider.min = '0.001';
slider.max = '0.5';
slider.step = '0.001';
slider.value = timeMultiplier;
slider.style.position = 'absolute';
slider.style.top = '15px';
slider.style.left = '10px';
document.body.appendChild(slider);

const sliderLabel = document.createElement('label');
sliderLabel.style.display = 'none';
sliderLabel.innerText = `Time Multiplier: ${timeMultiplier}`;
sliderLabel.style.position = 'absolute';
sliderLabel.style.top = '20px';
sliderLabel.style.left = '10px';
document.body.appendChild(sliderLabel);

slider.addEventListener('input', (event) => {
    timeMultiplier = parseFloat(event.target.value);
    sliderLabel.innerText = `Time Multiplier: ${timeMultiplier}`;
});

const dateLabel = document.createElement('div');
dateLabel.style.position = 'absolute';
dateLabel.style.top = '30px';
dateLabel.style.left = '10px';
dateLabel.style.color = 'white';
document.body.appendChild(dateLabel);

function updateDate() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + time );
    dateLabel.innerText = `Date: ${currentDate.toDateString()}`;
}

setInterval(updateDate, 1000 / 60);

const pauseButton = document.createElement('img');
pauseButton.classList.add('pause');
pauseButton.src = './imgs/pause.png';
pauseButton.style.position = 'absolute';
pauseButton.style.top = '50px';
pauseButton.style.left = '10px';
document.body.appendChild(pauseButton);

const resetButton = document.createElement('img');
resetButton.classList.add('pause');
resetButton.src = './imgs/reset.png';
resetButton.style.position = 'absolute';
resetButton.style.top = '50px';
resetButton.style.left = '60px';
document.body.appendChild(resetButton);
resetButton.addEventListener('click', () => {
    time = 0;
    timeMultiplier = 0.005;
    slider.value = timeMultiplier;
});

pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.src = isPaused ? './imgs/play.png' : './imgs/pause.png';
});

const planetGroupSelect = document.createElement('select');
planetGroupSelect.style.position = 'absolute';
planetGroupSelect.style.top = '100px';
planetGroupSelect.style.left = '10px';
const option1 = document.createElement('option');
option1.value = 'first4';
option1.innerText = 'Inner Planets';
const option2 = document.createElement('option');
option2.value = 'last4';
option2.innerText = 'Outer Planets';
planetGroupSelect.appendChild(option1);
planetGroupSelect.appendChild(option2);
document.body.appendChild(planetGroupSelect);

planetGroupSelect.addEventListener('change', (event) => {
    const value = event.target.value;
    if (value === 'first4') {
        createPlanetElements(details.slice(0, 4));
        sun.classList.remove('zoom-out');
        sun.classList.add('zoom-in');
    } else {
        createPlanetElements(details.slice(4));
        sun.classList.remove('zoom-in');
        sun.classList.add('zoom-out');
    }
});

function updateRotation(planet, planetEl) {
    let rotationAngle = -10 + (time * 365 / planet.rotation_period) % 360;
    planetEl.style.transform = `rotate(${rotationAngle}deg)`;
}

const config = {
    showStars: true,
    enableRotation: false
};

function saveConfig() {
    localStorage.setItem('orreryConfig', JSON.stringify(config));
}

function loadConfig() {
    let savedConfig = localStorage.getItem('orreryConfig');
    if (savedConfig) {
        Object.assign(config, JSON.parse(savedConfig));
    }
    if (!savedConfig) {
        saveConfig();
        savedConfig = localStorage.getItem('orreryConfig');
    }
    if (savedConfig.showStars) {
        drawStars();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

loadConfig();

const configContainer = document.createElement('div');
configContainer.style.position = 'absolute';
configContainer.style.top = '150px';
configContainer.style.left = '10px';
configContainer.style.color = 'white';
document.body.appendChild(configContainer);

const showStarsCheckbox = document.createElement('input');
showStarsCheckbox.type = 'checkbox';
showStarsCheckbox.checked = config.showStars;
const showStarsLabel = document.createElement('label');
showStarsLabel.innerText = ' Show Stars';
configContainer.appendChild(showStarsCheckbox);
configContainer.appendChild(showStarsLabel);
configContainer.appendChild(document.createElement('br'));
const enableRotationCheckbox = document.createElement('input');
enableRotationCheckbox.type = 'checkbox';
enableRotationCheckbox.checked = config.enableRotation;
const enableRotationLabel = document.createElement('label');
enableRotationLabel.innerText = ' Enable Rotation';
configContainer.appendChild(enableRotationCheckbox);
configContainer.appendChild(enableRotationLabel);

const zoomSlider = document.createElement('input');
zoomSlider.type = 'range';
zoomSlider.min = '0.5';
zoomSlider.max = '2';
zoomSlider.step = '0.01';
zoomSlider.value = '1';
zoomSlider.style.position = 'absolute';
zoomSlider.style.bottom = '100px';
zoomSlider.style.left = '-50px';
zoomSlider.style.transform = 'rotate(-90deg)';
document.body.appendChild(zoomSlider);

const container = document.getElementsByClassName('container')[0];

zoomSlider.addEventListener('input', (event) => {
    const scale = event.target.value;
    container.style.transition = 'transform 0.3s ease-in-out';
    container.style.transform = `scale(${scale})`;
});

resetButton.addEventListener('click', () => {
    time = 0;
    zoomSlider.value = '1';
    container.style.transition = 'transform 0.3s ease-in-out';
    container.style.transform = 'scale(1)';
});

let initialDistance = null;

function handlePinchZoom(event) {
    event.preventDefault();
    if (event.touches.length === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const currentDistance = Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);

        if (initialDistance === null) {
            initialDistance = currentDistance;
        } else {
            const scaleChange = currentDistance / initialDistance;
            let newScale = parseFloat(zoomSlider.value) * scaleChange;
            newScale = Math.max(0.5, Math.min(2, newScale));
            zoomSlider.value = newScale;
            container.style.transition = 'transform 0.1s ease-in-out';
            container.style.transform = `scale(${newScale})`;
            initialDistance = currentDistance;
        }
    }
}

function resetPinchZoom() {
    initialDistance = null;
}

document.addEventListener('touchmove', handlePinchZoom, { passive: false });
document.addEventListener('touchend', resetPinchZoom, { passive: false });
document.addEventListener('touchcancel', resetPinchZoom, { passive: false });
document.addEventListener('wheel', (event) => {
    if (event.ctrlKey) {
        event.preventDefault();
        let newScale = parseFloat(zoomSlider.value) - event.deltaY * 0.001;
        newScale = Math.max(0.5, Math.min(2, newScale));
        zoomSlider.value = newScale;
        container.style.transition = 'transform 0.1s ease-in-out';
        container.style.transform = `scale(${newScale})`;
    }
}, { passive: false });

showStarsCheckbox.addEventListener('change', (event) => {
    config.showStars = event.target.checked;
    saveConfig();
    if (config.showStars) {
        drawStars();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

enableRotationCheckbox.addEventListener('change', (event) => {
    config.enableRotation = event.target.checked;
    saveConfig();
});

function updateAngle(planet, index, planetEl) {
    let angle = o_vel[index] * time + planet.offset;
    if (planetGroupSelect.value === 'first4') {
        radialLen = 80 + (index + 1) * 70;
    } else {
        radialLen = 50 + (index + 1) * 150;
    }
    let x = Math.cos(angle / 360 * 2 * Math.PI) * radialLen;
    let y = Math.sin(angle / 360 * 2 * Math.PI) * radialLen;
    planetEl.style.left = `${center[0] + x}px`;
    planetEl.style.top = `${center[1] - y}px`;
    if (config.enableRotation || planet.name === 'Saturn') {
        updateRotation(planet, planetEl);
    }
    if (!isPaused) {
        time += timeMultiplier;
    }
}

if (config.showStars) {
    drawStars();
}