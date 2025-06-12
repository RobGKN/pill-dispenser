// No external library needed - using ESP32 built-in functionality
const int IN1 = 19;
const int IN2 = 18;
const int IN3 = 5;
const int IN4 = 17;

// Stepper sequence for half-stepping
const int numSteps = 8;
const int stepSequence[8][4] = {
    {1, 0, 0, 0},
    {1, 1, 0, 0},
    {0, 1, 0, 0},
    {0, 1, 1, 0},
    {0, 0, 1, 0},
    {0, 0, 1, 1},
    {0, 0, 0, 1},
    {1, 0, 0, 1}
};

void setup() {
    // Set pins as outputs
    pinMode(IN1, OUTPUT);
    pinMode(IN2, OUTPUT);
    pinMode(IN3, OUTPUT);
    pinMode(IN4, OUTPUT);
}

void loop() {
    // Rotate clockwise
    for(int step = 0; step < numSteps; step++) {
        digitalWrite(IN1, stepSequence[step][0]);
        digitalWrite(IN2, stepSequence[step][1]);
        digitalWrite(IN3, stepSequence[step][2]);
        digitalWrite(IN4, stepSequence[step][3]);
        delay(2); // Adjust this delay to control speed
    }
}
