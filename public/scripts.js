
// SETUP

var $ = document.getElementById.bind(document);
var globalUsername = null;

document.addEventListener("DOMContentLoaded", setup);

function setup() {
    bindButtons();
    if ($("greeting").textContent != "") {
	globalUsername = $("greeting").textContent;
    }
}

function bindButtons() {
    var dialogs = ["login-dialog", "message-dialog"];
    
    $("search-button").onclick = handleQueryClick;
    $("login-view-button").onclick = () => {showDialog("login-dialog");};
    $("login-close-button").onclick = () => {closeDialog("login-dialog");};
    dialogs.forEach(function(dialog) {
	$(dialog).onclick = function(e) {
	    // close when clicking outside window
	    if (e.target == this) {
		closeDialog(dialog);
	    }
	}
    });
    $("message-close-button").onclick = () => {closeDialog("message-dialog");};
    $("login-submit-button").onclick = handleLoginClick;
    $("register-submit-button").onclick = handleRegisterClick;
    $("logout-button").onclick = logOut;
}

// SEARCH/DISPLAY RESULTS

function handleQueryClick() {
    if ($("search-term").value === "") {
	$("message").textContent = "You must enter a search location";
	showDialog("message-dialog");
    } else {
	$("message").textContent = "";
	submitQuery();
    }
}

function submitQuery() {
    var xhr = new XMLHttpRequest();
    var term = $("search-term").value;
    xhr.addEventListener("load", () => displayResults(xhr.responseText));
    xhr.addEventListener("error", yelpDataError);
    xhr.addEventListener("abort", yelpDataError);
    xhr.open("GET", "/search?location=" + term);
    xhr.send(null);
}

function yelpDataError() {
    displayError("Error connecting to server");
}

function displayResults(response) {
    results = JSON.parse(response);
    var bars = results.businesses;
    var container = $("results");

    bars.forEach(function(bar) {
	var ThisBar = new BarResult(bar);
	container.appendChild(ThisBar.createElement());
    });
}

function BarResult(barData) {
    var self = this;

    this.numberGoing = barData.going;
    this.yelpId = barData.id

    this.createElement = function() {
	var div = document.createElement("div");
	div.setAttribute("class", "result");
	div.setAttribute("id", "result-" + self.yelpId);

	div.appendChild(createElementStaticData());
	div.appendChild(createElementGoingButton());
	div.appendChild(createElementNotGoingButton());
	div.appendChild(createElementNumberGoing());

	return div;
    }

    function createElementStaticData() {
	var node = document.createElement("a");
	node.setAttribute("href", barData.url);
	node.innerHTML =
	    '<div class="result-thumbnail">' +
	      '<img src="' + barData.image_url + '"></div>' +
	    '<div class="result-details">' +
	      '<div class="result-name">' + barData.name + '</div>' +
	      '<div class="result-rating">' +
	        '<img src="' + barData.rating_img_url_small + '"></div>' +
	      '<div class="result-text">' + barData.snippet_text + '</div>' +
	    '</div>';
	return node;
    }

    function createElementGoingButton() {
	var div = document.createElement("div");
	div.setAttribute("class", "im-going-button");
	div.style.display = (window.globalUsername) ?
	    "inline-block" : "none";
	div.addEventListener("click", self.setGoing);
	div.textContent = "I\'m going!";
	return div;
    }
    
    function createElementNotGoingButton() {
	var div = document.createElement("div");
	div.setAttribute("class", "not-going-button");
	div.onclick = self.handleNotGoingClick;
	div.style.display = "none";
	div.textContent = "Not going";
	return div;
    }
    
    function createElementNumberGoing() {
	var div = document.createElement("div");
	div.setAttribute("class", "result-going");
	div.textContent = self.numberGoing + " Going";
	return div;
    }
    
    this.setGoing = function() {
	if (window.globalUsername) {
	    var xhr = new XMLHttpRequest;
	    var payload = {
		yelpId: self.yelpId
	    };
	    xhr.addEventListener("load", () =>
			     handleGoingResponse(xhr.responseText));
	    xhr.addEventListener("error", handleGoingError);
	    xhr.addEventListener("abort", handleGoingError);
	    xhr.open("POST", "/going");
	    xhr.setRequestHeader("Content-Type", "application/json");
	    xhr.send(JSON.stringify(payload));
	} else {
	    displayError("You must be logged in to do that");
	}
    }

    function handleGoingResponse(response) {
	response = JSON.parse(response);
	if (response.success && response.id == self.yelpId) {
	    self.numberGoing++;
	    setImGoingElements();
	} else {
	    displayError("Sorry, an error occurred");
	}
    }

    function handleGoingError() {
	displayError("Sorry, an unknown error occurred");
    }

    function setImGoingElements() {
	var parent = $("result-" + self.yelpId);
	parent.getElementsByClassName("not-going-button")[0]
	    .style.display = "inline-block";
	parent.getElementsByClassName("im-going-button")[0]
	    .style.display = "none";
	parent.getElementsByClassName("result-going")[0].remove();
	parent.appendChild(createElementNumberGoing());
    }

    this.handleNotGoingClick = function() {
	if (window.globalUsername) {
	    var xhr = new XMLHttpRequest;
	    var payload = {
		yelpId: self.yelpId
	    };
	    xhr.addEventListener("load", () =>
				 handleNotGoingResponse(xhr.responseText));
	    xhr.addEventListener("error", handleGoingError);
	    xhr.addEventListener("abort", handleGoingError);
	    xhr.open("POST", "/notgoing");
	    xhr.setRequestHeader("Content-Type", "application/json");
	    xhr.send(JSON.stringify(payload));
	} else {
	    displayError("You must be logged in to do that");
	}
    }

    function handleNotGoingResponse(response) {
	response = JSON.parse(response);
	if (response.success && response.id == self.yelpId) {
	    self.numberGoing--;
	    setNotGoingElements();
	} else {
	    displayError("Sorry, an error occurred");
	}
    }

    function setNotGoingElements() {
	var parent = $("result-" + self.yelpId);
	parent.getElementsByClassName("im-going-button")[0]
	    .style.display = "inline-block";
	parent.getElementsByClassName("not-going-button")[0]
	    .style.display = "none";
	parent.getElementsByClassName("result-going")[0].remove();
	parent.appendChild(createElementNumberGoing());	
    }
    
}

