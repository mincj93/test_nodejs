const express = require('express');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');


const app = express();
app.set('view engine', 'ejs')


let db;
const id = encodeURIComponent("mincj93");
const pw = encodeURIComponent("AlsCkd!@34");

const url = `mongodb+srv://${id}:${pw}@cluster0.xuzu2.mongodb.net/forum?retryWrites=true&w=majority&appName=Cluster0`
mongoose.connect(url).then((result) => {
    console.log('데이터베이스 연결 성공');

    app.listen(8080, () => {
        console.log('http://localhost:8080 에서 서버 실행중')
    })
}).catch((err) => {
    console.log('데이터베이스 연결 실패', err);
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
app.get('/list', (요청, 응답) => {
    응답.render('list.ejs')
})