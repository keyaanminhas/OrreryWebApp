# Solar System Orrery Web App

This project is a 3D solar system simulation built with Three.js, visualizing the planets orbiting the Sun based on accurate Keplerian mechanics and incorporating realistic planetary rotation. The app displays an interactive model of the solar system, showcasing the orbits, rotations, and distinct textures for each celestial body, along with key orbital details.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [How to Use](#how-to-use)
- [Customization Options](#customization-options)
- [Future Enhancements](#future-enhancements)
- [Acknowledgments](#acknowledgments)

## Features

- **Realistic Orbits**: Planetary motion based on Kepler's laws, with data obtained from NASA.
- **Rotating Planets**: Each planet rotates around its own axis according to its real rotation period.
- **Interactive UI**: Click on any planet to view additional information.
- **Adjustable Time Scale**: Use a slider to change the speed of time and observe the effects on orbital motion.
- **Realistic Textures and Atmosphere**: Each planet has unique textures, including Saturn's rings and Venus's atmospheric coloring.
- **Trail Effects**: Planets leave curved trails as they orbit the Sun, with trails that fade over time.

## Project Structure

- **`index.html`**: The main HTML file containing the UI layout and script references.
- **`app.js`**: Core JavaScript file where Three.js is initialized, and all celestial objects, animations, and interactions are handled.
- **`Planet.js`**: A class-based module for defining planet properties and updating their orbits and rotations.
- **`textures/`**: A folder containing image textures for each planet, including rings and atmospheres.
- **`assets/`**: Additional assets used for UI components.

## Technologies Used

- **Three.js**: 3D rendering library used for creating the orrery and animations.
- **JavaScript (ES6)**: Programming language for logic, interactions, and animations.
- **HTML/CSS**: Base web technologies for structuring and styling the web app.
- **NASA Keplerian Data**: Data source for the accurate modeling of planetary orbits.

## Getting Started

To run the project locally:

1. Clone the repository:  
   ```bash
   git clone https://github.com/yourusername/solar-system-orrery.git
