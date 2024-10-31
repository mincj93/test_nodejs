const express = require('express')
const app = express();
const { MongoClient } = require('mongodb')




let db;
const id = encodeURIComponent("mincj93");
const pw = encodeURIComponent("AlsCkd!@34");

const url = `mongodb+srv://${id}:${pw}@cluster0.xuzu2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
new MongoClient(url).connect().then((client) => {
    console.log('DB연결성공')
    db = client.db('forum')
}).catch((err) => {
    console.log(err)
})


// Express 설정
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')




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
app.get('/news', () => {
    db.collection('post').insertOne({ title: 'testtest' })
})

app.get('/test', (요청, 응답) => {
    응답.send('테스트입니다.')
})


app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
})