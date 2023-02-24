---
title: ステータスLED
---

# ステータスLED

## はじめに

IoTconnector flexの現在の実行状況は、IoTconnector flexデバイスLEDの点灯状態で確認できます。

`IoTconnector flex`デバイスには、2つのLEDがあります:

- USER 1
- USER 2

![IoTconnector flexのLED](/img/IoT2050Leds.png)

各LEDの点灯色は3種類あります:

- 緑
- 赤
- オレンジ

### USER 1 LEDの状態

USER 1 の LED は、現在のコンフィギュレーション状態を表示します:

- オレンジの点滅 (設定されていない/利用規約に同意していない)
- オレンジ ([`設定済み`](LedStatusDisplay.md#what-does-configured-mean) だが、NCに接続されていない)
- 緑 ([`設定済み`](LedStatusDisplay.md#what-does-configured-mean) かつ、NCに正常に接続されている)

### USER 2 LEDの状態

USER 2 LEDは2つの状態しかありません:

- 消灯 (IoTconnector flexは動作していません)
- 緑 (IoTconnector flexは動作しています)
- 赤点滅 (ライセンスがありません)

### コンフィギュレーションとは何ですか？

ステータス `設定済み` は次のように定義されます:

- 有効なデータソースが1つある
- この有効なソースに対して最低1つの有効なデータポイント
- 最低1つのデータポイントを持つ1つの有効なアプリケーションインターフェイス
- 有効な接続データソースデータポイントと有効なアプリケーションインターフェイスデータポイントの間の1つの有効ななマッピング
