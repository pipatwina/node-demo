var express = require('express')
var app = express()
var body = require('body-parser').urlencoded({extended:false})
app.listen(2000)

var mysql= require('mysql')
var db = {
    host:'128.199.119.79',
    user:'imarket',
    password:'p@ssword',
    database:'imarket'
}

var pool = mysql.createPool(db)

app.engine('html',require('ejs').renderFile)
app.get('/',showHome)
app.get('/status',showStatus)
app.get('/list',showlist)
app.get('/register',showRegisterPage)
app.post('/register',body,saveNewUser)
app.get('/login',showLogin)
app.post('/login',body,checkPassword)
app.use(express.static('public'))
app.use(showError)

function showError(req,res){
    res.render('error.html')
}
function showHome(req,res){
    res.render('index.html')
}
function showLogin(req,res){
    res.render('login.html')
}
function showStatus(req,res){
    res.send({status:'OK'})
}
function showlist(req,res){
    pool.query('select * from post',
    function (error,data){
        res.render('list.html',{post:data})
    }
    )
}

function showRegisterPage(req,res){
    res.render('register.html')
}

function saveNewUser(req,res){
    //console.log(req.body)
    //res.send('Done')
    pool.query('insert into member(email,password,name) values(?,sha2(?,512),?)',[req.body.email,req.body.password,req.body.fullname],
    function (error,data){
        res.redirect('/login')
    })
}

function checkPassword(req,res){
    pool.query('select * from member where email= ? and password = sha2(?,512)',[req.body.email,req.body.password],
    function (error,data){
        if(data.length==0){
            res.redirect('/login?message=Incorrect Password')
        }else{
            //res.send('Password is OK')
            var card = createCard()
            granted[card]=data[0]
            res.set('Set-Cookie',"card="+card)
            res.redirect('/profile')
        }        
    })
}

var granted = []

function createCard(){
    return parseInt(Math.random()*1000000) +'-'+
        parseInt(Math.random()*1000000) +'-'+
        parseInt(Math.random()*1000000) +'-'+
        parseInt(Math.random()*1000000)
}