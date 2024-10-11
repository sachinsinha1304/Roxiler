const express = require('express')
const axios = require('axios')
const cors = require('cors')
require('dotenv').config();

const { createDatabase } = require('./sql')
const route = require('./route')
const app = express()

const corsOptions = {
    origin: '*', 
  };
app.use(cors(corsOptions))

app.use('/route', route)


app.get('/amazon/roxilier-sytem/data', (req, res, next)=>{
    axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json')
    .then(async (data)=>{
        // console.log(typeof data)
        let result = await createDatabase(data, next)
        res.json({'msg':await result})
    })
    .catch((err)=>{
        next(err)
    })
})

app.use((err, req, res, next)=>{
    console.log(err);
    res.json({'err':'there is some error'})
})

app.use('/', (req, res)=>{
    res.json({'msg' : 'api is working'})
})

app.listen(3001, ()=>{
    console.log("port 3000 is listening")
})