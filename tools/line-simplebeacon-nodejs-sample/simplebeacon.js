#!/usr/bin/env node

/*
 The MIT License (MIT)

 Copyright (c) 2017 LINE corp.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

const simplebacon = require('./simplebeacon-lib');

const argv = require('argv');
const bleno = require('bleno');

const args = argv.option([{
  name: 'hwid',
  description: '[REQUIRED] 10 digits of hexadecimal number. ',
  type: 'string',
  example: "'--hwid=c0d10ad7f8'"
}, {
  name: 'device-message',
  description: '[OPTIONAL] 2 .. 26 digits of hexadecimal number.',
  type: 'string',
  example: "'--device-message=ff'"
}]).run();

const HWID = args.options['hwid'];
const DEVICE_MESSAGE = args.options['device-message'] || '00';

bleno.on('stateChange', function (state) {
  console.log('stateChange: ' + state);
  if (state === 'poweredOn') {
    const data = simplebacon.createLineSimpleBeaconAdvertisingPDU(HWID, DEVICE_MESSAGE);
    console.log(data);
    bleno.startAdvertisingWithEIRData(data);
  } else {
    bleno.stopAdvertising();
  }
});
