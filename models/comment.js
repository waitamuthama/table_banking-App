const mongoose=require('mongoose');
const Schema =mongoose.Schema;

const commentSchema=new Schema({
  title:{type:String,required:true},
  message:{type:String,required:true},
  user:{type: String, required:true },
  firstName:{type:String,required:true},
  lastName:{type:String,required:true},
  image:{type:String},
  reply:[{
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    date:{type:Date,default:Date.now},
    replyMessage:{type:String,required:true}
  }],
  date:{type:Date,default:Date.now}
});

module.exports=mongoose.model('comments',commentSchema);
