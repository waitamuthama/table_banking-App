const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const AccountSchema= new Schema({
//  regno:{type:String ,required:true},
  name:{type:String ,required:true},
  email:{type:String ,required:true},
  phone:{type:Number,required:true},
  amount:{type:Number,default:''},
  //loanamount:{type:Number,default:'0'},
  //interest:{type:Number,default:'0'},
  //loanbal:{type:Number,default:'0000.00'},
  //account:{type:Number,default:'0000000'},
  user:{type: String, required:true },
  date:{type:Date,default:Date.now}
});
module.exports=mongoose.model('accounts',AccountSchema);
