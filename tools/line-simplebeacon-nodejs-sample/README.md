# LINE Simple Beacon Node.js Sample Application

Sample Bluetooth Host Application for LINE Simple Beacon written in Node.js.
Control local Bluetooth LE Controller to advertise LINE Simple Beacon's packet.

## SUPPORTED PLATFORM

* macOS Sierra on Apple's Computer with Bluetooth LE
* Raspbian Jessie on Raspberry PI 3

## PRE-REQUIRED

### macOS Sierra

* install [Xcode](https://itunes.apple.com/ca/app/xcode/id497799835?mt=12)
* install [Node.js v6.x.x](https://nodejs.org/ja/)

### Raspbian Jessie

    $ sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev
    $ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
    $ sudo apt-get install nodejs


## MAIN-SETUP

    $ cd line-simplebeacon-nodejs-sample
    $ npm install

## EXECUTE

    $ sudo ./simplebeacon.js --hwid=a1b2c3d4e5
    
    $ sudo ./simplebeacon.js -h # show usage

## LICENSE

MIT
