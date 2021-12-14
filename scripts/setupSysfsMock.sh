mkdir -p src/modules/Iot2050MraaDI10/sys/bus/iio/devices/iio:device0
echo 333 > src/modules/Iot2050MraaDI10/sys/bus/iio/devices/iio:device0/in_voltage0_raw
echo 555 > src/modules/Iot2050MraaDI10/sys/bus/iio/devices/iio:device0/in_voltage2_raw 
mkdir -p src/modules/IoT2050HardwareEvents/sys/class/gpio/gpio211 
echo 1 > src/modules/IoT2050HardwareEvents/sys/class/gpio/gpio211/value 
echo '' > src/modules/IoT2050HardwareEvents/sys/class/gpio/export 
mkdir -p src/modules/LedStatusService/sys/class/leds/user-led1-green 
echo '' > src/modules/LedStatusService/sys/class/leds/user-led1-green/brightness 
mkdir -p src/modules/LedStatusService/sys/class/leds/user-led2-green 
echo '' > src/modules/LedStatusService/sys/class/leds/user-led2-green/brightness
mkdir -p src/modules/LedStatusService/sys/class/leds/user-led1-red 
echo '' > src/modules/LedStatusService/sys/class/leds/user-led1-red/brightness 
mkdir -p src/modules/LedStatusService/sys/class/leds/user-led2-red 
echo '' > src/modules/LedStatusService/sys/class/leds/user-led2-red/brightness
mkdir -p src/modules/LedStatusService/sys/class/leds/user-led1-orange 
echo '' > src/modules/LedStatusService/sys/class/leds/user-led1-orange/brightness 
mkdir -p src/modules/LedStatusService/sys/class/leds/user-led2-orange 
echo '' > src/modules/LedStatusService/sys/class/leds/user-led2-orange/brightness