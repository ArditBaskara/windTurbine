#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Wire.h>
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 32
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
#define VOLTAGE_SENSOR_PIN_1 34  
#define VOLTAGE_SENSOR_PIN_2 35  
#define CURRENT_SENSOR_PIN 32  
float voltage = 0;
float current = 0;
float offset = 4.9; 
#define WIFI_SSID "FELIX.co"
#define WIFI_PASSWORD "felix0000"
// Anemometer Parameters
volatile byte rpmcount = 0;
volatile unsigned long last_micros = 0;
unsigned long timeold = 0;
const unsigned long timemeasure = 10; 
int countThing = 0;
const int GPIO_pulse = 14;
float rpm = 0.0, rotasi_per_detik = 0.0;   
float kecepatan_kilometer_per_jam = 0.0; 
float kecepatan_meter_per_detik = 0.0;   
volatile boolean flag = false;

// Firebase
#define API_KEY "AIzaSyBhfIPnCc5rYYVRA597ua0sa-YgEzNGCXo"
#define DATABASE_URL "https://turbine-8daf7-default-rtdb.asia-southeast1.firebasedatabase.app/"

void IRAM_ATTR rpm_anemometer() {
  flag = true;
}

void setup() {
  pinMode(GPIO_pulse, INPUT_PULLUP);
  Serial.begin(115200);
  int calibrationValue = analogRead(CURRENT_SENSOR_PIN);
  // Initialize OLED for 128x32 display
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }
  display.display();
  delay(2000); 
  display.clearDisplay();

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.println("Connected to Wi-Fi");

  // Start anemometer interrupt
  attachInterrupt(digitalPinToInterrupt(GPIO_pulse), rpm_anemometer, RISING);
}

void loop() {
  if (flag == true) {
    if (long(micros() - last_micros) >= 5000) {
      rpmcount++;
      last_micros = micros();
    }
    flag = false;
  }

  if ((millis() - timeold) >= timemeasure * 1000) {
    countThing++;
    detachInterrupt(digitalPinToInterrupt(GPIO_pulse));
    rotasi_per_detik = float(rpmcount) / float(timemeasure);
    kecepatan_meter_per_detik = ((-0.0181 * (rotasi_per_detik * rotasi_per_detik)) + (1.3859 * rotasi_per_detik) + 1.4055);
    if (kecepatan_meter_per_detik <= 1.5) {
      kecepatan_meter_per_detik = 0.0;
    }
    kecepatan_kilometer_per_jam = kecepatan_meter_per_detik * 3.6;

    int sensorValue1 = analogRead(VOLTAGE_SENSOR_PIN_1);
    float tegangan_baterai_1 = sensorValue1 * (5.0 / 1023.0);  

    int sensorValue2 = analogRead(VOLTAGE_SENSOR_PIN_2);
    float tegangan_baterai_2 = sensorValue2 * (5.0 / 1023.0);  
    int sensorValue = analogRead(CURRENT_SENSOR_PIN);
    voltage = sensorValue * (3.3 / 4095.0); 
    current = (voltage - 1.65) / 0.032; 
    current -= offset; 

  //float arus_sensor = (currentSensorValue * (5.0 / 1023.0))-offset;  // Mengurangi offset dari hasil pembacaan
  //float arus_sensor = (currentSensorValue * (5.0 / 4095.0))-offset;  // Mengurangi offset dari hasil pembacaan
  //float arus_sensor = ((currentSensorValue -2500.0)/40.0)-offset;  // Mengurangi offset dari hasil pembacaan
  //float arus_baterai = arus_sensor;  // Nilai arus dalam Ampere
  //Serial.print("TEssssssssssssss  ");
  //Serial.print(arus_baterai);

  // Jika arus negatif atau terlalu kecil, set ke 0
  if(current > 6){
    current = 0;
  }
  
  Serial.print("Current: ");
  Serial.print(current);
  Serial.println(" A");
  delay(1000);
    // Display data on OLED 128x32
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);

    display.print("Speed (m/s): ");
    display.println(kecepatan_meter_per_detik);

    display.print("Tegangan 1: ");
    display.println(tegangan_baterai_1);

    display.print("Tegangan 2: ");
    display.println(tegangan_baterai_2);

    display.print("Arus (A): ");
    display.println(current);

    display.display();

    Serial.println();
    Serial.print("rotasi_per_detik=");
    Serial.print(rotasi_per_detik);
    Serial.print("   kecepatan_meter_per_detik=");
    Serial.print(kecepatan_meter_per_detik);
    Serial.print("   kecepatan_kilometer_per_jam=");
    Serial.print(kecepatan_kilometer_per_jam);
    Serial.print("   tegangan_baterai_1=");
    Serial.print(tegangan_baterai_1);
    Serial.print("   tegangan_baterai_2=");
    Serial.print(tegangan_baterai_2);
    /*Serial.print("   arus_baterai (A)=");
    Serial.println(arus_baterai);
    Serial.print("   crrent");
    Serial.println(currentSensorValue);
    */

    if (countThing == 1) { 
      Serial.println("Sending data to server");
      sendDataToFirebase(rotasi_per_detik, kecepatan_meter_per_detik, kecepatan_kilometer_per_jam, tegangan_baterai_1, tegangan_baterai_2, current); 
      countThing = 0;
    }
    timeold = millis();
    rpmcount = 0;
    attachInterrupt(digitalPinToInterrupt(GPIO_pulse), rpm_anemometer, RISING);
  }
}

void sendDataToFirebase(float rotasi_per_detik, float kecepatan_meter_per_detik, float kecepatan_kilometer_per_jam, float tegangan_baterai_1, float tegangan_baterai_2, float current) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // URL Firebase dengan kunci API
    String url_baterai = String(DATABASE_URL) + "/data_baterai.json?auth=" + API_KEY;
    
    // Debugging: cetak URL untuk memastikan benar
    Serial.println("Sending data to: " + url_baterai);

    http.begin(url_baterai);
    http.addHeader("Content-Type", "application/json");
    
    // JSON
    String jsonPayloadBaterai = "{\"rotasi_per_detik\":" + String(rotasi_per_detik) + ",\"kecepatan_meter_per_detik\":" + String(kecepatan_meter_per_detik) + ",\"kecepatan_kilometer_per_jam\":" + String(kecepatan_kilometer_per_jam) + ",\"tegangan_baterai_1\":" + String(tegangan_baterai_1) + ",\"tegangan_baterai_2\":" + String(tegangan_baterai_2) + ",\"current\":" + String(current) + "}";
    Serial.println("JSON Payload: " + jsonPayloadBaterai);

    int httpResponseCodeBaterai = http.POST(jsonPayloadBaterai);

    // Debugging: cetak response code untuk memastikan apa yang terjadi
    Serial.print("HTTP Response Code: ");
    Serial.println(httpResponseCodeBaterai);
    
    if (httpResponseCodeBaterai > 0) {
      String responseBaterai = http.getString();
      Serial.println("Data berhasil dikirim ke Firebase");
      Serial.println("Response: " + responseBaterai);
    } else {
      Serial.println("Gagal mengirim data ke Firebase");
      Serial.println("Error code: " + String(httpResponseCodeBaterai));
    }
    
    http.end(); 
  } else {
    Serial.println("Koneksi WiFi terputus, tidak dapat mengirim data ke Firebase.");
  }
}

