import numpy as np
import datetime
global planet_data
planet_data = [
    {
        "name": "Mercury",
        "a": [0.38709843, 0.00000000],
        "e": [0.20563661, 0.00002123],
        "I": [7.00559432, -0.00590158],
        "L": [252.25166724, 149472.67486623],
        "long_peri": [77.45771895, 0.15940013],
        "long_node": [48.33961819, -0.12214182],
        "b": 0,
        "c": 0,
        "s": 0,
        "f": 0
    },
    {
        "name": "Venus",
        "a": [0.72332102, -0.00000026],
        "e": [0.00676399, -0.00005107],
        "I": [3.39777545, 0.00043494],
        "L": [181.97970850, 58517.81560260],
        "long_peri": [131.76755713, 0.05679648],
        "long_node": [76.67261496, -0.27274174],
        "b": 0,
        "c": 0,
        "s": 0,
        "f": 0
    },
    {
        "name": "Earth",
        "a": [1.00000018, -0.00000003],
        "e": [0.01673163, -0.00003661],
        "I": [-0.00054346, -0.01337178],
        "L": [100.46691572, 35999.37306329],
        "long_peri": [102.93005885, 0.31795260],
        "long_node": [-5.11260389, -0.24123856],
        "b": 0,
        "c": 0,
        "s": 0,
        "f": 0
    },
    {
        "name": "Mars",
        "a": [1.52371243, 0.00000097],
        "e": [0.09336511, 0.00009149],
        "I": [1.85181869, -0.00724757],
        "L": [-4.56813164, 19140.29934243],
        "long_peri": [-23.91744784, 0.45223625],
        "long_node": [49.71320984, -0.26852431],
        "b": 0,
        "c": 0,
        "s": 0,
        "f": 0
    },
    {
        "name": "Jupiter",
        "a": [5.20248019, -0.00002864],
        "e": [0.04853590, 0.00018026],
        "I": [1.29861416, -0.00322699],
        "L": [34.33479152, 3034.90371757],
        "long_peri": [14.27495244, 0.18199196],
        "long_node": [100.29282654, 0.13024619],
        "b": -0.00012452,
        "c": 0.06064060,
        "s": -0.35635438,
        "f": 38.35125000
    },
    {
        "name": "Saturn",
        "a": [9.54149883, -0.00003065],
        "e": [0.05550825, -0.00032044],
        "I": [2.49424102, 0.00451969],
        "L": [50.07571329, 1222.11494724],
        "long_peri": [92.86136063, 0.54179478],
        "long_node": [113.63998702, -0.25015002],
        "b": 0.00025899,
        "c": -0.13434469,
        "s": 0.87320147,
        "f": 38.35125000
    },
    {
        "name": "Uranus",
        "a": [19.18797948, -0.00020455],
        "e": [0.04685740, -0.00001550],
        "I": [0.77298127, -0.00180155],
        "L": [314.20276625, 428.49512595],
        "long_peri": [172.43404441, 0.09266985],
        "long_node": [73.96250215, 0.05739699],
        "b": 0.00058331,
        "c": -0.97731848,
        "s": 0.17689245,
        "f": 7.67025000
    },
    {
        "name": "Neptune",
        "a": [30.06952752, 0.00006447],
        "e": [0.00895439, 0.00000818],
        "I": [1.77005520, 0.00022400],
        "L": [304.22289287, 218.46515314],
        "long_peri": [46.68158724, 0.01009938],
        "long_node": [131.78635853, -0.00606302],
        "b": -0.00041348,
        "c": 0.68346318,
        "s": -0.10162547,
        "f": 7.67025000
    }
]

def modulate_mean_anomaly(M):
    M = M % 360
    if M > 180:
        M -= 360
    return M

def calculate_coordinates(planet_name, JDate, error_amount=0.0001):
    global planet_data
    planet_name = planet_name.lower().capitalize()
    
    for data in planet_data:
        if data["name"] == planet_name:
            planet = data
            break
        
            
    name, a, e, I, L, long_peri, long_node, b, c, s, f = planet.values()

    T = (JDate - 2451545.0)/36525
    a1 = a[0] + a[1]*T
    e1 = e[0] + e[1]*T
    I1 = I[0] + I[1]*T
    L1 = L[0] + L[1]*T
    long_peri1 = long_peri[0] + long_peri[1]*T
    long_node1 = long_node[0] + long_node[1]*T
    if error_amount > 0.1 or error_amount < 0.000001:
        error_amount = 0.0001

    peri = long_peri1 - long_node1
    M = L1 - long_peri1 + b*(np.square(T)) + c*(np.cos(f*T)) + s*(np.sin(f*T))
    M1 = modulate_mean_anomaly(M)
    e2 = np.rad2deg(e1)
    E = M1 + e2*(np.sin(np.deg2rad(M1)))
    delta_M = M1 - (E - e2*(np.sin(np.deg2rad(E))))
    delta_E = delta_M/(1 - e1*(np.cos(np.deg2rad(E))))
    E = E + delta_E
    while np.abs(delta_E) > error_amount:
        delta_M = M1 - (E - e2*(np.sin(np.deg2rad(E))))
        delta_E = delta_M/(1 - e1*(np.cos(np.deg2rad(E))))
        E = E + delta_E
    x_prime = a1*(np.cos(np.deg2rad(E)) - e1)
    y_prime = a1*np.sqrt(1 - (np.square(e1)))*np.sin(np.deg2rad(E))
    z_prime = 0
    x_au = x_prime*(np.cos(np.deg2rad(peri))*np.cos(np.deg2rad(long_node1)) - np.sin(np.deg2rad(peri))*np.sin(np.deg2rad(long_node1))*np.cos(np.deg2rad(I1))) + y_prime*(-1*np.sin(np.deg2rad(peri))*np.cos(np.deg2rad(long_node1)) - np.cos(np.deg2rad(peri))*np.sin(np.deg2rad(long_node1))*np.cos(np.deg2rad(I1)))
    y_au = x_prime*(np.cos(np.deg2rad(peri))*np.sin(np.deg2rad(long_node1)) + np.sin(np.deg2rad(peri))*np.cos(np.deg2rad(long_node1))*np.cos(np.deg2rad(I1))) + y_prime*(-1*np.sin(np.deg2rad(peri))*np.sin(np.deg2rad(long_node1)) + np.cos(np.deg2rad(peri))*np.cos(np.deg2rad(long_node1))*np.cos(np.deg2rad(I1)))
    z_au = x_prime*(np.sin(np.deg2rad(peri))*np.sin(np.deg2rad(I1))) + y_prime*(np.cos(np.deg2rad(peri))*np.sin(np.deg2rad(I1)))
    x_km = x_au*149597870.7
    y_km = y_au*149597870.7
    z_km = z_au*149597870.7
    return x_au, y_au, z_au, x_km, y_km, z_km, error_amount

def julian_date(current_date=None):
    if current_date is None:
        current_date = datetime.datetime.now("%d-%m-%Y")
    year = current_date.year
    month = current_date.month
    day = current_date.day
    if month <= 2:
        year -= 1
        month += 12
    A = year // 100
    B = 2 - A + A // 4
    JD = int(365.25 * (year + 4716)) + int(30.6001 * (month + 1)) + day + B - 1524.5
    return JD

# x1, y1, z1, x2, y2, z2 = calculate_coordinates("Mercury", 2460589.735716431)

# print(x1, y1)