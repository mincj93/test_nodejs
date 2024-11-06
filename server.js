// ------------------------------------------------------------------- 
// 모듈 Import
const dayjs = require('dayjs');
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const mongoose = require('mongoose');

// ------------------------------------------------------------------- 
// 기본 정의
const app = express();
const lg = console.log;

// ------------------------------------------------------------------- 
// express 정의
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public')); // css 나 이미지를 찾을 때 public 이라는 경로를 추가해주지 않아도 찾을 수 있음. 기본적으로 public 이라는 경로명이 붙으므로 하위 경로만 적어주면 됨
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

// -------------------------------------------------------------------
// get 방식 요청들
app.get('/', (req, res) => {
    res.send('반갑다')
})
app.get('/main', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})
app.get('/pageOne', (req, res) => {
    res.sendFile(__dirname + "/pages/pageOne.html")
})
app.get('/pageTwo', (req, res) => {
    res.sendFile(__dirname + "/pages/pageTwo.html")
})
app.get('/news', () => {
    db.collection('post').insertOne({ title: 'testtest' });
})
app.get('/test', (req, res) => {
    res.send('테스트입니다.')
})
app.get('/list', async (req, res) => {
    let result = await db.collection('post').find().toArray()
    res.render('list.ejs', { 글목록: result })
})
app.get('/write', async (req, res) => {
    res.render('write.ejs')
})
app.get('/time', (req, res) => {
    let now = dayjs().format("YYYY MM DD");
    res.render('time.ejs', { data: new Date(), now: now })
})
app.get('/detail/:id', async (요청, 응답) => {
    lg('요청 == ', 요청);
    lg('요청.params == ', 요청.params);
    let result = await db.collection('post').findOne({ _id: new ObjectId(요청.params.id) })
    응답.render('detail.ejs', { result: result })
})

// -------------------------------------------------------------------
// post 방식 요청들
app.post('/add', async (요청, 응답) => {
    if (요청.body.title == '') {
        응답.send('제목안적었는데')
    } else {
        await db.collection('post').insertOne({ title: 요청.body.title, content: 요청.body.content })
        응답.redirect('/write')
    }
})
app.post('/addtc', async (요청, 응답) => {
    if (요청.body.title == '') {
        lg('title 없음')
        return;
    }
    if (요청.body.content == '') {
        lg('content 없음')
        return;
    }


    try {
        let insertData = {};
        const bodyData = 요청.body;
        insertData = { title: bodyData.title, content: bodyData.content };
        await db.collection('testCollection').insertOne(insertData)
        응답.redirect('/write')
    } catch (error) {

        응답.send('testCollection')
    }


})