function displayError(err) {
    $("message").textContent = err;
    showDialog("message-dialog");
    // TODO - specific errors per api
}



// MODAL DIALOG

function showDialog(dialog) {
    $(dialog).style.opacity = 1;
    $(dialog).style.pointerEvents = "auto";
}

function closeDialog(dialog) {
    $(dialog).style.opacity = 0;
    $(dialog).style.pointerEvents = "none";
}

function clearFormMessages() {
    $("login-message").textContent = "";
    $("register-message").textContent = "";
}

// LOGIN

function handleLoginClick() {
    if (checkLoginForm()) {
	submitLogin();
    }
}

function checkLoginForm() {
    if ($("login-username").value === "" ||
	$("login-password").value === "") {
	$("login-message").textContent = "All fields must be completed";
	return false;
    } else {
	return true;
    }
}

function submitLogin() {
    clearFormMessages();
    var payload = {
	username: $("login-username").value,
	password: $("login-password").value
    };
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => handleLoginResponse(xhr.responseText));
    xhr.addEventListener("error", handleLoginError);
    xhr.addEventListener("abort", handleLoginError);
    xhr.open("POST", "/login");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(payload));
    $("login-message").textContent = "Logging in...";
}

function handleLoginResponse(response) {
    response = JSON.parse(response);
    if (response.error) {
	$("login-message").textContent = response.error;
    } else {
	$("login-message").textContent = "Success!";
	setElementsLogIn(response.username);
	window.setTimeout(closeDialog, 1000, "login-dialog");
    }
}

function handleLoginError(err) {
    $("login-message").textContent = "Sorry, an unknown error occurred";
}

function setElementsLogIn(username) {
    $("greeting").textContent = username;
    window.globalUsername = username;
    $("greeting").style.display = "inline-block";
    $("login-view-button").style.display = "none";
    $("logout-button").style.display = "inline-block";
    var goingButtons = document.getElementsByClassName("im-going-button");
    for (var i = 0; i < goingButtons.length; i++) {
	goingButtons[i].style.display = "inline-block";
    }
}

// REGISTER

function handleRegisterClick() {
    clearFormMessages();
    if (checkRegisterForm()) {
	submitRegister();
    }
}

function checkRegisterForm() {
    if ($("register-username").value === "" ||
	$("register-password").value === "") {
	$("register-message").textContent = "All fields must be completed";
	return false;
    } else if ($("register-password").value !==
	       $("register-verify-password").value) {
	$("register-message").textContent = "Passwords do not match";
	return false;
    } else if ($("register-password").value.length < 8) {
	$("register-message").textContent = "Password must be at least " +
	    "8 characters";
    } else {
	return true;
    }
}

function submitRegister() {
    var params = {
	username: $("register-username").value,
	password: $("register-password").value
    };
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", handleRegisterResponse);
    xhr.addEventListener("error", handleRegisterError);
    xhr.addEventListener("abort", handleRegisterError);
    xhr.open("POST", "/register");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(params));
}

function handleRegisterResponse(response) {
    console.log(response);
}

function handleRegisterError(err) {
    console.log(err);
}

// LOG OUT

function logOut() {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => handleLogoutSuccess(xhr.responseText));
    xhr.addEventListener("error", handleLogoutError);
    xhr.addEventListener("abort", handleLogoutError);
    xhr.open("GET", "/logout");
    xhr.send(null);
}

function handleLogoutSuccess(response) {
    response = JSON.parse(response);
    if (response.success) {
	setElementsLogOut();
    } else {
	// TODO
    }
}

function setElementsLogOut() {
    $("greeting").style.display = "none";
    $("greeting").textContent = "";
    window.globalUsername = undefined;
    $("login-view-button").style.display = "inline-block";
    $("logout-button").style.display = "none";
    var goingButtons = document.getElementsByClassName("im-going-button");
    for (var i = 0; i < goingButtons.length; i++) {
	goingButtons[i].style.display = "none";
    }
}

function handleLogoutError() {
    // TODO
}
