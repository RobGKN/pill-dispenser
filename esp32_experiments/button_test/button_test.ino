// Simple button test program
const int BUTTON_PIN = 16;        // GPIO16 for button input
const int BUILTIN_LED = 2;        // Built-in LED on most ESP32 boards

void setup() {
    // Initialize serial communication
    Serial.begin(115200);
    delay(1000);  // Give serial time to initialize
    Serial.println("\n\nButton test starting...");
    
    // Set up pins
    pinMode(BUTTON_PIN, INPUT_PULLUP);  // Button pin as input with pullup
    pinMode(BUILTIN_LED, OUTPUT);       // LED pin as output
}

void loop() {
    // Read the button state
    int buttonState = digitalRead(BUTTON_PIN);
    
    // Button is pressed (remember, LOW means pressed with pullup resistor)
    if (buttonState == LOW) {
        digitalWrite(BUILTIN_LED, HIGH);  // Turn LED on
        Serial.println("Button pressed!");
    } else {
        digitalWrite(BUILTIN_LED, LOW);   // Turn LED off
    }
    
    // Small delay to prevent button bounce
    delay(50);
}
