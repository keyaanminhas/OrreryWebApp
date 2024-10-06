from flask import Flask, request, jsonify, render_template

app = Flask(__name__)


from planets_data import calculate_coordinates



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
    julian_date = request.form.get('julian_date')

    x1, y1,z1, x2,y2,z2 = calculate_coordinates(planet_name, float(julian_date))
    
    
    response = {
        "message": f"Calculating position for {planet_name} on Julian Date {julian_date}",
        "X-Coordinate (AU)": x1,
        "Y-Coordinate (AU)": y1,
        "Z-Coordinate (AU)": z1,
        "X-Coordinate (km)": x2,
        "Y-Coordinate (km)": y2,
        "Z-Coordinate (km)": z2,
    }
    return jsonify(response)


# Route to serve frontend for the second endpoint
@app.route('/')
@app.route('/position')
def position_page():
    return render_template('planet_position.html')

if __name__ == '__main__':
    app.run(debug=True, host = "0.0.0.0", port = 5000)
