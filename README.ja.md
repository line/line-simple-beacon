# LINE Simple Beacon
LINE Simple Beaconとは、LINE Bot開発者向けのビーコンデバイス仕様です。
LINE Simple BeaconはBluetooth Low Energy (以下、「BLE」という)の仕様にもとづいており、
汎用のデバイスで[LINE Beacon](https://devdocs.line.me/ja/#line-beacon)のサービスを利用することを可能とします。

## Security limitation
LINE Simple Beaconは、デバイスのなりすましを抑制するメカニズムが存在していません。
そのため、ビーコンデバイス識別IDでの正真性を前提としたBotサービスには利用しないでください。

## Prerequisite
LINE Simple Beaconを利用してLINE Botと連携したビーコンデバイスを開発するには、以下の条件を満たす必要があります。

* ひとつ以上のBotアカウントを保有していること
* BLE Controllerの制御が可能なデバイスを保有していること

## Specification details
LINE Simple Beaconは、以下の要素から構成されています。

* BLE Controller
* Bluetooth Host
* LINE Simple Beacon Frame

ここではそれぞれの仕様について述べます。

###  BLE Controller
BLE Controllerは、BLEの仕様に準拠したワイヤレスデバイスです。

ビーコンデバイスはBluetoothで規定されるBLE Controllerの仕様に準拠したモジュールを必ず搭載する必要があります。
推奨するBluetoothバージョンは4.0です。Bluetooth 4.0以降の新しい仕様をサポートしたBLE Controllerを使うことも可能でが、Bluetooth 4.0で定義されていない機能を使ってLINE Simple Beaconを構成した場合、LINEアプリケーションがビーコンデバイスを発見できない可能性があるためご注意ください。

### Bluetooth Host
Bluetooth Hostは、BluetoothのProtocolやProfileにもとづいてBLE Controllerを操作するプログラムです。

LINE Simple Beaconでは、LINEアプリがデバイスを迅速に発見できるよう、Generic Access Profileで規定されるBroadcaster Role (BLUETOOTH SPECIFICATION Version 4.0 [Vol 3], Part C Section 2.2.2.1)に従ってBLE Controllerを制御してください。


#### Advertising data
Bluetooth Hostは、次に示すようなAdvertising dataを構築し、BLE Controllerに渡さなければなりません。

* AD Type: Flags
  * Value: `0x00`ではない値。デバイスの特性に応じて適切な値を設定してください
* AD Type: Service UUIDs
  * 16bit Service UUID: `0xFE6F`。LINEによって提供されるBluetoothサービスのための UUIDです。
* AD Type: Service Data
  * 16bit Service UUID: `0xFE6F`。SERVICE UUIDsと対応します。
  * Service Data: LINE Simple Beacon Frame

#### Advertising data example

以下のような特性のデバイスで、次のパラメータを利用した際のAdvertising dataを示します

* 特性
  * パケットの出力を常時行う
  * BLEのみをサポートしている（BR/EDRはサポートしない）
* Parameter Example 1
  * HWID: `32AF519E88`
  * Device Message: `0032006900FAFFFF000199FF88`
* Parameter Example 2
  * HWID: `8ADFAF4326`
  * Device Message: `20170228`

Parameter Example 1とParameter Example 2のパラメータを使ったAdvertising dataの構造は、以下のようになります。
Parameter Example 2の22byte以降はNon-significant part（BLUETOOTH SPECIFICATION Version 4.0 [Vol 3], Part C Section 11）となるため`0x00`を指定してください。

Byte<br/> Offset | Example 1<br/> Value |Example 2<br/> Value | Description 
--:|:------:|:------:|------------|
 0 | `0x02` | `0x02` |  データ長 
 1 | `0x01` | `0x01` |  Flagsを意味するAD type<br/>(BLUETOOTH SPECIFICATION Version 4.0 [Vol 3], Part C Section 18.1)
 2 | `0x06` | `0x06` |  LE General Discoverable Mode(2)<br/>とBR/EDR Not Supported(4)
 3 | `0x03` | `0x03` |  データ長
 4 | `0x03` | `0x03` |  Complete list of 16-bit UUIDs availableを意味するAD type<br/>(BLUETOOTH SPECIFICATION Version 4.0 [Vol 3], Part C Section 18.2)
 5 | `0x6F` | `0x6F` |  16-bit UUID for LINE corp
 6 | `0xFE` | `0xFE` |  (同上)
 7 | `0x17` | `0x0E` |  データ長
 8 | `0x16` | `0x16` |  Service Dataを意味するAD type<br/>(BLUETOOTH SPECIFICATION Version 4.0 [Vol 3], Part C Section 18.10)
 9 | `0x6F` | `0x6F` |  16-bit UUID for LINE corp
10 | `0xFE` | `0xFE` |  (同上)
11 | `0x02` | `0x02` |  LINE Simple Beacon FrameのFrame Type
12 | `0x32` | `0x8A` |  LINE Simple Beacon FrameのHWID
13 | `0xAF` | `0xDF` |  (同上)
14 | `0x51` | `0xAF` |  (同上)
15 | `0x9E` | `0x43` |  (同上)
16 | `0x88` | `0x26` |  (同上)
17 | `0x7F` | `0x7F` |  LINE Simple Beacon FrameのMeasured TxPower
18 | `0x00` | `0x20` |  LINE Simple Beacon FrameのDevice Message
19 | `0x32` | `0x17` |  (同上)
20 | `0x00` | `0x02` |  (同上)
21 | `0x69` | `0x28` |  (同上)
22 | `0x00` | `0x00` |  (同上)
23 | `0xFA` | `0x00` |  (同上)
24 | `0xFF` | `0x00` |  (同上)
25 | `0xFF` | `0x00` |  (同上)
26 | `0x00` | `0x00` |  (同上)
27 | `0x01` | `0x00` |  (同上)
28 | `0x99` | `0x00` |  (同上)
29 | `0xFF` | `0x00` |  (同上)
30 | `0x88` | `0x00` |  (同上)

### LINE Simple Beacon Frame

LINE Simple Beacon Frameは、デバイスを識別するための情報を含む可変長のデータです。
バイナリ長は8～20byteです。マルチバイトデータのバイトオーダーはBig-endianです。
次に示す情報が順番に格納されます。これらは全て必須項目です。

| Property         | Data type    | Size     | Description                              |
| ---------------- | ------------ | -------- | ---------------------------------------- |
| Frame Type       | Fixed Length | 1byte    | ``0x02``のみ使用可                            |
| HWID             | Fixed Length | 5byte    | ビーコンデバイスの識別ID。<br>HWIDはデバイスごとに指定してください。自身のBotアカウントに対して発行されたHWID以外は使わないでください。<br>HWIDは、[LINE OFFICIAL ACCOUNT MANAGERページ](https://admin-official.line.me/beacon/register)から発行できます。 |
| Measured TxPower | Fixed Length | 1byte    | ``0x7F``のみ使用可                            |
| Device Message   | Variable Length | 1~13byte | 開発者が自由に使うことができます。LINEアプリがビーコンデバイスを発見した際に、HWIDなどとともにLINEサーバに通知されます。<br>Device Messageを使用しない場合は`0x00`を指定してください。何も指定がない場合はイベントが通知されません。 |

Device Messageは、Messaging APIによりLINEサーバを通じてBotに通知されます。
温度や気圧、電池の残量といった、ビーコンデバイスの状態を受け取りたいときにご活用ください。

## Disclaimer and copyright notice
- 利用者は、本注意事項に同意することを条件として、本仕様を利用することができます。
- LINE Beaconサービス（LINE Simple Beaconに関するものを含む）は、事前の通知なく、内容の全部又は一部を変更・停止・終了させる場合があり、それに伴い、本仕様がLINE Beaconサービスに準拠しなくなる可能性がございます。なお、LINE株式会社（以下「当社」）は本仕様をアップデートする義務を負いません。
- 当社は、当社が必要と判断する場合、あらかじめ通知することなく、いつでも本仕様の内容を変更し又は本仕様を非公開にすることができます。
- 本仕様の再配布・改変しての配布等を無断で行うことは禁止します。
- 本仕様を、LINE Simple Beaconの用途以外には利用しないでください。
- 当社は、本仕様に事実上又は法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます）がないことを明示的にも黙示的にも保証しておりません。当社は、かかる瑕疵を除去して本仕様を公開する義務を負いません。
- 当社は、本仕様に起因して利用者又は第三者に生じたあらゆる損害について一切の責任を負いません。
- `0xFE6F` は、LINEによって提供されるBluetoothサービスのための UUIDです。他の用途で利用しないでください。
- Bluetoothは、Bluetooth SIG,Inc.の商標または登録商標です。
- LINE BeaconおよびLINE Simple Beaconは、当社の商標または登録商標です。
