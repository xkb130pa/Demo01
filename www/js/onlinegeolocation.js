var disclaimerShown;
var latitude;
var longitude;

var ScanCallback = function() {

	var success = function(pos) { 
		jQuery.support.cors = true;
		jQuery.ajaxSetup({ async: false });

		latitude = pos.coords.latitude;
		longitude =  pos.coords.longitude;
		var accuracy =  pos.coords.accuracy;

		$("#Status").html("Coordinates retrieved.");

		$("#Coordinates").css("visibility","visible");		
		$("#Latitude").html(Math.round(100000*latitude)/100000 + ' &#176;W ')
		$("#Longitude").html(Math.round(100000*longitude)/100000 + ' &#176;N') 
		$("#Accuracy").html(Math.round(10 * 3.28 * accuracy) / 10 + ' ft');

    
	    // Show the disclaimer
		if (3.28 * accuracy > 500) {
		    $("#AccuracyAlert").html("The geolocation accuracy reported from your mobile device is poor.  Are you outside with clear visibility? Please attempt scanning again at a new location.")
		    $("#AccuracyAlertDialog").popup("open")
		}
		else if (3.28 * accuracy > 200) {
		    $("#AccuracyAlert").html("The geolocation accuracy reported from your mobile device is less than 200 ft.  Please attempt scanning again at a new location.")
		    $("#AccuracyAlertDialog").popup("open")
		}
		else {
		scanProximity();
		}
	};
	
	var fail = function(error) {
		$("#Coordinates").css("visibility","hidden");		
		$("#Status").html("Error getting geolocation. Do you have GPS enabled?");
		// when debugging report error.message
	};
	
	
	$("#Status").html("Retrieving Geolocation from your device.");
	
	var inputLatitude = $("#InputLatitude").val();
	var inputLongitude = $("#InputLongitude").val();
	
	 if ( inputLatitude=="" && inputLongitude=="") {
		// Get the coordatinates automatically through the browser
		navigator.geolocation.getCurrentPosition(success, fail,
	  {maximumAge:0, timeout:15000, enableHighAccuracy: true});
	 } else {
	   // Get the coordinates from the input form
	   $("#Coordinates").css("visibility","hidden");
	   latitude=inputLatitude;
	   longitude=inputLongitude;
	   scanProximity();
	  }
	
};


