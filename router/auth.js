require('../db/connection.js');
const Data=require('../model/dataSchema.js');
const Register=require('../model/registerSchema.js');
const Cart=require('../model/cartSchema.js');
const express=require('express');
const router=express.Router();
const path=require('path');
const bcrypt=require('bcrypt');

// getdata api
router.get('/displaydata',function(req,res){

    Data.find(function(err,data){
        if(err){
            console.log(err);
        }
        else{
           
            console.log({data:data},data);
            res.status(200).json({data:data});
        }
        });
    
});

router.get('/displaycartdata',function(req,res){

    Cart.find(function(err,data){
        if(err){
            console.log(err);
        }
        else{
           
            console.log({data:data},data);
            res.status(200).json({data:data});
        }
        });
    
});




// register form api
router.post('/register',async(req,res)=>{
    // console.log(req.body);
    // res.json({message:req.body});
    // below schema names are mentioned in request body
    const {firstname,lastname,mobile,email,password,confirmpassword}=req.body;
    if(!firstname || !lastname|| !mobile || !email || !password || !confirmpassword){
        return res.status(422).json({error:"plz fill all filled"});
    }
    try{
        const useExist=await Register.findOne({email:email})
        if(useExist){
            return res.status(422).json({error:"email already exist"});
        }
        else if(password != confirmpassword)
        {
            return res.status(422).json({error:"password are not matched"});
        }
    }
    catch(err){
        console.log(err);
    }




    const user=new Register({firstname,lastname,mobile,email,password,confirmpassword})
    const userregister=await user.save();
    if(userregister){
        res.status(201).json({message:"user registered successfully"});
    }
});



// login post api
router.post('/login',async(req,res)=>{
    // below two lines for testing purpose in POSTMAN
    //   console.log(req.body);
    // res.json({message:req.body});
try{
const {email,password}=req.body;
console.log(req.body);
if(!email || !password){
    return res.status(400).json({error:"plz filled the data"})
}
const userLogin=await Register.findOne({email:email});
console.log('user login is',userLogin);
if(userLogin!==null){
//     const isMatch=await bcrypt.compare(req.body.password,userLogin.password);
//    console.log(isMatch);
    if(req.body.password!=userLogin.password)
    {
        res.status(401).json({error:"invalid credentials"});
    }
    else
    {
        res.status(200).json({message:"user signin successfully"});
    } 


    // })
}
else{
    res.status(401).json({error:"invalid credentials"});
}

}

catch(err){
    console.log(err);
}
});


// contact form api
router.post('/contact',async(req,res)=>
{
try{
    const {firstname,email,mobile,circle,city,state,message}=req.body;
    if(!firstname ||!email || !mobile ||!circle ||  !city || !state || !message){
        console.log("error in contact form");
        return res.json({error:"plz filled the contact form"});

    }
    const userContact=await Register.findOne
    ({_id:req.userID});
    if(userContact){
        const userMessage=await userContact.
        addMessage(firstname,email,mobile,circle,city,state,message)
        await userContact.save();
        res.status(201).json({message:"user contact successfully"}); 
    }
}catch(error){
    console.log(error);
}
})


// save data by id
router.post(`/cartdata/:id`,async(req,res)=>{
    console.log(req.params.id);
    try{
    const productData=await Data.findOne
    ({_id:req.params.id});
    console.log(productData);
    if(productData){
        const user=new Cart({productname:productData.productname,description:productData.description,category:productData.category,price:productData.price,imageurl:productData.imageurl})
        await user.save();
        res.status(201).json({message:"cart data saved"}); 
    }
}catch(error){
    console.log(error);
}
    
});


// delete by id
router.post(`/deletedata/:id`,async(req,res)=>{
    console.log(req.params.id);
    try{
    const productData=await Cart.deleteOne
    ({_id:req.params.id});
    console.log(productData);
    if(productData){
       
        res.status(201).json({message:"cart data deleted"}); 
    }
}catch(error){
    console.log(error);
}
    
});


module.exports=router;