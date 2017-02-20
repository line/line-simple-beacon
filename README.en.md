# LINE Simple Beacon
LINE Simple Beacon is a specification for beacon hardware for LINE bot developers. LINE Simple Beacon is based on the Bluetooth Low Energy (BLE) specification and lets developers use the [LINE Beacon](https://devdocs.line.me/en/#line-beacon) service on regular devices.

## Security limitations
LINE Simple Beacon does not have a mechanism for preventing devices from being impersonated. Therefore, do not use bot services which automatically assumes that a beacon's ID is valid.

## Prerequisites
The following are required to use LINE Simple Beacon for developing a beacon that is integrated with a LINE bot.

* Have more than one bot account
* Have a device that can control a BLE controller

## Specification details
LINE Simple Beacon is made up of the following elements

* BLE Controller
* Bluetooth Host
* LINE Simple Beacon frame

The following are the specifications for each element.

### BLE Controller
The BLE Controller is a wireless device based on the BLE specification.

Beacons must have a module installed that conforms to the BLE Controller specifications as required by Bluetooth.
The recommended Bluetooth version is 4.0. Although a BLE controller which supports Bluetooth versions higher than 4.0 can be used, note that the LINE application may not detect the beacon if a feature not defined in Bluetooth 4.0 is configured with LINE Simple Beacon.

### Bluetooth Host
Bluetooth Host is a program that controls the BLE Controller based on Bluetooth protocols and profiles.

With LINE Simple Beacon, to ensure that the LINE app can quickly detect devices, control the BLE Controller according to the Broadcaster Role (BLUETOOTH SPECIFICATION Version 4.0 [Vol 3], Part C Section 2.2.2.1) as defined by Generic Access Profile.

#### Advertising data
Bluetooth Host consists of the following advertising data which must be passed to the BLE Controller.

* AD Type: Flags
  * Value: Cannot have a value of `0x00`. Set an appropriate value based on the characteristics of the device.
* AD Type: Service UUIDs
  * 16bit Service UUID: `0xFE6F`. UUID to provide the Bluetooth service through LINE.
* AD Type: Service Data
  * 16bit Service UUID: `0xFE6F`. Supports service UUIDs.
  * Service Data: LINE Simple Beacon Frame

#### Advertising data example
For devices with the characteristics shown below, advertising data is displayed when the following parameters are used.

* Characteristics
  * Packets are transmitted regularly
  * Only supports BLE（does not support BR/EDR）
* Parameter example 1
  * HWID: `32AF519E88`
  * Device Message: `0032006900FAFFFF000199FF88`
* Parameter example 2
  * HWID: `8ADFAF4326`
  * Device Message: `20170228`

The following table shows the advertising data using parameter example 1 and example 2. Set the value as `0x00` for byte offsets greater than 22 for parameter example 2 as values greater than 22 becomes the non-significant part (BLUETOOTH SPECIFICATION Version 4.0 [Vol 3], Part C Section 11).

Byte<br/> Offset | Example 1<br/> Value |Example 2<br/> Value | Description 
--:|:------:|:------:|------------|
 0 | `0x02` | `0x02` |  Data length
 1 | `0x01` | `0x01` |  AD type for flags<br/>(BLUETOOTH SPECIFICATION Version 4.0 [Vol 3], Part C Section 18.1)
 2 | `0x06` | `0x06` |  LE General Discoverable Mode (2)<br/>BR/EDR Not Supported (4)
 3 | `0x03` | `0x03` |  Data length
 4 | `0x03` | `0x03` |  AD type for the complete list of 16-bit UUIDs available<br/>(BLUETOOTH SPECIFICATION Version 4.0 [Vol 3], Part C Section 18.2)
 5 | `0x6F` | `0x6F` |  16-bit UUID for LINE corp
 6 | `0xFE` | `0xFE` |  (Same as above)
 7 | `0x17` | `0x0E` |  Data length
 8 | `0x16` | `0x16` |  AD type for Service Data<br/>(BLUETOOTH SPECIFICATION Version 4.0 [Vol 3], Part C Section 18.10)
 9 | `0x6F` | `0x6F` |  16-bit UUID for LINE corp
10 | `0xFE` | `0xFE` |  (Same as above)
11 | `0x02` | `0x02` |  Frame Type of the LINE Simple Beacon Frame
12 | `0x32` | `0x8A` |  HWID of LINE Simple Beacon
13 | `0xAF` | `0xDF` |  (Same as above)
14 | `0x51` | `0xAF` |  (Same as above)
15 | `0x9E` | `0x43` |  (Same as above)
16 | `0x88` | `0x26` |  (Same as above)
17 | `0x7F` | `0x7F` |  Measured TxPower of the LINE Simple Beacon Frame
18 | `0x00` | `0x20` |  Device message of LINE Simple Beacon Frame
19 | `0x32` | `0x17` |  (Same as above)
20 | `0x00` | `0x02` |  (Same as above)
21 | `0x69` | `0x28` |  (Same as above)
22 | `0x00` | `0x00` |  (Same as above)
23 | `0xFA` | `0x00` |  (Same as above)
24 | `0xFF` | `0x00` |  (Same as above)
25 | `0xFF` | `0x00` |  (Same as above)
26 | `0x00` | `0x00` |  (Same as above)
27 | `0x01` | `0x00` |  (Same as above)
28 | `0x99` | `0x00` |  (Same as above)
29 | `0xFF` | `0x00` |  (Same as above)
30 | `0x88` | `0x00` |  (Same as above)

### LINE Simple Beacon Frame

LINE Simple Beacon Frame is the variable-length data which contains the information to identify devices. The binary length is 8–20 bytes. Big-endian is the byte order used for multi-byte data. The following information is stored in order. These are all the required items.

| Property         | Data type    | Size     | Description                              |
| ---------------- | ------------ | -------- | ---------------------------------------- |
| Frame Type       | Fixed Length | 1 byte    | Only ``0x02`` can be used                |
| HWID             | Fixed Length | 5 bytes   | ID of beacon device<br>Set an HWID for each device. Do not use HWIDs other than the HWIDs issued for your own bot account.<br>HWIDs are issued through the [LINE Official Account Manager](https://admin-official.line.me/beacon/register). |
| Measured TxPower | Fixed Length | 1 byte    | Only ``0x7F`` can be used                           |
| Device Message   | Variable Length | 1–13 bytes | Can be used freely by developers. When the LINE application detects a beacon, the HWID and other properties are passed to the LINE server.<br>Set value as `0x00` if the "Device Message" property is not used. No event will be sent if no value is set. |

We plan to make it possible for bot accounts to receive "Device Message" via webhooks at a later date. Use this to receive information from the beacon such as temperature, air pressure, and battery remaining. (Webhooks currently can't be used to receive information.)

## Disclaimer and copyright notice
- The user agrees to the following conditions upon use of the LINE Simple Beacon specification ("the Specification").
- As all or part of the LINE Beacon service (including all items related to LINE Simple Beacon) may change or be dicsontinued at any time without prior notice, it is possible that the Specification may not be compatible with the LINE Beacon service. Also, LINE Corporation ("the Company") is not obligated to keep the Specification updated.
- The Company may, at its discretion, change or remove the contents of the Specification at any time without prior notice.
- The Specification may not be redistributed or modified.
- The Specification shall not be used for any other purpose other than those stated in LINE Simple Beacon.
- The Company does not explicitly or implicitly guarantee that the Specification does not contain any factual or legal errors (including compatibility issues regarding security, reliability, completeness, and effectiveness; security-related defects; errors and bugs; and any rights infringements). The Company is not obligated to remove any such errors in the Specification.
- The Company is not responsible for any damages to the user or a third party that arise from the specification.
- `0xFE6F` is a UUID used for the Bluetooth service provided by LINE and may not be used for any other purpose.
- Bluetooth is a trademark or a registered trademark of Bluetooth SIG, Inc.
- LINE Beacon and LINE Simple Beacon are trademarks or registered trademarks of the Company.