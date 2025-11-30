export interface Example {
  id: string;
  name: string;
  category: string;
  description: string;
  code: string;
}

export const EXAMPLES: Example[] = [
  {
    id: 'blink',
    name: 'Blink',
    category: 'Basics',
    description: 'Turn an LED on and off repeatedly',
    code: `void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}`,
  },
  {
    id: 'serial-hello',
    name: 'Serial Hello World',
    category: 'Basics',
    description: 'Print messages to serial monitor',
    code: `void setup() {
  Serial.begin(115200);
  Serial.println("Hello, World!");
}

void loop() {
  Serial.print("Uptime: ");
  Serial.print(millis() / 1000);
  Serial.println(" seconds");
  delay(1000);
}`,
  },
  {
    id: 'button',
    name: 'Button',
    category: 'Basics',
    description: 'Read a pushbutton state',
    code: `const int buttonPin = 2;
const int ledPin = LED_BUILTIN;

int buttonState = 0;

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT);
}

void loop() {
  buttonState = digitalRead(buttonPin);

  if (buttonState == HIGH) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
}`,
  },
  {
    id: 'fade',
    name: 'Fade',
    category: 'Basics',
    description: 'Fade an LED using PWM',
    code: `int brightness = 0;
int fadeAmount = 5;

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  analogWrite(LED_BUILTIN, brightness);

  brightness = brightness + fadeAmount;

  if (brightness <= 0 || brightness >= 255) {
    fadeAmount = -fadeAmount;
  }

  delay(30);
}`,
  },
  {
    id: 'wifi-scan',
    name: 'WiFi Scan',
    category: 'WiFi',
    description: 'Scan for available WiFi networks',
    code: `#include <WiFi.h>

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  Serial.println("WiFi Scan Starting...");
}

void loop() {
  Serial.println("Scanning...");
  int n = WiFi.scanNetworks();

  if (n == 0) {
    Serial.println("No networks found");
  } else {
    Serial.print(n);
    Serial.println(" networks found:");

    for (int i = 0; i < n; ++i) {
      Serial.print(i + 1);
      Serial.print(": ");
      Serial.print(WiFi.SSID(i));
      Serial.print(" (");
      Serial.print(WiFi.RSSI(i));
      Serial.println(" dBm)");
    }
  }

  delay(5000);
}`,
  },
  {
    id: 'wifi-connect',
    name: 'WiFi Connect',
    category: 'WiFi',
    description: 'Connect to a WiFi network',
    code: `#include <WiFi.h>

const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

void setup() {
  Serial.begin(115200);
  delay(10);

  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  delay(1000);
}`,
  },
  {
    id: 'webserver',
    name: 'Simple Web Server',
    category: 'WiFi',
    description: 'Create a basic web server',
    code: `#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

WebServer server(80);

void handleRoot() {
  server.send(200, "text/html", "<h1>Hello from ESP32!</h1>");
}

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected! IP: ");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
}`,
  },
  {
    id: 'ble-beacon',
    name: 'BLE Beacon',
    category: 'Bluetooth',
    description: 'Create a Bluetooth Low Energy beacon',
    code: `#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

void setup() {
  Serial.begin(115200);
  Serial.println("Starting BLE!");

  BLEDevice::init("ESP32");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);

  BLECharacteristic *pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE
  );

  pCharacteristic->setValue("Hello BLE");
  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->start();

  Serial.println("BLE advertising started");
}

void loop() {
  delay(2000);
}`,
  },
  {
    id: 'dht-sensor',
    name: 'DHT Temperature Sensor',
    category: 'Sensors',
    description: 'Read temperature and humidity from DHT sensor',
    code: `#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  Serial.println("DHT22 sensor test");
  dht.begin();
}

void loop() {
  delay(2000);

  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.print("%  Temperature: ");
  Serial.print(temperature);
  Serial.println("°C");
}`,
  },
  {
    id: 'neopixel',
    name: 'NeoPixel Rainbow',
    category: 'Display',
    description: 'Create rainbow effect on WS2812 LEDs',
    code: `#include <Adafruit_NeoPixel.h>

#define PIN 5
#define NUMPIXELS 16

Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  pixels.begin();
}

void loop() {
  for(int i=0; i<256; i++) {
    for(int j=0; j<NUMPIXELS; j++) {
      pixels.setPixelColor(j, Wheel((i + j * 256 / NUMPIXELS) & 255));
    }
    pixels.show();
    delay(20);
  }
}

uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if(WheelPos < 85) {
    return pixels.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  }
  if(WheelPos < 170) {
    WheelPos -= 85;
    return pixels.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
  WheelPos -= 170;
  return pixels.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
}`,
  },
];

export const EXAMPLE_CATEGORIES = [
  'All',
  'Basics',
  'WiFi',
  'Bluetooth',
  'Sensors',
  'Display',
];
