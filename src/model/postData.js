const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@sarathfiles.1yent.mongodb.net/INTERNSHIP?retryWrites=true&w=majority',{useNewUrlParser:true, useUnifiedTopology:true});
const Schema = mongoose.Schema;
const PostSchema=new Schema({
    user:String,
    title:String,
    author:String,
    post:String,
    category:String,
    image:String
});
var Postdata=mongoose.model('postdata',PostSchema);
module.exports=Postdata;