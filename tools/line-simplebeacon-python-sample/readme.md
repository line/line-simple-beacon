# LINE Simple Beacon Python
This is simple line beacon written in python due node version won't work on newer os

## Requirement
+ Python 3 (via `sudo apt-get install python3 python3-pip`)
+ pip3
+ pybleno (via `sudo pip3 install pybleno`)
+ bluetooth package (via `sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev`)

## Tested on
+ Raspberry pi 3B
    + Ubuntu 20.04.4 LTS (focal)
        + Run `hciconfig -a` to check if bluetooth is available, if empty follow below task
        + (if bluetooth not available) You may need `pi-bluetooth` package to use bluetooth [ref](https://askubuntu.com/questions/1246723/bluetooth-not-working-on-raspberry-pi-ubuntu-20-04)
+ python 3.8.10

## Usage
```sh
sudo python3 simplebeacon.py <HWID> [DeviceMessage]
```
+ issue hwid [here](https://manager.line.biz/beacon/register)
+ encode device message [here](https://codebeautify.org/string-hex-converter)
