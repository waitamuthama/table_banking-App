
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const USerSchema= new Schema({
  // regno:{type:String ,required:true},
  // name:{type:String ,required:true},
  // email:{type:String ,required:true},
  // phone:{type:Number,required:true},
  // account:{type:Number,default:'0000'},
  amount:{type:Number,default:'0'},
  // location:{type:String,required:true},
  // password:{type:String ,required:true},
  loanamount:{type:Number,default:'0'},
  interest:{type:Number,default:'0'},
  status:{type:Boolean,default:'1'},
  intereststatus:{type:Boolean ,default:'0'},
  issue:[{
    amount:{type:Number,default:'500'}
  }],
  issuedate:{type:Date},
  paydate:{type:Date},
  googleID:{type:String},
  email:{type:String,required:true},
  firstName:{type:String},
  lastName:{type:String},
  phone:{type:Number,default:'0700000000'},
  about:{type:'String',default:'Hello there !....Am now your fellow member. One step ahead financialy'},
  location:{type:String,default:'not available'},
  image:{type:String,default:'0a46e144ebde2948ec06d581919f4050'},
  usertype:{type:String,default:'member'},
  password:{type:String},
  date:{type:Date,default:Date.now}
});

mongoose.model('users',USerSchema);
