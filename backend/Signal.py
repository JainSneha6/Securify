import serial
import time

# Establish serial connection (adjust 'COM3' to your Arduino port)
arduino = serial.Serial(port='COM5', baudrate=9600, timeout=.1)

def send_analog_input(value):
    arduino.write(bytes(value, 'utf-8'))
    time.sleep(0.05)  # Small delay to ensure data is sent

while True:
    # Send analog input '1' to the Arduino
    user_input = input("Enter 1 to turn on the LED or 0 to turn off: ")
    
    if user_input == '1':
        send_analog_input(user_input)
    else:
        send_analog_input('0')
