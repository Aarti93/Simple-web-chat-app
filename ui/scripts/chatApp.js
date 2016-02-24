var userId = "0", userName="";
var hostName = "http://awesomeiwn-iwnquickchat.rhcloud.com";

function registerUser () {
	userName = document.getElementById("userName").value;
	if (!userName) {
		document.getElementById("error").innerHTML = "Please enter valid name";
		document.getElementById("error").className = "error";
		return false;
	}
	var userObject = 
		{"userName": userName,
		 "aliasId": "forest"
		}
	var xmlhttp = new XMLHttpRequest();
	var url = hostName + "/chatserver/rest/service/user";
	xmlhttp.open("POST", url); 
	xmlhttp.setRequestHeader("Content-Type", 'application/json');
	xmlhttp.send(JSON.stringify(userObject));
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var response = JSON.parse(xmlhttp.responseText);
			userId = response.userId;
			userName = response.userName;

			changeDisplay(); 		  //Removing the previous display to show new one
			setInterval(getNewMessages, 1000); //Fetching data every 1sec
			return true;
		}
	};
	return true;
}

function changeDisplay () {
	document.getElementById("userName").className = "displayNone";
	document.getElementById("registerBtn").className = "displayNone";
	document.getElementById("registerPage").className = "displayNone";
	document.getElementById("msg").className = "text";
	document.getElementById("sendBtn").className = "button";
	document.getElementById("chatDiv").className = "displayChatDiv";	
}

function isEmpty( obj ) { 
  for ( var prop in obj ) { 
    return false; 
  } 
  return true; 
}

function getNewMessages () {
	var xmlhttp = new XMLHttpRequest();
	var url = hostName + "/chatserver/rest/service/chat/"+userId+"&amp;x=" + new Date();
	xmlhttp.open("GET", url, true);
	xmlhttp.send();

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		    var newMessages = xmlhttp.responseText;
		    newMessages = JSON.parse(newMessages);
		   	if(!isEmpty(newMessages)) {		       
		        for( var key in newMessages ) {
		      		addMessage(newMessages[key]);
		      		lastMsg = key;
		    	}
		    	var elem = document.getElementById('chatDiv');
  				elem.scrollTop = elem.scrollHeight;
			}
		}  
	}
}

function addMessage ( msgObject) {
	var msgDiv = document.createElement('div');
	if (msgObject.type == "SERVER") { 	//Message should display in center
		msgDiv.innerHTML =  msgObject.messageText;
		msgDiv.className = "chat centerMsg";
	}
	else {
		if (msgObject.userId == userId) {	//Message should display to the right
			msgDiv.innerHTML =  msgObject.messageText;
			msgDiv.className = "chat rightMsg bubble";
		}
		else {	//Message should display to the left with the name
			msgDiv.innerHTML =  msgObject.userName + ": " + msgObject.messageText;
			msgDiv.className = "chat leftMsg bubble";	
		}

	}
	var chatDiv = document.getElementById('chatDiv');
	chatDiv.appendChild(msgDiv);
}

function sendMsgToServer () {
	var message = document.getElementById('msg').value;
	if(message) { 
		var userMessage = 
			    {
			     "messageText": message, 
				 "userId": userId,
				 "userName": userName	
				}
		var xmlhttp = new XMLHttpRequest();
		var url = hostName + "/chatserver/rest/service/chat";
		//var url = "http://localhost:8080/chatserver/rest/service/chat"
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			  return true;
			}
			else {
				console.log ("Unable to send message to server");
			}
		};
		xmlhttp.open("POST", url); 
		xmlhttp.setRequestHeader("Content-Type", 'application/json');
		xmlhttp.send(JSON.stringify(userMessage));
		//clear the text box
		document.getElementById("msg").value = "";

	}
}

function keyPress(e)
{
    e = e || window.event;
    if (e.keyCode == 13) //Pressing enter
    {
    	if(e.target.id == "msg") {
        	document.getElementById('sendBtn').click();
       	}
       	else if (e.target.id == "userName") {
        	document.getElementById('registerBtn').click();
       	}
       	return false;
    }
    return true;
}




