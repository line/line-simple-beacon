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

'use strict';

const ADTYPE_FLAGS = 0x01;
const ADTYPE_COMPLETE_16_BIT_SERVICE_UUID = 0x03;
const ADTYPE_SERVICE_DATA = 0x16;
const UUID16LE_FOR_LINECORP = new Buffer('6ffe', 'hex'); // 'fe6f' in little endian

function adStructure(adType, adDataBuffer) {
  const header = new Buffer(2);
  header.writeUInt8(1 + adDataBuffer.length, 0);
  header.writeUInt8(adType, 1);
  return Buffer.concat([
    header,
    adDataBuffer
  ]);
}

function createLineSimpleBeaconAdvertisingPDU(hwid, deviceMessage) {
  if (!hwid.match(/^[0-9a-fA-F]{10}$/)) {
    throw new Error('Not 10 Digit Hex String: ' + hwid);
  }

  if (!deviceMessage.match(/^([0-9a-fA-F]{2}){1,13}$/)) {
    throw new Error('Bad Hex String: ' + deviceMessage);
  }

  const frameTypeData = new Buffer([0x02]);
  const hwidData = new Buffer(hwid, 'hex');
  const measuredTxPowerData = new Buffer([0x7F]);
  const deviceMessageData = new Buffer(deviceMessage, 'hex');

  const lineSimpleBeaconFrame = Buffer.concat([
    frameTypeData,
    hwidData,
    measuredTxPowerData,
    deviceMessageData
  ]);

  return Buffer.concat([
    adStructure(ADTYPE_FLAGS, new Buffer([0x06])),
    adStructure(ADTYPE_COMPLETE_16_BIT_SERVICE_UUID, UUID16LE_FOR_LINECORP),
    adStructure(ADTYPE_SERVICE_DATA, Buffer.concat([UUID16LE_FOR_LINECORP, lineSimpleBeaconFrame]))
  ]);
}

module.exports = {
  createLineSimpleBeaconAdvertisingPDU: createLineSimpleBeaconAdvertisingPDU
};
