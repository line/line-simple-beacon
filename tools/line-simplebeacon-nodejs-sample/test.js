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

var assert = require("assert");

const simplebacon = require('./simplebeacon-lib');

describe("simplebacon", function () {
  it("createLineSimpleBeaconBuffer", function () {
    assert.deepEqual(
      new Buffer('02 01 06 03 03 6f fe 0b 16 6f fe 02 fd 5e a0 ad 1e 7f 00'.replace(/ /g, ''), 'hex'),
      simplebacon.createLineSimpleBeaconAdvertisingPDU('fd5ea0ad1e', '00'));
  });
});
