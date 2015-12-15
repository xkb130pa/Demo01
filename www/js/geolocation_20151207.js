var ScanCallback = function() {


	var success = function(pos) { 
		jQuery.support.cors = true;
		jQuery.ajaxSetup({ async: false });

		var code = $("#Code").val();
		var latitude = pos.coords.latitude;
		var longitude = pos.coords.longitude;
		var accuracy = pos.coords.accuracy;
		var altitude = pos.coords.altitude;
		var timestamp = new Date(pos.timestamp);
		
		$("#Status").html("Coordinates retrieved...");

		$("#ResponseBlock").css("visibility","visible");		
		$("#Latitude").html(Math.round(1000*latitude)/1000);
		$("#Longitude").html(Math.round(1000*longitude)/1000);
		$("#Accuracy").html(accuracy);
			
		// Compose the data feed URL
		var URL = 'http://proximityscanner.com/Functions.svc/GetFunctionResponseList' +
			'?Code=' + code +
			'&Latitude=' +  latitude +
			'&Longitude=' + longitude;

		// Query the data and populate the table
		$.getJSON(URL)
			.done(function (data) {
				var response = data.CheckLocation;
				$("#Status").html(response);
				$("#Response").html("There are no Cortese sites with 1000ft");
			})
			.fail(function (jqxhr, textStatus, error) {
				//var err = textStatus + ", " + error;
				$("#Status").html(error)
        });

		// http://maps.googleapis.com/maps/api/staticmap?center=41.164664,-81.44596&zoom=13&size=270x210&maptype=satellite&markers=color:green%7C41.164664,-81.44596&key=AIzaSyARWwL4grkK_PgfLZg904DRNwfXmW0G_ks
		/*
		var map = $("#map");
		//map.css("display","block");
		var mapwidth = 270; 
		var mapheight = 210; 
		var key = "AIzaSyARWwL4grkK_PgfLZg904DRNwfXmW0G_ks";
		map.src = 
		 "http://maps.googleapis.com/maps/api/staticmap?center=" + 
		 pos.coords.latitude + "," + pos.coords.longitude + 
		 "&zoom=13&size=" + mapwidth + "x" + mapheight + "&maptype=satellite&markers=color:green%7C" +
		 pos.coords.latitude + "," + pos.coords.longitude  +
		 "&key=" + key;
	};
*/
	var fail = function(error) {
		$("#Status").html("Error getting geolocation: code=" + error.code + " message=" + error.message);
	};

	//map.css("display","none");
	$("#Status").html("Retrieving Geolocation from your device...");
	navigator.geolocation.getCurrentPosition(success, fail);
};


/*


// api-geolocation Watch Position
var watchID = null; 
function clearWatch() { 

	if (watchID !== null) {

		navigator.geolocation.clearWatch(watchID);
		watchID = 
		null;

		document.getElementById('cur_position').innerHTML = "";
		document.getElementById('map').style.display = 'none';

	}
}
var wsuccess = function(pos) { 

	var map = document.getElementById('map');
	map.style.display = 'block';
	var mapwidth = 270; 
	var mapheight = 210; 
	var key = "AIzaSyARWwL4grkK_PgfLZg904DRNwfXmW0G_ks";
	map.src = 
	"http://maps.googleapis.com/maps/api/staticmap?center=" + 
	pos.coords.latitude + "," + pos.coords.longitude + 
	"&zoom=13&size=" + mapwidth + "x" + mapheight + "&maptype=satellite&markers=color:green%7C" +
	pos.coords.latitude + "," + pos.coords.longitude +
	"&key=" + key;

};

var wfail = function(error) { 
	document.getElementById('cur_position').innerHTML = "Error getting geolocation: " + error.code;
	console.log("Error getting geolocation: code=" + error.code + " message=" + error.message);
};


var toggleWatchPosition = function() { 

	if (watchID) {
		console.log("Stopped watching position");
		clearWatch(); 
		// sets watchID = null; 
	} 
	else { 

		document.getElementById('map').style.display = 'none';
		document.getElementById('cur_position').innerHTML = "Watching geolocation . . .";
		console.log("Watching geolocation . . .");
		var options = { frequency: 3000, maximumAge: 5000, timeout: 5000, enableHighAccuracy: true };
		watchID = navigator.geolocation.watchPosition(wsuccess, wfail, options);
	}
};
*/