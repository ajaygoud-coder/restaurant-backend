const express=require('express');
const Razorpay=require('razorpay');
const crypto=require('crypto');
const db=require('../db');
const router=express.Router();

const instance=new Razorpay({
 key_id:process.env.RAZORPAY_KEY_ID,
 key_secret:process.env.RAZORPAY_SECRET
});

router.post('/create-order',async(req,res)=>{
 try{
  const {amount,userId,items}=req.body;
  const order=await instance.orders.create({
    amount: Math.round(amount*100),
    currency:'INR',
    receipt:'rcpt'+Date.now()
  });
  db.run('INSERT INTO orders(user_id,items,amount,razorpay_order_id,status) VALUES(?,?,?,?,?)',
   [userId||null, JSON.stringify(items||[]), amount, order.id, 'created']);
  res.json({order});
 }catch(e){res.status(500).json({error:'create fail'});}
});

router.post('/verify',(req,res)=>{
 const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
 const sign=razorpay_order_id+"|"+razorpay_payment_id;
 const expected=crypto.createHmac('sha256',process.env.RAZORPAY_SECRET)
   .update(sign).digest('hex');
 if(expected===razorpay_signature){
  db.run('UPDATE orders SET status=?, razorpay_payment_id=? WHERE razorpay_order_id=?',
   ['paid',razorpay_payment_id,razorpay_order_id]);
  return res.json({success:true});
 }
 res.status(400).json({success:false});
});

module.exports=router;