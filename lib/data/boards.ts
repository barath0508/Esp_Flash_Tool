import { Board } from '../store/ide-store';

export const BOARD_CATEGORIES = [
  'All',
  'ESP32',
  'ESP8266', 
  'Arduino AVR',
  'Arduino SAMD',
  'RP2040',
  'STM32',
];

export const BOARDS: Board[] = [
  // ESP32 Family
  {
    id: 'esp32-dev',
    name: 'ESP32 Dev Module',
    fqbn: 'esp32:esp32:esp32',
    platform: 'ESP32',
  },
  {
    id: 'esp32-s2',
    name: 'ESP32-S2 Dev Module',
    fqbn: 'esp32:esp32:esp32s2',
    platform: 'ESP32',
  },
  {
    id: 'esp32-s3',
    name: 'ESP32-S3 Dev Module',
    fqbn: 'esp32:esp32:esp32s3',
    platform: 'ESP32',
  },
  {
    id: 'esp32-c3',
    name: 'ESP32-C3 Dev Module',
    fqbn: 'esp32:esp32:esp32c3',
    platform: 'ESP32',
  },
  {
    id: 'esp32-c6',
    name: 'ESP32-C6 Dev Module',
    fqbn: 'esp32:esp32:esp32c6',
    platform: 'ESP32',
  },
  {
    id: 'esp32-wrover',
    name: 'ESP32 Wrover Module',
    fqbn: 'esp32:esp32:esp32wrover',
    platform: 'ESP32',
  },
  {
    id: 'esp32-cam',
    name: 'ESP32-CAM',
    fqbn: 'esp32:esp32:esp32cam',
    platform: 'ESP32',
  },
  // ESP8266 Family
  {
    id: 'esp8266-nodemcu',
    name: 'NodeMCU 1.0 (ESP-12E)',
    fqbn: 'esp8266:esp8266:nodemcuv2',
    platform: 'ESP8266',
  },
  {
    id: 'esp8266-wemos-d1',
    name: 'Wemos D1 Mini',
    fqbn: 'esp8266:esp8266:d1_mini',
    platform: 'ESP8266',
  },
  {
    id: 'esp8266-generic',
    name: 'Generic ESP8266 Module',
    fqbn: 'esp8266:esp8266:generic',
    platform: 'ESP8266',
  },
  // Arduino AVR
  {
    id: 'arduino-uno',
    name: 'Arduino Uno',
    fqbn: 'arduino:avr:uno',
    platform: 'Arduino AVR',
  },
  {
    id: 'arduino-mega',
    name: 'Arduino Mega 2560',
    fqbn: 'arduino:avr:mega',
    platform: 'Arduino AVR',
  },
  {
    id: 'arduino-nano',
    name: 'Arduino Nano',
    fqbn: 'arduino:avr:nano',
    platform: 'Arduino AVR',
  },
  {
    id: 'arduino-leonardo',
    name: 'Arduino Leonardo',
    fqbn: 'arduino:avr:leonardo',
    platform: 'Arduino AVR',
  },
  {
    id: 'arduino-micro',
    name: 'Arduino Micro',
    fqbn: 'arduino:avr:micro',
    platform: 'Arduino AVR',
  },
  {
    id: 'arduino-pro-mini',
    name: 'Arduino Pro Mini',
    fqbn: 'arduino:avr:pro',
    platform: 'Arduino AVR',
  },
  // Arduino SAMD
  {
    id: 'arduino-mkr1000',
    name: 'Arduino MKR1000',
    fqbn: 'arduino:samd:mkr1000',
    platform: 'Arduino SAMD',
  },
  {
    id: 'arduino-mkrwifi1010',
    name: 'Arduino MKR WiFi 1010',
    fqbn: 'arduino:samd:mkrwifi1010',
    platform: 'Arduino SAMD',
  },
  {
    id: 'arduino-nano33iot',
    name: 'Arduino Nano 33 IoT',
    fqbn: 'arduino:samd:nano_33_iot',
    platform: 'Arduino SAMD',
  },
  // Raspberry Pi Pico
  {
    id: 'rpi-pico',
    name: 'Raspberry Pi Pico',
    fqbn: 'rp2040:rp2040:rpipico',
    platform: 'RP2040',
  },
  {
    id: 'rpi-pico-w',
    name: 'Raspberry Pi Pico W',
    fqbn: 'rp2040:rp2040:rpipicow',
    platform: 'RP2040',
  },
  // STM32
  {
    id: 'stm32-bluepill',
    name: 'STM32 Blue Pill',
    fqbn: 'STMicroelectronics:stm32:GenF1',
    platform: 'STM32',
  },
  {
    id: 'stm32-nucleo-f401re',
    name: 'STM32 Nucleo-64 F401RE',
    fqbn: 'STMicroelectronics:stm32:Nucleo_64',
    platform: 'STM32',
  },
];
