const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@sarathfiles.1yent.mongodb.net/INTERNSHIP?retryWrites=true&w=majority',{useNewUrlParser:true, useUnifiedTopology:true});
const Schema = mongoose.Schema;
const catSchema=new Schema({
   category:String
});
var Category=mongoose.model('category',catSchema);
module.exports=Category;