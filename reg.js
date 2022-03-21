const express = require('express')
const app = express()
const port = 3000
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", 'http://localhost:8088');
  var allowedOrigins = ['http://localhost:8088','http://localhost:4200'];
  var origin         = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, x-parse-application-id,x-parse-rest-api-id,x-parse-rest-api-key, X-Requested-With,Authorization, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
 
  next(); 
});

app.get('/getEmployee', (req, res) => { 
    console.log("entered the client request")  
  MongoClient.connect(url, function(err, db) {
     if (err) throw err;
        var dbo = db.db("sbi_data")      
        dbo.collection("emp_dashboard").find({}).toArray(function(err, result) {  
           if (err) throw err;
           console.log(result)
          db.close();
         res.send({status:"success",message:"response sent successfully",result:result})
    });
});
   })


app.post('/createEmployee', (req, res) => { 
    console.log("entered the client request",req.body.empid)  
  MongoClient.connect(url, function(err, db) {
     if (err) throw err;
        var dbo = db.db("sbi_data")      
         dbo.collection("emp_dashboard").insertOne(req.body, function(err, resss) {   
           if (err) throw err;
          db.close();
          res.send({status:"success",message:"response sent successfully"})
         });
       });
   })

   app.post('/updateEmployee', (req, res) => { 
      console.log("entered the client request",req.body.empid)  
    MongoClient.connect(url, function(err, db) {
       if (err) throw err;
          var dbo = db.db("sbi_data")      
          var myquery={empid:""}
            var newvalues={$set:{empid:req.body.empid,name:req.body.name,xyz:req.body.xyz,salary:req.body.salary,
            email:req.body.email,ph_no:req.body.ph_no,abc:req.body.abc,pra:req.body.pra,qualificarion:req.body.qualificarion}};
            dbo.collection("emp_dashboard").updateOne(myquery,newvalues,function(err,resss){  
             if (err) throw err;
            db.close();
            res.send({status:"success",message:"response sent successfully"})
           });
         });
     })
  

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })  