// express読み込み
const express = require('express')
const app = express() // expressのインスタンス化
const PORT = 8080 // サーバーが起動するポート番号

require('dotenv').config();
const utils = require('./components/utils.js')
const redash = require('./components/redash.js')

// bodyParser読み込み
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true })); // bodyParserのインスタンス化
app.use(bodyParser.json()); // HTTPリクエストのボディをjsonで扱えるようになる

// CORSを許可する
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // アクセスされるURLを限定する場合は、*に環境変数で設定する
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


//8080番ポートでサーバーを待ちの状態
app.listen(PORT, () => {
  console.log("Starting Server..."); //サーバーが起動した際のメッセージ
});

//'/get'でアクセスされた場合、Redash APIから渡されたパラメータでJSONを取得
app.post('/',utils.wrap(async (req, res, next)=> {

        /* 
        rootに.envファイルを作成、
        下記の2つの環境変数を記載し、RedashのTOKENとHOSTを設定
        下記で取得し、変数に入れる
        */
        const token = process.env.TOKEN
        const host = process.env.HOST

        // クエリパラメータ付でrefresh apiを実行
        let response = await redash.fetchRedash(token, redash.refreshRedash(host, req.body), 'POST')

        // refresh apiの戻り値にjobが入っている
        let job = response['job'];  

        // job のステータスが3,4になるまで実行(refreshが完了すると脱出する)
        while (job.status !== 3 && job.status !== 4) {

            // jobにあるidで、 apiの最新のジョブ状況をチェック
            response = await redash.fetchRedash(token, redash.jobRedash(host, job['id']), 'GET')
            job = response['job'];

            await utils.sleep(500);  // 0.5秒待つ
        } // end while

        // query_result_idを取り出す
        const resultId = job['query_result_id']; 

        // query_result_id で指定される結果をJSONで受け取る
        response = await redash.fetchRedash(token, redash.resultRedash(host, req.body, resultId), 'GET')

        // query_result.dataに配列で結果が格納 
        const resultSet = response.query_result.data;  
        console.log(resultSet) ////////////////////////////////////////////////////////////////出力表示確認

        res.json(resultSet);
        res.end();
}))