const express = require("express");
const cors = require("cors");
const path=require('path');
const bodyparser=require("body-parser");
const jwt = require("jsonwebtoken");
const Signupdata=require('./src/model/signupData');
const Postdata=require('./src/model/postData');
const Category=require('./src/model/category');

const Controldata = require("./src/model/controls");
const app = express();
app.use(express.static('./dist/Blog'));
app.use(cors())
app.use(bodyparser.json());
const port= process.env.PORT||3000

//verify root admin
function verifyrootToken(req, res, next) {
    
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    console.log(token);
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')

    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }
  //verify admin
function verifyadminToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'adminKey')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }
    //verify user
function verifyuserToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'userKey')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }
// signup handling

app.post('/api/signup',async (req,res)=>{

    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods:GET, POST, PUT,DELETE");
   
       try{
           
           const user=req.body.email;
           
           const username= await Signupdata.findOne({email:user});
           
           if(username){
              return res.send({mesg:false})
           }else{
            //    const pwd=req.body.user.password;
            //    const paswd= await Signupdata.findOne({password:pwd});
            //    if(paswd){
            //     return res.send({mesg:false})
            //    }
               
                   var item={
                       name:req.body.name,
                       email:req.body.email,
                       password:req.body.password
                   }
                   var sign= Signupdata(item);
                   sign.save();
                   return res.send({mesg:true});
               
           }
           
       }catch(error){
        return res.send({mesg:false})
       }
   
   })

   //login handling

app.post('/api/login',async (req,res)=>{
 
    user="superadmin";
    password="12345";
    try {
        
    let userData=req.body;
    
    const use=userData.uname;
    const pas=userData.password;
    if(userData.uname=="superadmin"&&userData.password=="12345"){
      
        let payload={subject:user+password}
        let token=jwt.sign(payload,'secretKey');
        
        return res.send({mesg:token,role:'rootuser'});
    }
    if(userData.uname=="admin"&&userData.password=="1234"){
       
        let payload={subject:user+password}
        let token=jwt.sign(payload,'adminKey');
        
        return res.send({mesg:token,role:'admin'});
    }
    const username= await Signupdata.findOne({email:use});
    
        if(username.password==pas){
            let payload={subject:user+password}
            let usertoken=jwt.sign(payload,'userKey');
            let name=username.name;
            return res.send({mesg:usertoken,role:'user',nam:name});
            
        }
    
  
    
    else{
        
       return res.send({mesg:"notfound"});
    }
    
}
catch(error){
    
    return res.send({mesg:"notfound"});
   }
})

//adding new post
app.post('/api/newpost',(req,res)=>{
    
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods:GET, POST, PUT,DELETE");
 
 
    var post={
        user:req.body.user,
        title:req.body.title,
        author:req.body.author,
        category:req.body.category,
        post:req.body.post,
        image:req.body.image
    }
    
    var posts=new Postdata(post)
    posts.save()
    res.send();
})
 //getting category
app.get('/api/cat',(req,res)=>{
    
    Category.find()
    .then((cats)=>{
        res.send(cats);
    })
})

//adding new category

app.post('/api/categoty',async (req,res)=>{

    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods:GET, POST, PUT,DELETE");
       try{
           
           const newcat=req.body.category;
           
           const category= await Category.findOne({category:newcat});
           
           if(category){
              return res.send({mesg:false})
           }else{

            var cat={
                category:req.body.category
                
            }
            
            var cats=new Category(cat)
            cats.save()
            return res.send({mesg:true});    
           }
           
       }catch(error){
        return res.send({mesg:false});
       }
   
    
})
//deleting category
app.delete('/api/deletecat/:id',(req,res)=>{
    id=req.params.id;
    Category.findByIdAndDelete({_id:id},{new:true, useFindAndModify:false})
    .then(()=>{
        res.send();
    })
})
//getting posts
app.get('/api/posts',(req,res)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods:GET, POST, PUT,DELETE");
  
    Postdata.find()
    .then((posts)=>{
        res.send(posts);
    })
})
//getting single post
app.get('/api/posts/:id',(req,res)=>{
    const id=req.params.id;
    
    Postdata.findOne({"_id":id})
    .then((post)=>{
        res.send(post);
    })
})
//deleting post
app.delete('/api/delete/:id',(req,res)=>{
    id=req.params.id;
    Postdata.findByIdAndDelete({_id:id},{new:true, useFindAndModify:false})
    .then(()=>{
        res.send();
    })
})
//getting post for editing
app.get('/api/edit/:id',(req,res)=>{
    const id=req.params.id;
    
    Postdata.findOne({"_id":id})
    .then((post)=>{
        res.send(post);
    })
})
//updating posts
app.put('/api/updatepost',(req,res)=>{
    id=req.body._id;
    Postdata.findByIdAndUpdate({_id:id},{$set:{
        title:req.body.title,
        author:req.body.author,
        category:req.body.category,
        post:req.body.post,
        image:req.body.image
    }},{new:true, useFindAndModify:false})
    .then(()=>{
        res.send();
    })
})
//getting controls
app.get('/api/controls',(req,res)=>{

    Controldata.findOne({name:"admin"})
    .then((control)=>{
        res.send(control)
    })
    
})
//updating controls
app.post("/api/changecontrol",verifyrootToken,(req,res)=>{
 
    id=req.body.id;
    Controldata.findByIdAndUpdate({_id:id},{$set:{
        name:req.body.name,
        edit:req.body.Cedit,
        delete:req.body.Cdelete,
        cat:req.body.Ccat,
        block:req.body.Cblock
    }},{new:true, useFindAndModify:false})
    .then(()=>{
        res.send();
    })
})
app.get('/*',function (req,res){
    res.sendFile(path.join(__dirname + '/dist/Blog/index.html'));
})
app.listen(port,()=>{console.log("server ready at "+port)})