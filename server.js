// ------------------------------------------------------------------- 
// 모듈 Import
const dayjs = require('dayjs');
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const methodOverride = require('method-override') // 메소드 요청 방법 변경 모듈
const bcrypt = require('bcrypt')

// 로그인 관련 모듈 3개. (회원인증)
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')

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
app.use(methodOverride('_method'))

// 회원인증에 쓸 모듈 아래 3개 순서도 중요함
app.use(passport.initialize())
app.use(session({
    secret: '1234', // 개별 비번 잘 넣어주면 됩니다. 세션문자열같은거 암호화할 때 쓰는데 긴게 좋습니다. 털리면 인생 끝남
    resave: false, // 유저가 요청날릴 때 마다 session데이터를 다시 갱신할건지 여부 (false 추천)
    saveUninitialized: false // 유저가 로그인 안해도세션을 저장해둘지 여부 (false 추천)
}))
app.use(passport.session({
    secret: '어쩌구',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }
}))

// passport 라이브러리 설정
// 이 코드 하단에 API들을 만들어야 그 API들은 로그인관련 기능들이 잘 작동합니다.
passport.use(new LocalStrategy(async (입력한아이디, 입력한비번, cb) => {
    lg('입력한아이디 == ', 입력한아이디)
    lg('입력한비번 == ', 입력한비번);

    let result = await db.collection('user_account').findOne({ username: 입력한아이디 })
    if (!result) {
        return cb(null, false, { message: '아이디 DB에 없음' })
    }
    // await bcrypt.compare(입력값,  조회된 hash값) 이렇게 하면 조회된hash값과 입력값을 hash로 변환해 비교해준다.
    await bcrypt.compare(입력한비번,  result.password)
    if (result.password == 입력한비번) {
        return cb(null, result)
    } else {
        return cb(null, false, { message: '비번불일치' });
    }
}))

// 로그인 성공할 때 마다 자동으로 세션이 만들어짐
passport.serializeUser((user, done) => {
    process.nextTick((e) => { // nextTick : 비동기적으로 처리하고 싶을 때 쓰는 문법. process.nextTick 안에 있는 코드는 처리를 살짝 보류시키고 다른 작업들이 끝나면 실행시켜줌
        lg('user._id == ', user._id);
        lg('user.password == ', user.password)
        done(null, { id: user._id, password: user.password })
    })
})

// 로그인 유지되고 있는지 여부를 판단
passport.deserializeUser((user, done) => {
    lg("deserializeUser user == ", user)
    process.nextTick(() => {
        return done(null, user)
    })
    //저가 요청날릴 때 마다 쿠키에 뭐가 있으면 그걸 까서 세션데이터랑 비교해보고 
    //별 이상이 없으면 현재 로그인된 유저정보를 모든 API의 "요청.user"에 담아줍니다
})


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
app.get('/', async (req, res) => {
    // let result = await db.collection('post').find().toArray()
    // res.render('list.ejs', { 글목록: result })
    res.redirect(`/list/${1}`);
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
    res.redirect(`/list/${1}`);
});

app.get('/list/:listId', async (req, res) => {

    let result = await db.collection('post').find()
        .skip((req.params.listId - 1) * 2).limit(2).toArray()
    res.render('list.ejs', { 글목록: result })
})

// 페이징 삽입된 API
// app.get('/list/:listId', async (req, res) => {

//     const listId = parseInt(req.params.listId);
//     const postsPerPage = 2; // 페이지당 게시글 수
//     const totalPosts = await db.collection('post').countDocuments();
//     const totalPages = Math.ceil(totalPosts / postsPerPage);

//     let posts = await db.collection('post')
//         .find()
//         .skip((listId - 1) * postsPerPage)
//         .limit(postsPerPage)
//         .toArray();

//     res.render('list.ejs', {
//         글목록: posts,
//         currentPage: listId,
//         totalPages: totalPages
//     });
// })

app.get('/write', async (req, res) => {
    res.render('write.ejs')
})
app.get('/time', (req, res) => {
    let now = dayjs().format("YYYY MM DD");
    res.render('time.ejs', { data: new Date(), now: now })
})
app.get('/detail/:id', async (req, res) => {
    // lg('req == ', req);
    lg('req.params == ', req.params);
    let result = await db.collection('post').findOne({ _id: new ObjectId(req.params.id) })
    if (result == null) {
        res.status(400).send('그런 글 없음')
    } else {
        res.render('detail.ejs', { result: result })
    }
})
app.get('/edit/:id', async (req, res) => {
    // lg('req == ', req);
    lg('req.params == ', req.params);
    let result = await db.collection('post').findOne({ _id: new ObjectId(req.params.id) })
    if (result == null) {
        res.status(400).send('그런 글 없음')
    } else {
        res.render('edit.ejs', { result: result })
    }
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/register', (요청, 응답) => {
    응답.render('register.ejs')
})



// -------------------------------------------------------------------
// post 방식 req들
app.post('/add', async (req, res) => {
    if (req.body.title == '') {
        res.send('제목안적었는데')
    } else {
        await db.collection('post').insertOne({ title: req.body.title, content: req.body.content })
        res.redirect('/write')
    }
})

app.post('/delete/:id', async (req, res) => {
    try {
        await db.collection('post').deleteOne({ _id: new ObjectId(req.params.id) })
        res.redirect('/list')
    } catch (error) {
        res.send('잘못된 삭제요청입니다.')
    }
})

app.post('/edit/:id', async (req, res) => {
    if (req.body.title == '' || req.body.content == '') {
        res.send('제목 내용 둘 다 채워야함')
    } else {
        // 몽고디비 업데이트하는 방법 >> db.collection('post').updateOne( {수정할document정보}, {$set: {덮어쓸내용}})

        await db.collection('post').updateOne({ _id: new ObjectId(req.params.id) }, { $set: { title: req.body.title, content: req.body.content } })
        res.redirect(`/detail/${req.params.id}`)
    }
})


app.post('/addtc', async (req, res) => {
    if (req.body.title == '') {
        lg('title 없음')
        return;
    }
    if (req.body.content == '') {
        lg('content 없음')
        return;
    }


    try {
        let insertData = {};
        const bodyData = req.body;
        insertData = { title: bodyData.title, content: bodyData.content };
        await db.collection('testCollection').insertOne(insertData)
        res.redirect('/write')
    } catch (error) {

        res.send('testCollection')
    }


})

app.post('/login', async (req, res, next) => {
    // 제출한아이디/비번이 DB에 있는거랑 일치하는지 확인하고 세션생성
    passport.authenticate('local', (error, user, info) => {
        lg('login user == ', user, 'req.user == ', req.user)
        if (error) return res.status(500).json(error)
        if (!user) return res.status(401).json(info.message)
        req.logIn(user, (err) => {
            if (err) return next(err)
            res.redirect('/')
        })
    })(req, res, next)
})

app.post('/register', async (요청, 응답) => {
    // await bcrypt.hash(원하는 문자, 문자열꼬는 강도)
    const hash = await bcrypt.hash(요청.body.password, 10);
    lg('요청.body.password = ', 요청.body.password, 'hash 변환값 = ', hash)


    await db.collection('user_account').insertOne({
        username: 요청.body.username,
        password: hash
    })
    응답.redirect('/')
})