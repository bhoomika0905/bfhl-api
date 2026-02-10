const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

const EMAIL = "bhoomika1158.be23@chitkarauniversity.edu.in";
const GEMINI_KEY = "AIzaSyAMy1QYr72-FpQfYPLLINoxQ-JYG3zKBQA";
const fibonacci=n=>{
 let arr=[0,1];
 for(let i=2;i<n;i++)
  arr[i]=arr[i-1]+arr[i-2];
 return arr.slice(0,n);
}

const isPrime=n=>{
 if(n<2) return false;
 for(let i=2;i<=Math.sqrt(n);i++)
  if(n%i===0) return false;
 return true;
}

const gcd=(a,b)=>b===0?a:gcd(b,a%b);
const lcm=arr=>arr.reduce((a,b)=>a*b/gcd(a,b));
const hcf=arr=>arr.reduce((a,b)=>gcd(a,b));

app.post('/bfhl', async(req,res)=>{
 try{
  const body=req.body;
  let data;

  if(body.fibonacci!==undefined)
   data=fibonacci(body.fibonacci);

  else if(body.prime!==undefined)
   data=body.prime.filter(isPrime);

  else if(body.lcm!==undefined)
   data=lcm(body.lcm);

  else if(body.hcf!==undefined)
   data=hcf(body.hcf);

  else if(body.AI!==undefined){

   const response=await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
    {
     method:"POST",
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify({
      contents:[{parts:[{text:body.AI}]}]
     })
    }
   );

   const result=await response.json();
   data=result.candidates[0].content.parts[0].text.split(" ")[0];
  }

  else
   return res.status(400).json({
    is_success:false,
    official_email:EMAIL
   });

  res.json({
   is_success:true,
   official_email:EMAIL,
   data
  });

 }catch{
  res.status(500).json({
   is_success:false,
   official_email:EMAIL
  });
 }
});


app.get('/health',(req,res)=>{
 res.json({
  is_success:true,
  official_email:EMAIL
 });
});

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log("Running",PORT));
