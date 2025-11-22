const express=require('express');
const db=require('../db');
const router=express.Router();

router.get('/',(req,res)=>{
 db.all('SELECT * FROM menu',[],(err,rows)=>{
   if(err) return res.json([]);
   res.json(rows);
 });
});

router.post('/add',(req,res)=>{
 const {name,description,price,image,category}=req.body;
 db.run('INSERT INTO menu(name,description,price,image,category) VALUES(?,?,?,?,?)',
  [name,description,price,image,category],
  function(err){
    if(err) return res.status(500).json({error:'failed'});
    res.json({id:this.lastID});
  });
});

module.exports=router;