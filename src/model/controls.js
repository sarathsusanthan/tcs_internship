const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@sarathfiles.1yent.mongodb.net/INTERNSHIP?retryWrites=true&w=majority',{useNewUrlParser:true, useUnifiedTopology:true});

const Schema = mongoose.Schema;
const controlSchema=new Schema({
    name:String,
    edit:Boolean,
    delete:Boolean,
    cat:Boolean,
    block:Boolean
});
var Controldata=mongoose.model('control',controlSchema);
module.exports=Controldata;