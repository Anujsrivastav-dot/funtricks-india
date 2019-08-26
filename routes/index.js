var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/database');
var db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",function(callback){
  console.log("connection created");
});


var Schema = mongoose.Schema;
var userdata = new Schema({
  
  firstname: {type:String , required:true},
  lastname:{type:String, required:true},
  profile:{type:String,required:true}
},{collection: 'colllect'});

var data = mongoose.model('colllect',userdata);


router.get('/', function(req, res, next) {
 
  res.render("index") 
});
router.get('/get-data', (req,res)=> {
  
  data.find()
  .then(function(doc)
  {
    res.render('index',{items:doc});
  });
  });

  





/* GET home page. */
router.post('/insert', function(req, res, next) {
 
  
  var user = new data({
    
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    profile: req.body.profile
  });
  user.save();
  console.log("data inserted");
  
  res.redirect('/');
  
 
  
});
router.post("/update",function(req,res,next){
  
  var id = req.body.id;
  
  
  data.findById(id,function(err,doc)
  {
    if(err) {
      console.err("err");

    }
doc.firstname = req.body.firstname;
doc.lastname =req.body.lastname;
doc.profile =req.body.profile;
doc.save();
  });
  res.redirect("/");
});
  
  

router.post('/login',function(req,res){
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  data.findOne({firstname: firstname,lastname: lastname} ,function(err,data)
  {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    if (!data) {
      return res.status(404).send(" Data not found");
      
    }
    return res.status(200).send("welcome your login page" + " " + req.body.firstname+" "+ req.body.lastname +" "+ " your profile is" +" "+ data.profile +" "+"your ID is" +" " + data.id);
  });

});
router.post("/delete",function(req,res,next)
{
  var id = req.body.id;
  data.findByIdAndRemove(id).exec();
  res.redirect("/");
});


  


module.exports = router;
