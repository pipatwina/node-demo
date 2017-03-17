var express = require('express')
var app = express()
app.listen(2000)
app.engine('html',require('ejs').renderFile)
app.use(express.static('public'))
app.use(showError)

app.get('/',showHome)

function showError(req,res){
    res.render('error.html')
}

function showHome(req,res){
    res.render('index.html')
}

app.get('/status',showStatus)

function showStatus(req,res){
    res.send({status:'OK'})
}