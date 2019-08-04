const mongoose=require('mongoose');
const Schema =mongoose.Schema;

const interestSchema= new Schema({
  firstName:{type:String,required:true},
  email:{type:String,required:true},
  interestamount:{type:Number,required:true},
  date:{type:Date,default:Date.now}
});
module.exports=mongoose.model('interests',interestSchema);
