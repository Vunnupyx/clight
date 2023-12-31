---
title: 仮想データポイント
---

import Player from 'react-player/file';
import video from '../../../../static/video/vdp_calculation.mp4';

# 仮想データポイント(VDP)

## はじめに

仮想データポイント（VDP）は、1 つまたは複数の実データポイント、または以前に定義した仮想データポイントから、計算されたデータポイントを作成する機能です。最終的な値を計算するために、多くの演算が可能です。

**重要:** VDP が他の VDP のソースとして定義されている場合、ソース VDP は使用前に定義されていなければならず、VDP のリストで上に表示されなければなりません。そうでない場合は、`ソース`のドロップダウンメニューはグレーアウトされます。

#### 非ブール値のブール値への自動変換

ソースがブール値でない場合、論理演算、比較演算、列挙演算を使用すると、VDP の評価中にソースがブール値に変換されます。

- ソース値が数値の場合: 1 以上の値は `真` 、0 は `偽` と解釈されます。
- ソース値が数値ではなく、テキストの場合: 1 文字以上のテキストは `真` 、空文字列 ("") は `偽` と解釈されます。

### 利用可能な演算子

注意: もし、いくつかの演算を組み合わせる必要がある場合は、`演算の組み合わせ`セクションを参照してください。

#### 演算子の概要:

| 名称              | タイプ          | ソースの数 | 結果        |
| ----------------- | --------------- | ---------- | ----------- |
| AND               | 論理            | 複数       | ブール値    |
| OR                | 論理            | 複数       | ブール値    |
| NOT               | 論理            | 単独       | ブール値    |
| Counter           | カウンター      | 単独       | 数値        |
| Thresholds        | 閾値            | 単独       | Text/数値   |
| Greater           | 比較            | 単独       | ブール値    |
| Greater or Equal  | 比較            | 単独       | ブール値    |
| Smaller           | 比較            | 単独       | ブール値    |
| Smaller or Equal  | 比較            | 単独       | ブール値    |
| Equal             | 比較            | 単独       | ブール値    |
| Unequal           | 比較            | 単独       | ブール値    |
| Enumeration       | 列挙            | 複数       | 文字列/数値 |
| Calculation       | 算術            | 複数       | 数値        |
| AND               | 論理            | 複数       | ブール値    |
| OR                | 論理            | 複数       | ブール値    |
| NOT               | 論理            | 単独       | ブール値    |
| Counter           | カウンター      | 単独       | 数値        |
| Thresholds        | 閾値            | 単独       | 文字列/数値 |
| Greater           | 比較            | 単独       | ブール値    |
| Greater or Equal  | 比較            | 単独       | ブール値    |
| Smaller           | 比較            | 単独       | ブール値    |
| Smaller or Equal  | 比較            | 単独       | ブール値    |
| Equal             | 比較            | 単独       | ブール値    |
| Unequal           | 比較            | 単独       | ブール値    |
| Enumeration       | 列挙            | 複数       | 文字列/数値 |
| Calculation       | 算術            | 複数       | 数値        |
| Set Energy Tariff | 列挙            | 複数       | Text        |
| Blink Detection   | Blink Detection | 単独       | 数値        |

#### 演算子:

##### AND

タイプ: 論理 | ソースの数: 複数 | 結果: ブール値

選択されたすべてのソースデータポイントの値が真である場合、真を返します。

##### OR

タイプ: 論理 | ソースの数: 複数 | 結果: ブール値

少なくとも 1 つの選択されたソースデータポイント値が真の場合、真を返します。

##### NOT

タイプ: 論理 | ソースの数: 単独 | 結果: ブール値

ソースデータポイントの値が真の場合は偽を、偽の場合は真を返します。

##### COUNTER

タイプ: カウンタ | ソースの数: 単独 | 結果: 数値

データポイントのすべての状態変化(ソースの立ち上がりフラグ、すなわち 0 から 1 または値の増加)をカウントし、変化の総数を数値として示します。

カウンターは、再起動後も保持されます。カウンターは、2 つの方法でリセットすることができます。

- **手動リセット:** UI からリセットボタンでカウンターを手動でリセットすることができます。

![カウンターの手動リセットボタン](/img/vdp/counter_manual_reset.png)

- **スケジュールリセット:** リセットをスケジュール設定することによって、カウンターをリセットすることができます。複数のスケジュールを入力することができ、特定の月、日、時刻、または「毎」として選択することができます。設定された時刻になると、カウンターのカウントは 0 にリセットされます。

![カウンタリセットスケジュールボタン](/img/vdp/counter_schedule_reset.png)

スケジュールリセットの例:
![カウンタスケジュール例](/img/vdp/counter_scheduled_reset_example.png)

##### THRESHOLDS

タイプ: 閾値 | ソースの数: 単独 | 結果: 文字列/数値

1 つのデータポイントに対して複数の閾値を設定することができます。

閾値を設定するには、右の閾値設定ボタンをクリックしてダイアログウィンドウを開いてください:
![閾値の設定](/img/vdp/set_threshold.png)
希望する閾値と、その閾値を超えた場合の VDP の値をそれぞれ `値` に入力します。閾値は昇順にソートされ、どの閾値を超えたら、その閾値に対応する `値` が VDP の結果となるかを確認することができます。

**例**: 以下の例では、`タンクの状態`という仮想データポイントが`[AI] タンクレベル`データソースに接続されており、現在の値は 13.54(グラフの太い黒線)です。5-低、10-通常、20-高の 3 つの閾値が与えられています。現在値は 13.54 未満の閾値は 3-通常のため、VDP 値は`通常`となります。
![閾値の追加](/img/vdp/add_threshold.png)

