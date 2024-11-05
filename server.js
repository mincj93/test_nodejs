const dayjs = require('dayjs');
const express = require('express');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');


const app = express();
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public')); // css 나 이미지를 찾을 때 public 이라는 경로를 추가해주지 않아도 찾을 수 있음. 기본적으로 public 이라는 경로명이 붙으므로 하위 경로만 적어주면 됨

let db;
const id = encodeURIComponent("mincj93");
const pw = encodeURIComponent("AlsCkd!@34");

const url = `mongodb+srv://${id}:${pw}@cluster0.xuzu2.mongodb.net/forum?retryWrites=true&w=majority&appName=Cluster0`
MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tlsAllowInvalidHostnames: true,
    tlsAllowInvalidCertificates: true,
}).then((client) => {
    console.log('데이터베이스 연결 성공');
    db = client.db('forum')
    app.listen(8080, () => {
        console.log('http://localhost:8080 에서 서버 실행중')
    })
}).catch((err) => {
    console.log('데이터베이스 연결 실패', err);
})

app.get('/', (요청, 응답) => {
    응답.send('반갑다')
})

app.get('/main', (요청, 응답) => {
    응답.sendFile(__dirname + "/index.html")
})

app.get('/pageOne', (요청, 응답) => {
    응답.sendFile(__dirname + "/pages/pageOne.html")
})
app.get('/pageTwo', (요청, 응답) => {
    응답.sendFile(__dirname + "/pages/pageTwo.html")
})
app.get('/news', () => {
    db.collection('post').insertOne({ title: 'testtest' });
})

app.get('/test', (요청, 응답) => {
    응답.send('테스트입니다.')
})
app.get('/list', async (요청, 응답) => {
    let result = await db.collection('post').find().toArray()
    응답.render('list.ejs', { 글목록 : result })
})

app.get('/time',  (요청, 응답) => {
    let now = dayjs().format("YYYY MM DD")  ;
    응답.render('time.ejs', { data : new Date() , now : now })
})