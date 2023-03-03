---
title: DMG MORIメッセンジャーを接続する
---

DMG MORI Messengerに機械を登録するには、AutomaticまたはManualのいずれかの方法を使用します。

注：いずれの場合も対象の機械ごとにDMG MORI Messengerのライセンスが必要です。

## 自動登録

自動登録のための前提条件:

- IoTconnector flexの`一般`ページの`デバイス情報`に機械のシリアル番号が記入されている必要があります。
- DMG MORI Messengerに組織情報と機械モデルが設定されていること。

**ステップ1:** `Connect Messenger`ボタンをクリックすると、自動登録のためのダイアログが表示されます。
![DMG MORI Messengerボタン](/img/applicationinterface/messenger_button.png)

**ステップ2:** 開いたダイアログで、DMG MORI Messengerサーバーのホスト名(またはIPアドレス)、ユーザー名、パスワードの情報を入力します。そして、`サーバー設定を保存する`ボタンをクリックします。DMG MORI Messengerが接続され、`サーバ状態`に`サーバ有効`と表示されるはずです。下の写真を参照してください。

![DMG MORI Messengerサーバ設定](/img/applicationinterface/messenger_server_configuration.png)

**ステップ3:** サーバが利用可能になったら、`登録`ボタンをクリックします。登録情報を記入するためのダイアログが開きます。DMG MORI Messengerでの表示名となる機械名称を決めます。次に、機械モデル、組織情報、タイムゾーンを選択します。保存をクリックすると、自動登録が行われ、DMG MORI Messengerに機械状態が表示されます。
![DMG MORI Messenger Server登録](/img/applicationinterface/messenger_server_registration.png)

## 手動登録

**Step 1:** IoTconnector flex の `アプリケーションインタフェース` ページで、MTConnect の下にある `有効` スイッチが ON になっていることを確認します:

![MTConnect](/img/applicationinterface/mtconnect_enable_stream.png)

`MTConnect出力を表示する` をクリックすると、MTConnectの動作を確認できます。

**ステップ2: ** DMG MORI Messengerの「設定」→「機械」を選択し、「追加」ボタンをクリックします。必要に応じて機械の詳細情報を入力します。

`MTConnect Agent`は`MTConnect Agent 1.3.0 (Standard)`を、`MTConnect Stream URL`には`http://<iot-connector-device-ip>:15404`（例: http://192.168.178.150:15404）をそれぞれ入力します。IP アドレスは IoTConnector flexの UI の [`ネットワーク`](Network.md) ページで確認できます。

![DMG MORI Messenger](/img/DMGMessenger.png)

設定数分後にMessengerのダッシュボードにデータが表示されます。
