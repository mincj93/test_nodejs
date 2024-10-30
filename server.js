const express = require('express')
const app = express();
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