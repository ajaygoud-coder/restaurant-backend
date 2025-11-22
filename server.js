const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const path=require('path');
const fs=require('fs');
const db=require('./db');

const app=express();
app.use(cors());
app.use(bodyParser.json());

const initSql=fs.readFileSync(path.join(__dirname,'models','init.sql')).toString();
db.exec(initSql,err=>{ if(err) console.error(err); });

app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/payment', require('./routes/payment'));

app.get('/',(req,res)=>res.send('backend ok'));

const PORT=process.env.PORT||8000;
app.listen(PORT,()=>console.log('running',PORT));
