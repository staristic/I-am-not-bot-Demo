const config = require('./config.js');
const http = require('http');
const https = require('https');
const bodyParser 	   = require('body-parser');
const express = require('express');
const request = require('request');
const app = express();
const server= http.createServer(app);
app.use(express.static('public'));
app.use(function (req, res, next) {
    var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.post('/bot', (req, res) => {
    var body = req.body;
    request(
        { 
            method: 'POST',   
            uri: 'https://www.google.com/recaptcha/api/siteverify',
            multipart:
            [ 
                { 
                    'content-type': 'application/json',
                    'body': JSON.stringify({
                        'secret': config.secret,
                        'response': body.token
                    })
                }
            ]
        }, function (error, response, body){
            if(response.statusCode == 201 || response.statusCode == 200){
                res.status(200).json({
                    success: true
                });
            }else{
                console.log('error: ', response.statusCode, error)
                res.status(200).json({
                    success: false
                });
            }
        }
    )
    
})

server.listen(1553, function(){
    console.log('listen in port 1553')
});