##### GREATER

タイプ: 比較 | ソースの数: 単独 | 結果: ブール値

データポイント値が比較値より大きい場合に真を返します。

比較値を設定するには、その行の `アクション` カラムにある `比較値設定` ボタンを使用します。

##### GREATER EQUAL

タイプ: 比較 | ソースの数: 単独 | 結果: ブール値

データポイント値が比較値以上の場合に真を返します。

比較値を設定するには、その行の `アクション` カラムにある `比較値設定` ボタンを使用します。

##### SMALLER

タイプ: 比較 | ソースの数: 単独 | 結果: ブール値

データポイント値が比較値未満の場合に真を返します。

比較値を設定するには、その行の `アクション` カラムにある `比較値設定` ボタンを使用します。

##### SMALLER EQUAL

タイプ: 比較 | ソースの数: 単独 | 結果: ブール値

データポイント値が比較値以下の場合に真を返します。

比較値を設定するには、その行の `アクション` カラムにある `比較値設定` ボタンを使用します。

##### EQUAL

タイプ: 比較 | ソースの数: 単独 | 結果: ブール値

データポイント値が比較値と一致する場合に真を返します。

比較値を設定するには、その行の `アクション` カラムにある `比較値設定` ボタンを使用します。

##### UNEQUAL

タイプ: 比較 | ソースの数: 単独 | 結果: ブール値

データポイント値が比較値と異なる場合に真を返します。

比較値を設定するには、その行の `アクション` カラムにある `比較値設定` ボタンを使用します。

##### ENUMERATION

タイプ: 列挙 | ソースの数: 複数 | 結果: 文字列/数値

ソースの値に対応する文字列を返します。これらは、以下のように `アクション` カラムの `列挙子設定` ボタンを使って設定します。
![列挙子設定ボタン](/img/vdp/vdp_set_enum_button.png)

列挙子設定ビューでは、デフォルト値を設定することができ、定義された条件のいずれにも当てはまらない場合に、その値が返されます。

![列挙子選択条件追加](/img/vdp/set_enum_default.png)

青いプラス記号をクリックすると、新しい条件を追加することができます。それぞれの条件では、対象の変数と、その変数が`真`になったときに出力する文字列を、"左辺が真である場合の値"欄に入力します。対象の変数がブール値でなければ[`非ブール値のブール値への自動変換`](VirtualDataPoints.md#automatic-conversion-of-non-boolean-values-to-boolean-values) で説明したようにブール値に変換されます。
![列挙子の追加](/img/vdp/set_enum_row.png)

注：列挙の順序は、ドラッグ＆ドロップで変更できます。これは、どの値が最初に真になるか、どの列挙子が VDP の結果となるかに影響します。

**例:** 以下の写真にあるような値がある場合の例を示します。黄ランプのデジタル入力が`真`であれば、結果は`警告`になります。緑ランプのデジタル入力が`真`であれば、結果は`良`になります。その他の場合、デフォルトの結果は `情報なし` になります。
![列挙の追加例](/img/vdp/set_enum_example.png)

##### CALCULATION

タイプ: 算術 | ソースの数: 複数 | 結果: 数値

変数名を使用し、数式を手動で入力するカスタム数式です。複数のデータポイントを結合する場合や、より複雑な数学的操作に便利です。

**重要**: ブール値ソースを選択した場合、その値が真なら 1、偽なら 0 と扱われます。

**サンプル動画:**
<Player controls url={video}/>

### 仮想データポイントの追加

![新しい仮想データポイントの追加](/img/vdp/add_vdp.png)

1. 青いボタンと白いプラスアイコンをクリックします。VDP のリストに新しい行が追加されます。
2. 新しく生成する VDP の名前を入力します。
3. 演算子を選択します。
4. 1 つまたは複数のソースを選択します。どの演算子が単独または複数のソースを取るかについては、上の表を参照してください。
   ![ソースの選択](/img/vdp/choose_source.png)
5. 演算子固有の詳細と設定については、上記の演算子の説明を参照してください。いくつかの演算子では、保存後に追加の情報を設定する必要があります。
6. 右の `アクション` 欄にある緑色のチェックボタンをクリックして保存し、編集を中止するか、赤色の十字をクリックしてエントリーを破棄してください。
7. ページ右上の`変更を適用`ボタンをクリックすると、新しいデータポイントが反映されます。

### 複合操作

複合操作の作成方法は、求める結果の種類によって 2 通りあります。

- `計算`を使用する場合: 演算を伴う数値結果を得たい場合は、 `数値演算` を用いて複数のデータソースを組み合わせることができます。上記の説明を参照してください。

- 新しい VDP を作成し、それらを結合する場合: 複数のデータソースから論理演算の結果を得たい場合、複数の VDP を作成し、段階的に組み合わせることになります。例えば、_DataPoint1 & DataPoint2 & !DataPoint3_ => の結果を作成するには、以下の 4 つのステップを踏んでください:

1. DP1 と DP2 を含む最初の VDP1 を作成し、AND 演算を行う。
2. DP3 で 2 番目の VDP2 を作成し、NOT 演算を行う。
3. VDP1 と VDP2 の AND 演算で 3 番目の最終 VDP3 を作成する。
4. VDP3 を結果として出力する。

### 仮想データポイントの削除

1. 削除したい VDP の右側、`アクション`カラムの下にあるゴミ箱アイコンをクリックします。
2. "データポイントを削除しますか？" という質問のオーバーレイダイアログで Yes を選択します。
3. `変更を適用`ボタンをクリックして、変更を反映します。
