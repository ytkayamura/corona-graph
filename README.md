corona-graph
====

厚生労働省サイトから世界のコロナ感染状況を取得して、線グラフ表示します。

##  Install
```
$ npm install
```

## Usage(Local)
それぞれ別ターミナルで下記を実行

- mongod
- npm run start:dev
- npm run start:dev:server

## Heroku App
https://corona-graph.herokuapp.com/

## Note
scrapeKourow()中のループ、

```
for (const link of links.slice(0, 1)) {
```
を

```
for (const link of links) {
```
に書き換えると3/2以降のデータを取得できます。
厚労省のサイトに連続アクセスしますので、充分なアクセス間隔を取るようにしてください。


