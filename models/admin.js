const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const adminSchema = new Schema({
  registerModule:{type:Boolean,default:'0'},
  loanreqsModule:{type:Boolean,default:'0'}
});
module.exports=mongoose.model('openregistration',adminSchema);
