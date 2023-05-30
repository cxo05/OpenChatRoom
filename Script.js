$(function(){
	var socket = io();
	var BadVar = false;
	$("#arrow").click(function(){
		if(BadVar==false){
			$("#people").hide();
			$("#arrow").removeClass('Rotate-90');
			$("#arrow").addClass('Rotate90');
			BadVar=true;
		}else{
			$("#people").show();
			$("#arrow").addClass('Rotate-90');
			$("#arrow").removeClass('Rotate90');
			BadVar=false;
		}
	});
	$("#chat").hide();
	$("#main").hide();
	$("#name").focus();
	$("form").submit(function(event){
		event.preventDefault();
	});
 	$("#join").click(function(){
		var name = $("#name").val();
		var regex2 = /^\s+|\s+$/g;
		var regex = /(<([^>]+)>)/ig;
		var result = name.replace(regex, "");
		var result2 = result.replace(regex2,"");
		if (result2 != "") {
			socket.emit("join", name);
			$("#login form").addClass('animated fadeOutUp');
			$("#login form").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
				function (){
					$("#login form").removeClass('animated fadeOutUp'); 
					$("#login").detach(); 
					$("#chat").show();
					$("#main").show();
					$("#msg").focus();
				}
			);
		}
	});

	$("#name").keypress(function(e){
		if(e.which == 13) {
			var name = $("#name").val();
			var regex2 = /^\s+|\s+$/g;
			var regex = /(<([^>]+)>)/ig;
			var result = name.replace(regex, "");
			var result2 = result.replace(regex2,"");
			if (result2 != "") {
				socket.emit("join", name);
				$("#login form").addClass('animated fadeOutUp');
				$("#login form").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
					function (){
						$("#login form").removeClass('animated fadeOutUp'); 
						$("#login").detach(); 
						$("#chat").show();
						$("#main").show();
						$("#msg").focus();
					}
				);
			}
		}
	});

	socket.on("update", function(msg) {
		$(".container").append($('<p id="Gone">').text(msg));
	});

	socket.on("update-people", function(people, peoplecount, address){
		$("#people").empty();
		$.each(people,function(clientid, name) {
			$('#people').append($('<li id="names">').text(name + " : " + address[clientid]));
		});
		$("#peoplecount").text(peoplecount);
	});

	socket.on("chat", function(who, msg){
		var $cont = $('.container');
		$cont.append($('<p id:"messages">').text(who + " : " + msg)); 	
		$cont[0].scrollTop = $cont[0].scrollHeight;  
	});
	
	socket.on("Type", function(who){
		$("#typing").text("  " + who + " is typing.");
	});

	socket.on("disconnect", function(){
		$(".container").append($('<p id:"Gone">').text("The server is unavailable."));
		$("#msg").attr("disabled", "disabled");
		$("#send").attr("disabled", "disabled");
	});
		
	$('#msg').on('input', function() {
		var isTyping = true;
		socket.emit("typing",isTyping);
	});
		
	$("#send").click(function(){
		var msg = $("#msg").val();
		var regex2 = /^\s+|\s+$/g;
		var result2 = msg.replace(regex2,"");
		if (result2 != ""){
			socket.emit("send", msg);
			$("#msg").val("");
		}
	});

	$("#msg").keypress(function(e){
		if(e.which == 13) {
			var msg = $("#msg").val();
			var regex2 = /^\s+|\s+$/g;
			var result2 = msg.replace(regex2,"");
			if (result2 != ""){
				socket.emit("send", msg);
				$("#msg").val("");
			}
		}
	});
});