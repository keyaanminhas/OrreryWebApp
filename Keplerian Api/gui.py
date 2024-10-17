import tkinter as tk
from tkinter import ttk, messagebox
import numpy as np
from datetime import datetime
from planets_data import *



def calculate(planet_name, jdate_input):
    if jdate_input.strip() == "":
        current_date = datetime.datetime.now()
    else:
        try:
            current_date = datetime.datetime.strptime(jdate_input, "%d-%m-%Y")
        except ValueError:
            messagebox.showerror("Invalid Date", "Please enter a valid date (DD-MM-YYYY).")
            return
    
    JDate = julian_date(current_date)

    # try:
    x_au, y_au, z_au, x_km, y_km, z_km, error = calculate_coordinates(planet_name, JDate)
    result_text.set(f"Coordinates (AU): ({x_au:.6f}, {y_au:.6f}, {z_au:.6f})\n"
                        f"Coordinates (KM): ({x_km:.2f}, {y_km:.2f}, {z_km:.2f})")
    # except:
    #     messagebox.showerror("Error", f"Could not calculate coordinates for {planet_name}.")

def on_calculate_button_click():
    planet_name = planet_name_var.get()
    jdate_input = jdate_entry.get()
    calculate(planet_name, jdate_input)

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

ttk.Label(frame, text="Enter Date (dd-mm-yyyy) or leave empty for current date:").grid(row=1, column=0, sticky=tk.W)
jdate_entry.grid(row=1, column=1, sticky=(tk.W, tk.E))

ttk.Button(frame, text="Calculate", command=on_calculate_button_click).grid(row=2, column=0, columnspan=2)

ttk.Label(frame, textvariable=result_text).grid(row=3, column=0, columnspan=2, sticky=(tk.W, tk.E))

root.mainloop()