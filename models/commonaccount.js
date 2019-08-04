const  mongoose=require('mongoose');
const Schema=mongoose.Schema;

const CommonSchema= new Schema({
  amount:{type:Number,default:'0'}
});

module.exports = mongoose.model('common',CommonSchema);
