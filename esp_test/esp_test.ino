// ESP32 Blink Test

// Built-in LED pin - defined as constant for clarity
const int LED_PIN = 2;  

void setup() {
    Serial.begin(115200);
    pinMode(LED_PIN, OUTPUT);
    
    // Wait for serial to be ready
    delay(1000);
    Serial.println("\nESP32 Starting...");
    Serial.println("Basic LED Blink Test");
}

void loop() {
    digitalWrite(LED_PIN, HIGH);
    Serial.println("LED ON");
    delay(1000);
    
    digitalWrite(LED_PIN, LOW);
    Serial.println("LED OFF");
    delay(1000);
}
