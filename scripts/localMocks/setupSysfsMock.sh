#!/bin/bash
# Description: Create mock files for iot2050 LEDs and GPIO ports

mkdir -p mdclight/sys/bus/iio/devices/iio:device0
echo 333 > mdclight/sys/bus/iio/devices/iio:device0/in_voltage0_raw
echo 555 > mdclight/sys/bus/iio/devices/iio:device0/in_voltage2_raw 
mkdir -p mdclight/sys/class/gpio/gpio211 
echo 1 > mdclight/sys/class/gpio/gpio211/value 
echo '' > mdclight/sys/class/gpio/export 
mkdir -p mdclight/sys/class/leds/user-led1-green 
echo '' > mdclight/sys/class/leds/user-led1-green/brightness 
mkdir -p mdclight/sys/class/leds/user-led2-green 
echo '' > mdclight/sys/class/leds/user-led2-green/brightness
mkdir -p mdclight/sys/class/leds/user-led1-red 
echo '' > mdclight/sys/class/leds/user-led1-red/brightness 
mkdir -p mdclight/sys/class/leds/user-led2-red 
echo '' > mdclight/sys/class/leds/user-led2-red/brightness
mkdir -p mdclight/sys/class/leds/user-led1-orange 
echo '' > mdclight/sys/class/leds/user-led1-orange/brightness 
mkdir -p mdclight/sys/class/leds/user-led2-orange 
echo '' > mdclight/sys/class/leds/user-led2-orange/brightness