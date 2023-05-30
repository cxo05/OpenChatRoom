console.log("Started");
require('string.prototype.endswith');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var people = {};
var address = {};
var peoplecount = 0;

app.route("/").get(function(req,res,next){
	res.sendFile(__dirname+"/HTML.html");
});
app.route("/Script.js").get(function(req,res,next){
	res.sendFile(__dirname+"/Script.js");
});
app.route("/Css.css").get(function(req,res,next){
	res.sendFile(__dirname+"/Css.css");
});
app.route("/animate.css").get(function(req,res,next){
	res.sendFile(__dirname+"/animate.css");
});
app.route("/nevis.ttf").get(function(req,res,next){
	res.sendFile(__dirname+"/nevis.ttf");
});
app.route("/Roboto-Light.ttf").get(function(req,res,next){
	res.sendFile(__dirname+"/Roboto-Light.ttf");
});
app.route("/Cover.jpg").get(function(req,res,next){
	res.sendFile(__dirname+"/Cover.jpg");
});
app.route("/arrow").get(function(req,res,next){
	res.sendFile(__dirname+"/monotone_arrow_right.png");
});

io.sockets.on("connection", function (client) {
	var joined = false;
	var superuser = false;
	address[client.id] = client.request.headers['x-forwarded-for'] || client.request.connection.remoteAddress;
	console.log('New connection from '+ address[client.id]);
  
	client.on("join", function(name){
		var regex = /(<([^>]+)>)/ig;
		var regex1 = /\bfuck\b/i;
		var regex2 = /^\s+|\s+$/g;
		var result = name.replace(regex, "");
		var result1 = result.replace(regex1, "****");
		var result2 = result1.replace(regex2,"");
		result2 = result2.substr(0,15);
		if(result2.endsWith('@su')){
			superuser = true;
			console.log("Superuser");
		}
		people[client.id] = result2;
		peoplecount++;
		client.emit("update", "You have connected to the server.");
		io.sockets.emit("update", result2 + " has joined the server.");
 		io.sockets.emit("update-people", people, peoplecount, address);
		joined = true;
	});
	
	client.on("typing",function(isTyping){
		if(isTyping){
			io.sockets.emit("Type",people[client.id]);
		}
	});
	
  client.on("send", function(msg){
		if(msg == ""){
			return;
		}else{
			msg = msg.substr(0,100);
      io.sockets.emit("chat", people[client.id], msg);
		}
	});
	
  client.on("disconnect", function(){
		if(joined == true){
  		io.sockets.emit("update", people[client.id] + " has left the server.");
      delete people[client.id];
			peoplecount--;
      io.sockets.emit("update-people", people, peoplecount,address);
		}else{
			return;
		}
  });
});

http.listen(8888, function(){
	console.log('listening on port 8888');
});