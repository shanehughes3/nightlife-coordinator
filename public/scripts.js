
// SETUP

var $ = document.getElementById.bind(document);

document.addEventListener("DOMContentLoaded", bindButtons);

function bindButtons() {
    $("search-button").onclick = submitQuery;
    $("login-view-button").onclick = () => {showDialog("login-dialog");};
    $("login-close-button").onclick = () => {closeDialog("login-dialog");};
    $("login-submit-button").onclick = submitLogin;
    $("register-submit-button").onclick = handleRegisterClick;
}

// SEARCH/DISPLAY RESULTS

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
    
    for (var i = 0; i < 15; i++) {
	var div = createResultElement(bars[i]);
	container.appendChild(div);
    }
}

function createResultElement(result) {
    var div = document.createElement("div");
    div.setAttribute("class", "result");
    div.innerHTML = '<a href="' + result.url + '">' +
	'<div class="result-thumbnail">' +
	'<img src="' + result.image_url + '"></div>' +
	'<div class="result-details">' +
	'<div class="result-name">' + result.name + '</div>' +
	'<div class="result-rating">' +
	'<img src="' + result.rating_img_url_small + '"></div>' +
	'<div class="result-text">' + result.snippet_text + '</div>' +
	'</div>' +
	'</a>';
    return div;
}

function displayError(err) {
    $("message").innerHTML = err;
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
    var params = {
	username: $("login-username").value,
	password: $("login-password").value
    };
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", handleLoginResponse);
    xhr.addEventListener("error", handleLoginError);
    xhr.addEventListener("abort", handleLoginError);
    xhr.open("POST", "/login");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(params));
}

function handleLoginResponse(response) {
    console.log(response);
}

function handleLoginError(err) {
    console.log(err);
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
