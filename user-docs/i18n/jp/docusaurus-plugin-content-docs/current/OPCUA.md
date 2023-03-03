---
title: OPC UA の接続
---

- OPC UAサーバーのエンドポイントは、両方のネットワークインターフェースのポート `4840` に割り当てられています
- IPアドレスの設定は、[`ネットワーク`](Network.md)のページで確認できます。
- フリーソフトの[`uaExpert`](https://www.unified-automation.com/products/development-tools/uaexpert.html)を使用して、OPC UAサーバーの動作確認ができます。

OPC UAサーバーの有効/無効は、`有効`スイッチで設定できます。
![OPC UA概要](/img/applicationinterface/opcua_overview.png)

## 認証

OPC UAインターフェースでは、ドロップダウンメニューにより、任意の認証設定を選択することができます。ユーザーが選択できるのは:

- Anonymous (認証不要)
- ユーザー/パスワード（入力されたユーザー名とパスワードで、OPC UAサーバーにアクセスします）
  ![OPC UA認証オプション](/img/applicationinterface/opcua_auth.png)

## 暗号化

OPC UAサーバーは様々なセキュリティポリシーとモードもサポートしています。OPC UAクライアントは、これらのポリシーやモードを選択して、OPC UAデータポイントにアクセスすることができます。

セキュリティポリシー:

- None(なし)
- Basic128Rsa15
- Basic256
- Basic256Sha256

セキュリティモード:

- None(なし)
- 署名
- 署名と暗号化

## カスタム OPC UA 変数

OPC UAインターフェースでは、カスタムOPC UA変数を使用することも可能です。以下の手順でカスタムOPC UA変数を追加してください:

- OPC UA変数のダイアログを開いたら、下図の青い`独自OPC UA変数の追加`ボタンをクリックします。
  ![OPC UAカスタム変数](/img/applicationinterface/opcua_custom.png)

- OPC UA変数の`名前`、`ノードID`、`データタイプ`を入力し、`保存`をクリックします。
  ![OPC UAカスタム変数ダイアログ](/img/applicationinterface/add_opcua_custom.png)

- 以下の例のように、上部に保存された変数が表示されます。
  ![OPC UAカスタム変数の追加](/img/applicationinterface/added_new_opcua_variable.png)

- そして、変数の右端にある`変数の選択`ボタンをクリックすると、その変数がテーブルに追加されます。
- この変数に値をマッピングするには、[`アプリケーションインタフェース` ページ](ApplicationInterface.md) および [`マッピング`](Mapping.md) ページで説明されている通常のマッピングの手順に従います。
