const express = require('express');
const mariadb = require('mariadb');
const bodyParser = require('body-parser');
const app = express();
const cors = require ('cors')



const usersRouter = require ('./routes/users')

app.use(bodyParser.urlencoded({ extended:  false }));
app.use(bodyParser.json());
app.use(express.static(__dirname  +  '/public'));
app.use(cors())



app.use('/users',usersRouter);


let server = app.listen(process.env.PORT || 5000,function(){
    console.log('on port' + server.address().port);
})