const express=require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const db=require('../db');
const router=express.Router();
const JWT_SECRET=process.env.JWT_SECRET||'secret';

router.post('/register',async(req,res)=>{
 const {username,password}=req.body;
 try{
  const hashed=await bcrypt.hash(password,10);
  db.run('INSERT INTO users(username,password) VALUES(?,?)',
   [username,hashed],
   function(err){
     if(err) return res.status(400).json({error:'exists'});
     const token=jwt.sign({id:this.lastID,username},JWT_SECRET,{expiresIn:'7d'});
     res.json({token});
   });
 }catch(e){res.status(500).json({error:'server'});}
});

router.post('/login',(req,res)=>{
 const {username,password}=req.body;
 db.get('SELECT * FROM users WHERE username=?',[username],async(err,row)=>{
   if(err||!row) return res.status(400).json({error:'invalid'});
   const ok=await bcrypt.compare(password,row.password);
   if(!ok) return res.status(400).json({error:'invalid'});
   const token=jwt.sign({id:row.id,username:row.username},JWT_SECRET,{expiresIn:'7d'});
   res.json({token});
 });
});
module.exports=router;