document.addEventListener("DOMContentLoaded", bindButtons);

var $ = document.getElementById.bind(document);

function bindButtons() {
    $("search-button").onclick = submitQuery;
}

function submitQuery() {
    var xhr = new XMLHttpRequest();
    var term = $("search-term").value;
    xhr.open("GET", "/search?location=" + term);
    xhr.send(null);

    xhr.onreadystatechange = function() {
	if (xhr.readyState == 4) {
	    if (xhr.status == 200) {
		displayResults(xhr.responseText);
	    } else {
		displayError("Error connecting to server");
	    }
	}
    }
}

function displayResults(results) {
    results = JSON.parse(results);
    var bars = results.businesses;
    var container = $("results");
    
    for (var i = 0; i < 15; i++) {
	var div = document.createElement("div");
	var text = document.createTextNode(bars[i].name);
	div.appendChild(text);
	container.appendChild(div);
    }
}

function displayError(err) {
    $("message").innerHTML = err;
}