var scanProximity = function () {

	var securityCode = $("#Code").val();
	
	// Compose the data feed URL
	// http://proximityscanner.com/
	// ../Functions.svc/CheckProximity
	// http://localhost:49631/Functions.svc/CheckProximity
	var URL = '../Functions.svc/CheckProximity' +
	'?Code=' + securityCode +
	'&Latitude=' + latitude +
	'&Longitude=' + longitude +
	'&Timestamp=' + Date.now();			

	// Query the data and populate the table
	$.getJSON(URL)
		.done(function (data) {
		
			var message = data.Message;
			var distance = data.Distance;
			var site = data.Site;
			var zone=data.Zone;
			var disclaimer = data.Disclaimer;
			var status = data.Status;
			var timestamp = new Date();
			var responsetime = format_date(timestamp) + ' ' + format_time(timestamp);


			if ($(".ui-page-active .ui-popup-active").length == 0) {
			 // Other popups are not open

				// Disclaimer 

				// Define the disclaimer
				if (disclaimer != null) {
					// replace the default text built into the app
					$("#DisclaimerText").html(disclaimer);
				}

				// Show the disclaimer
				if (disclaimerShown == null) {
					$("#DisclaimerDialog").popup("open")
					disclaimerShown = 'done';
				}


			
			}
			// Unhide the response block
			$("#ResponseBlock").css("visibility","visible");
			
			// Remove button text
			$('#Button').html('');
					
			// Set the button image, Yes/NO response, response text, and status
			if (zone==5) { 
			 $("#Response").html("NO"); 
			 $("#Response").css("background-color","#508a55");	
			 $("#Button").removeClass("Z0").removeClass("Z1").removeClass("Z2").removeClass("Z3").removeClass("Z4").addClass("Z5");		
			if (message==null) { $("#ResponseDescription").html("There is not a Cortese site within 200 feet of your location.  The nearest Cortese site is over a mile away.");} else { $("#ResponseDescription").html(message); }
			if (status==null) { $("#Status").html("Scan Completed.");} else { $("#Status").html(status); }				 
			}
			else if (zone==4) {
			 $("#Response").html("NO"); 
			 $("#Response").css("background-color","#87b388");		
			 $("#Button").removeClass("Z0").removeClass("Z1").removeClass("Z2").removeClass("Z3").addClass("Z4").removeClass("Z5");
			 if (message==null) { $("#ResponseDescription").html("There is not a Cortese site within 200 feet of your location.  The nearest Cortese site is between 1000 feet and one mile from your location.");} else { $("#ResponseDescription").html(message); }
			 if (status==null) { $("#Status").html("Scan Completed.");} else { $("#Status").html(status); }		
			}
			else if (zone==3) {
			 $("#Response").html("NO"); 
			 $("#Response").css("background-color","#87b388");
			 $("#Button").removeClass("Z0").removeClass("Z1").removeClass("Z2").addClass("Z3").removeClass("Z4").removeClass("Z5");		
			 if (message==null) { $("#ResponseDescription").html("There is not a Cortese site within 200 feet of your location.  The nearest Cortese site is between 500 and 1000 feet from your location.");} else { $("#ResponseDescription").html(message); }
			 if (status==null) { $("#Status").html("Scan Completed.");} else { $("#Status").html(status); }						 
			}
			else if (zone==2) {
			 $("#Response").html("NO"); 
			 $("#Response").css("background-color","#87b388");
			 $("#Button").removeClass("Z0").removeClass("Z1").addClass("Z2").removeClass("Z3").removeClass("Z4").removeClass("Z5");				
			 if (message==null) { $("#ResponseDescription").html("There is not a Cortese site within 200 feet of your location.  The nearest Cortese site is between 200 and 500 feet from your location.");} else { $("#ResponseDescription").html(message); }
			 if (status==null) { $("#Status").html("Scan Completed.");} else { $("#Status").html(status); }		
			}
			else if (zone==1) {
			 $("#Response").html("YES"); 
			 $("#Response").css("background-color","red");
			 $("#Button").removeClass("Z0").addClass("Z1").removeClass("Z2").removeClass("Z3").removeClass("Z4").removeClass("Z5");	
			 if (message==null) { $("#ResponseDescription").html("There is a Cortese site within 200 feet of your location.");} else { $("#ResponseDescription").html(message); }
			 if (status==null) { $("#Status").html("Scan Completed.");} else { $("#Status").html(status); }	
			}
			else{
			 if (response="Invalid Security Code") { 
			   $("#Security").css("visibility","visible"); 
			   $("#Disclaimer").css("display","none");	
			 }
			 $("#ResponseBlock").css("visibility","hidden");
			 if (message==null) { $("#ResponseDescription").html("");} else { $("#ResponseDescription").html(message); }			 
			 $("#Button").addClass("Z0").removeClass("Z1").removeClass("Z2").removeClass("Z3").removeClass("Z4").removeClass("Z5");				
			 if (status==null) { $("#Status").html("Scan Completed.");} else { $("#Status").html(status); }						 
			}
			$("#ResponseTime").html("Last Checked " + responsetime); 
		})
		.fail(function (jqxhr, textStatus, error) {
			var timestamp = new Date();
			var responsetime = format_date(timestamp) + ' ' + format_time(timestamp);
			$("#Security").css("visibility","visible");
			$("#ResponseDescription").html("");
			$("#ResponseBlock").css("visibility","hidden");
			$("#Status").html("A network connection cannot be established.")
			$("#ResponseTime").html("Last Checked " + responsetime); 	
			// Report error.message when debugging				
		});
}

$(document).ready(function(){   

	// Create callback for the accuracy pop
	$( "#AccuracyAlertDialog" ).bind({
	   popupafterclose: function(event, ui) { scanProximity(); }
	});

});



// Auxillary Functions

function format_time(date_obj) { 
   // formats a javascript Date object into a 12h AM/PM time string 
   var hour = date_obj.getHours(); 
   var minute = date_obj.getMinutes(); 
   var amPM = (hour > 11) ? "pm" : "am"; 
   if(hour > 12) { 
     hour -= 12; 
  } else if(hour == 0) { 
     hour = "12"; 
   } 
   if(minute < 10) { 
     minute = "0" + minute; 
   } 
   return hour + ":" + minute + amPM; 
 } 
 
function format_date(date_obj) { 
   // formats a javascript Date object mm/dd/yyyy string
   return (date_obj.getMonth() + 1) + "/" + date_obj.getDate() + "/" + date_obj.getFullYear();
}

