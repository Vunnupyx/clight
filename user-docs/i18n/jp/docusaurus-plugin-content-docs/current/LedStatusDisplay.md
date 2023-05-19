---
title: ステータスLED
---

# ステータス LED

## はじめに

There are 4 different LEDs on the `SIEMENS SIMATIC IOT2050` device:
![IoTconnector flexのLED](/img/IoT2050Leds.png)

- PWR: Displays the power status of the machine.
- STAT: Displays the status of the Operating System (CELOS X)
- USER 1 and USER 2: Controlled by the IoTconnector flex to display various purposes and explained below.

### States of STAT LED

The current status of the CELOS X Operating System is visualized by using the STATS LED of the device.

| Status                                                                                                                                   | STATS LED             |
| ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| U-Boot running (LED remains red if there is an error within U-Boot)                                                                      | RED                   |
| GRUB running                                                                                                                             | ORANGE                |
| GRUB fails to boot                                                                                                                       | RED BLINKING (1 Hz)   |
| CELOS OS running with online connection                                                                                                  | GREEN                 |
| CELOS OS running without online connection (at least one of the components cumulocity-agent, Netservice, CELOS Xchange is not connected) | GREEN BLINKING (1 Hz) |
| CELOS OS emergency mode (i.e. unlock-data failed)                                                                                        | RED BLINKING (2 Hz)   |

### USER 1 and USER 2 LEDs

IoTconnector flex の現在の実行状況は、IoTconnector flex デバイス LED の点灯状態で確認できます。

There are two different LEDs on the `SIEMENS SIMATIC IOT2050` device that are reflecting status of IoTconnector flex:

- USER 1
- USER 2

各 LED の点灯色は 3 種類あります:

- 緑
- 赤
- オレンジ

#### USER 1 LED の状態

USER 1 の LED は、現在のコンフィギュレーション状態を表示します:

- オレンジの点滅 (設定されていない/利用規約に同意していない)
- オレンジ ([`設定済み`](LedStatusDisplay.md#what-does-configured-mean) だが、NC に接続されていない)
- 緑 ([`設定済み`](LedStatusDisplay.md#what-does-configured-mean) かつ、NC に正常に接続されている)

#### USER 2 LED の状態

USER 2 LED は 2 つの状態しかありません:

- 消灯 (IoTconnector flex は動作していません)
- 緑 (IoTconnector flex は動作しています)
- 赤点滅 (ライセンスがありません)

#### コンフィギュレーションとは何ですか？

ステータス `設定済み` は次のように定義されます:

- 有効なデータソースが 1 つある
- この有効なソースに対して最低 1 つの有効なデータポイント
- 最低 1 つのデータポイントを持つ 1 つの有効なアプリケーションインターフェイス
- 有効な接続データソースデータポイントと有効なアプリケーションインターフェイスデータポイントの間の 1 つの有効ななマッピング
