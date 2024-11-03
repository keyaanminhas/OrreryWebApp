from flask import Flask, request, jsonify, render_template

app = Flask(__name__)
from datetime import datetime

from planets_data import *



# Endpoint 1: process data for one feature
@app.route('/planets', methods=['GET'])
def planet_info():
    
    # You can add your processing logic here
    response = {
        "planets": ["Mercury","Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"]
    }
    return jsonify(response)

# Endpoint 2: process data for another feature
@app.route('/planet-position', methods=['POST'])
def planet_position():
    # Retrieve data from POST request
    planet_name = request.form.get('planet_name')
    j_date = request.form.get('julian_date')
    utc_date = request.form.get('utc_date')
    if not j_date and not utc_date:
        utc_date = datetime.datetime.now().strftime("%d-%m-%Y")
    utc_date = datetime.datetime.strptime(utc_date, "%d-%m-%Y")
    deltaE = request.form.get('delta') or 0.0001
    if not j_date and utc_date:
        j_date = julian_date(utc_date)

    x1, y1,z1, x2,y2,z2, error = calculate_coordinates(planet_name, float(j_date), float(deltaE))

    
    response = {
        "au": {
            "x": x1,
            "y": y1,
            "z": z1
        },
        "km": {
            "x": x2,
            "y": y2,
            "z": z2,
        },
        "deltaE": error,
        "julianDate": j_date
    }
    return jsonify(response)


# Route to serve frontend for the second endpoint
@app.route('/')
@app.route('/position')
def position_page():
    return render_template('planet_position.html')

if __name__ == '__main__':
    app.run(host = "0.0.0.0", port = 5000)
