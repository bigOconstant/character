var bodyParser = require('body-parser');
var path = require('path');
var express = require('express'),

    app = express(),
   //  bodyParser = require('body-parser');
    crypto = require('crypto'),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient;
    assert = require('assert');
 // app.use(express.bodyParser()); 
app.use(bodyParser.urlencoded());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + '/public'));
app.use('/lib',express.static(path.join(__dirname, 'public/lib')));
app.use('/js',express.static(path.join(__dirname, 'public/js')));
app.use('/css',express.static(path.join(__dirname, 'public/css')));


app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + "/views");

MongoClient.connect("mongodb://localhost:27017/PATHFINDER", function(err, db) {

    if(err) throw err;

    console.log("Successfully connected to MongoDB.");

    app.get('/', function(req, res) {
	
	
            return res.render('hello', { });
	
       
    });
   

    function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render('error_template', { error: err });
}
    var userLoggedIn = {username:"",password:"",description:""};


    app.post('/Login', function(req, res, next) {
    console.log("Logging in!");
   // console.log(req);

     userLoggedIn.username = req.body.username;
     userLoggedIn.password = req.body.password;
    console.log("Username = "+userLoggedIn.username);
    console.log("Password = "+userLoggedIn.password);
    if(userLoggedIn.username != null && userLoggedIn.username != "" && userLoggedIn.password != null && userLoggedIn.password != ""){
	 db.collection('users').find({user:userLoggedIn.username}).toArray(function(err, docs) {
		
			if(err) throw err;
	
			if(docs.length < 1){
				console.log("No documents found. Wrong username?");
				res.send("No username found");
			}
			var user = docs[0];
			if(user.password != userLoggedIn.password){
				console.log("Incorrect password");
				res.send("Ooop! wrong password");
			}
			else if(user.password == userLoggedIn.password){
            userLoggedIn.description = user.character.backstory;
            console.log("Login description below");
            console.log(userLoggedIn.description);
			console.log("Correct Password!");
			//res.send("<p>username: "+user.user+"</p><br> <p>description:"+user.character.backstory);
			res.render('userHome',{"username":user.user,"description":user.character.backstory});
			}


		}
	)

    }
    else{
        res.send("No documents found. Did you forget Something?");
    }
  
      //  res.send("Made it to far");
    
});

    app.post('/saveDiscription', function(req, res, next) {
        console.log("Save description started");
        userLoggedIn.description = req.body.description;
        console.log("Description below");
        console.log(userLoggedIn.description);
        db.collection('users').updateOne(
            {"user":userLoggedIn.username},
            {$set:{"character.backstory":userLoggedIn.description}},
            function(err,results){
                console.log("Somthing probably went wrong");
               // callback();

            });
        console.log(userLoggedIn.description);


        res.send("Hello World");

    });


    app.use(function(req, res){
        res.sendStatus(404);
    });

    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log("Express server listening on port %s.", port);
    });
});
