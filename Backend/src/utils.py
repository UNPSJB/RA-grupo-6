from datetime import date

# Simulación de fecha para presentación: 
SIMULATED_DATE = date(2025, 11, 29)
USE_SIMULATION = True

def get_today():
    if USE_SIMULATION:
        return SIMULATED_DATE
    return date.today()
