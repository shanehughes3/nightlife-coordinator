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
