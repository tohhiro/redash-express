# redash-express

## Summary
Expressのサーバーです。フロントからPOSTでアクセスされたら、渡されたパラメータのhost、token、paramsを使って、API（Redash API）に接続し、結果をフロントにJSONで返します。このようにしている理由は、フロントから直接Redash APIを叩くとCORSエラーとなるため、中継するサーバーの役目となります。また外部からアクセスされても問題がないよう、hostやtoken、パラメータなどはすべてフロントから渡すようになっています。そのためコードやコメントからはRedash APIに接続することは読み解けますが、どのHOST、どのクエリ、Tokenなどの情報はわからない作りになっています。

## 処理のサマリ
1. POSTでフロントからアクセスされる
1. 渡ってきたパラメータ、Query IDを使ってrefresh APIを叩く
1. refresh APIの返り値より、job IDを取得し、job APIを叩く
1. job APIの返り値より、query_result_idを取得し、results APIを叩く
1. results APIの返り値に結果を得る
1. JSONで結果をフロントに返す

## 実行方法
下記のいづれかで実行できます

- node app.js
- nodemon app.js
- npm run start（2番目と同じ）

## クレデンシャル情報
rootに.envファイルを作成してください。
