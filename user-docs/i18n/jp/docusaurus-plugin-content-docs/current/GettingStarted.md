---
title: はじめに
slug: /
---

## ログイン

初回ログインには初期パスワードとユーザー名を使用します。

初期ユーザー名は`User`です。
初期パスワードは、IoTconnector flexの右側（灰色のヒートシンク上）のラベルに記載されている MAC-Address です。

下の写真の例では、初期パスワードは `8CF31929BA4A` です。

![IoTconnector flex ラベル](/img/IoT2050Label.png)

初回ログイン時に初期パスワードを変更しなければなりません。初期パスワードを変更しないとデバイスは使用できません。

## 設定ウィザード

初期パスワードを変更すると、自動的に「設定ウィザード」が開始されます。
ここでは、言語を選択し、ユースケースに応じたテンプレートを選択し、必要であればチューニングをすることができます。

以下のテンプレートが用意されています。

- 入力ボード（デジタル入力 10 点または電流センサー＋デジタル入力 5 点）
- DMG MORI GM シリーズ（DMG MORI GM 16-6 または GM 20-6 機用）
- SIEMENS SINUMERIK 840D sl （SIEMENS SINUMERIK 840D sl 制御装置を DMG MORI Messenger、OPC UA または CELOS Xchange に接続する場合）
- SIEMENS SINUMERIK 840D sl と DMG MORI Messenger （SIEMENS SINUMERIK 840D sl 制御装置を DMG MORI Messenger に接続する場合）

必要であれば、`Continue without template`ボタンをクリックすることで、テンプレートを選択せずに続行することができます。

テンプレートを選択後、次のステップでデータソースとアプリケーションインターフェイスを調整します。
ウィザードが完了したら、クライアントアプリケーションとの接続を開始できます。
