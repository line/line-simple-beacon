from pybleno import *
import sys
from typing import List

ADTYPE_FLAGS = 0x01
ADTYPE_COMPLETE_16_BIT_SERVICE_UUID = 0x03
ADTYPE_SERVICE_DATA = 0x16
UUID16LE_FOR_LINECORP = bytearray([0x6f, 0xfe])

def adStructure(adType:int, adDataBuffer:bytearray) -> bytearray:
    header = [1 + len(adDataBuffer), adType]
    header += adDataBuffer
    return bytearray(header)

def createLineSimpleBeaconAdvertisingPDU(hwid:str, deviceMessage:str) -> bytearray:
    frameTypeData = bytearray([0x02])
    if len(hwid) != 10:
        raise Exception("Invalid hwid: ", hwid)
    if 1 > len(deviceMessage) > 13:
        raise Exception("Invalid message", deviceMessage)

    hwidData = bytearray.fromhex(hwid)
    measuredTxPowerData = bytearray([0x7F])
    deviceMessageData = bytearray.fromhex(deviceMessage)

    lineSimpleBeaconFrame = frameTypeData + hwidData + measuredTxPowerData + deviceMessageData
    return adStructure(ADTYPE_FLAGS, bytearray([0x06])) \
        + adStructure(ADTYPE_COMPLETE_16_BIT_SERVICE_UUID, UUID16LE_FOR_LINECORP) \
        + adStructure(ADTYPE_SERVICE_DATA, UUID16LE_FOR_LINECORP + lineSimpleBeaconFrame)





if __name__ == '__main__':
    hwid, message = (sys.argv[1], '00') if len(sys.argv) == 2 else (sys.argv[1], sys.argv[2])
    body = createLineSimpleBeaconAdvertisingPDU(hwid,message)

    bleno = Bleno()

    def onStateChange(state):
        print('on -> stateChange: ' + state)

        if (state == 'poweredOn'):
            bleno.startAdvertisingWithEIRData(body, None)
        else:
            bleno.stopAdvertising()

    bleno.on('stateChange', onStateChange)
    bleno.start()

print('Hit <ENTER> to disconnect')
input()

bleno.stopAdvertising()
bleno.disconnect()

print('terminated.')
sys.exit(1)
