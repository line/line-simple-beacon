# LINE Simple Beacon Node.js Sample Application

Sample Bluetooth Host Application for LINE Simple Beacon written in Node.js.
Control local Bluetooth LE Controller to advertise LINE Simple Beacon's packet.

## SUPPORTED PLATFORM

* macOS 10.12 - 10.13 on Apple's Computer with Bluetooth LE
  * ⚠️ Currently, not work on 10.14 (Mojave) or later. See this [issue](https://github.com/line/line-simple-beacon/issues/9)
* Raspbian Jessie on Raspberry PI 3

## PRE-REQUIRED

### macOS

* install [Xcode](https://itunes.apple.com/ca/app/xcode/id497799835?mt=12)
* install [Node.js v6.x.x+](https://nodejs.org/)
  * ⚠️ Currently, not work on v10.x.x. See this [issue abount xpc-connection](https://github.com/sandeepmistry/node-xpc-connection/issues/24)

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
