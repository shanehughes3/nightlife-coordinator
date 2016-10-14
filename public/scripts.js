
// SETUP

var $ = document.getElementById.bind(document);
var globalUsername = null;

document.addEventListener("DOMContentLoaded", setup);

function setup() {
    bindButtons();
    if ($("greeting").innerHTML != "") {
	globalUsername = $("greeting").innerHTML;
    }
}

function bindButtons() {
    $("search-button").onclick = handleQueryClick;
    $("login-view-button").onclick = () => {showDialog("login-dialog");};
    $("login-close-button").onclick = () => {closeDialog("login-dialog");};
    $("login-submit-button").onclick = submitLogin;
    $("register-submit-button").onclick = handleRegisterClick;
    $("logout-button").onclick = logOut;
}

// SEARCH/DISPLAY RESULTS

function handleQueryClick() {
    if ($("search-term").value === "") {
	$("message").innerHTML = "You must enter a search location";
    } else {
	$("message").innerHTML = "";
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
    console.log(results); //////////////////
    var bars = results.businesses;
    var container = $("results");
    
    for (var i = 0; i < 15; i++) {
	var div = createResultElement(bars[i]);
	container.appendChild(div);
    }
}

function createResultElement(result) {
    var div = document.createElement("div");
    div.setAttribute("class", "result");
    var imGoingDisplay = (window.globalUsername) ? 
	'style="display:inline-block"' :
	'style="display:none"';
    
    div.innerHTML =
	'<a href="' + result.url + '">' +
	  '<div class="result-thumbnail">' +
	    '<img src="' + result.image_url + '"></div>' +
	  '<div class="result-details">' +
	    '<div class="result-name">' + result.name + '</div>' +
	    '<div class="result-rating">' +
	      '<img src="' + result.rating_img_url_small + '"></div>' +
	    '<div class="result-text">' + result.snippet_text + '</div>' +
	  '</div>' +
	'</a>' +
	'<div class="im-going-button" ' + imGoingDisplay +
	  ' onclick="setGoing(\'' + result.id + '\')">' + 'I\'m going!</div>' +
	'<div class="result-going">' + result.going + ' Going</div>';

    return div;
}

function displayError(err) {
    $("message").innerHTML = err;
}

// SET "GOING"

function setGoing(yelpId) {
    if (window.globalUsername) {
	var xhr = new XMLHttpRequest;
	var payload = {
	    yelpId: yelpId
	};
	xhr.addEventListener("load", () =>
			     handleGoingResponse(xhr.responseText));
	xhr.addEventListener("error", handleGoingError);
	xhr.addEventListener("abort", handleGoingError);
	xhr.open("POST", "/going");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify(payload));
    } else {
	// TODO "you must be logged in" dialog
    }
}

function handleGoingResponse(response) {
    
}

function handleGoingError() {
    // TODO
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
    $("login-message").innerHTML = "";
    $("register-message").innerHTML = "";
}

// LOGIN

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
    $("login-message").innerHTML = "Logging in...";
}

function handleLoginResponse(response) {
    response = JSON.parse(response);
    console.log(response); /////////////
    $("login-message").innerHTML = "Success!";
    setElementsLogIn(response.username);
    window.setTimeout(closeDialog, 1000, "login-dialog");
}

function handleLoginError(err) {
    console.log(err);
}

function setElementsLogIn(username) {
    $("greeting").innerHTML = username;
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
	$("register-message").innerHTML = "All forms must be completed";
	return false;
    } else if ($("register-password").value !==
	       $("register-verify-password").value) {
	$("register-message").innerHTML = "Passwords do not match";
	return false;
    } else if ($("register-password").value.length < 8) {
	$("register-message").innerHTML = "Password must be at least " +
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
    $("greeting").innerHTML = "";
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
