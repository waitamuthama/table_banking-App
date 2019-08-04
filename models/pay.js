const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const PaySchema=new Schema({
  phone:{type:Number,required:true},
  fname:{type:String,required:true},
  email:{type:String,required:true},
  amount:{type:Number,required:true},
  user:{type: String, required:true },
  date:{type:Date,default:Date.now}
});
module.exports=mongoose.model('pay',PaySchema);
