import tkinter as tk
from tkinter import ttk, messagebox
import numpy as np
from datetime import datetime
from planets_data import *


def julian_date(current_date):
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

def calculate():
    planet_name = planet_name_var.get()
    jdate_input = jdate_entry.get()

    if jdate_input.strip() == "":
        current_date = datetime.now()
    else:
        try:
            current_date = datetime.strptime(jdate_input, "%Y-%m-%d")
        except ValueError:
            messagebox.showerror("Invalid Date", "Please enter a valid date (YYYY-MM-DD).")
            return
    
    JDate = julian_date(current_date)

    try:
        x_au, y_au, z_au, x_km, y_km, z_km = calculate_coordinates(planet_name, JDate)
        result_text.set(f"Coordinates (AU): ({x_au:.4f}, {y_au:.4f}, {z_au:.4f})\n"
                         f"Coordinates (KM): ({x_km:.2f}, {y_km:.2f}, {z_km:.2f})")
    except:
        messagebox.showerror("Error", f"Could not calculate coordinates for {planet_name}.")

# GUI Setup
root = tk.Tk()
root.title("Planetary Coordinates Calculator")

frame = ttk.Frame(root, padding="10")
frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))

planet_name_var = tk.StringVar()
jdate_entry = tk.Entry(frame, width=20)
result_text = tk.StringVar()

ttk.Label(frame, text="Enter Planet Name:").grid(row=0, column=0, sticky=tk.W)
ttk.Entry(frame, textvariable=planet_name_var).grid(row=0, column=1, sticky=(tk.W, tk.E))

ttk.Label(frame, text="Enter Date (YYYY-MM-DD) or leave empty for current date:").grid(row=1, column=0, sticky=tk.W)
jdate_entry.grid(row=1, column=1, sticky=(tk.W, tk.E))

ttk.Button(frame, text="Calculate", command=calculate).grid(row=2, column=0, columnspan=2)

ttk.Label(frame, textvariable=result_text).grid(row=3, column=0, columnspan=2, sticky=(tk.W, tk.E))

root.mainloop()