const express = require('express')
const app = express();
const { MongoClient } = require('mongodb')

let db
const url = 'mongodb사이트에 있던 님들의 DB 접속 URL'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
}).catch((err)=>{
  console.log(err)
})

app.use(express.static(__dirname + '/public'));

app.get('/', (요청, 응답) => {
    응답.send('반갑다')
})

app.get('/main', (요청, 응답) => {
    응답.sendFile(__dirname + "/main.html")
})

app.get('/pageOne', (요청, 응답) => {
    응답.sendFile(__dirname + "/pages/pageOne.html")
})
app.get('/pageTwo', (요청, 응답) => {
    응답.sendFile(__dirname + "/pages/pageTwo.html")
})

app.get('/test', (요청, 응답) => {
    응답.send('테스트입니다.')
})


app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
})