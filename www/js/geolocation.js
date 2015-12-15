var ScanCallback = function() {

	var success = function(pos) { 
		jQuery.support.cors = true;
		jQuery.ajaxSetup({ async: false });

		var code = $("#Code").val();
		var latitude = pos.coords.latitude;
		var longitude = pos.coords.longitude;
		var accuracy = pos.coords.accuracy;
		
		$("#Status").html("Coordinates retrieved...");

		$("#Coordinates").css("visibility","visible");		
		$("#Latitude").html(Math.round(1000*latitude)/1000);
		$("#Longitude").html(Math.round(1000*longitude)/1000);
		$("#Accuracy").html(Math.round(10*3.28*accuracy)/10 + 'ft');
		
		// Store code for use next time
		//window.localStorage.setItem("code", code);
		
		scanProximity(code,latitude,longitude);
    };
			
	var fail = function(error) {
		$("#Coordinates").css("visibility","hidden");		
		$("#Status").html("Error getting geolocation: " + error.message);
	};
	
	var scanProximity = function (code,latitude,longitude) {
	
		// Compose the data feed URL
		var URL = 'http://proximityscanner.com/Functions.svc/CheckProximity' +
        '?Code=' + code +
        '&Latitude=' + latitude +
        '&Longitude=' + longitude +
        '&Timestamp=' + Date.now();			

		// Query the data and populate the table
		$.getJSON(URL)
			.done(function (data) {
			    var response = data.Message;
				var distance = data.Distance;
				var site = data.Site;
				var zone=data.Zone;
				
				var timestamp = new Date();
				var responsetime = format_date(timestamp) + ' ' + format_time(timestamp);
				 

				$("#ResponseBlock").css("visibility","visible");
				$("#Security").css("visibility","hidden");
			
				if (zone==5) { 
				 $("#Response").html("NO"); 
				 $("#Response").css("background-color","#508a55");	
				 $("#Button").removeClass("Z0").removeClass("Z1").removeClass("Z2").removeClass("Z3").removeClass("Z4").addClass("Z5");				
				 $("#ResponseDescription").html("There are no Cortese sites nearby.  The closest site is over one mile away."); 
				 $("#Status").html("Scan Completed");					 
				}
				else if (zone==4) {
				 $("#Response").html("NO"); 
				 $("#Response").css("background-color","#87b388");		
				 $("#Button").removeClass("Z0").removeClass("Z1").removeClass("Z2").removeClass("Z3").addClass("Z4").removeClass("Z5");				
				 $("#ResponseDescription").html("The nearest Cortese site is between 1000 feet and one mile from your location"); 
				 $("#Status").html("Scan Completed");					 
				}
				else if (zone==3) {
				 $("#Response").html("NO"); 
				 $("#Response").css("background-color","#87b388");
				 $("#Button").removeClass("Z0").removeClass("Z1").removeClass("Z2").addClass("Z3").removeClass("Z4").removeClass("Z5");				
				 $("#ResponseDescription").html("The nearest Cortese site is between 500 and 1000 feet from your location"); 
				 $("#Status").html("Scan Completed");					 
				}
				else if (zone==2) {
				 $("#Response").html("NO"); 
				 $("#Response").css("background-color","#87b388");
				 $("#Button").removeClass("Z0").removeClass("Z1").addClass("Z2").removeClass("Z3").removeClass("Z4").removeClass("Z5");				
				 $("#ResponseDescription").html("The nearest Cortese site is between 100 and 500 feet from your location"); 
				 $("#Status").html("Scan Completed");	
				}
				else if (zone==1) {
				 $("#Response").html("YES"); 
				 $("#Response").css("background-color","red");
				 $("#Button").removeClass("Z0").addClass("Z1").removeClass("Z2").removeClass("Z3").removeClass("Z4").removeClass("Z5");				
				 $("#ResponseDescription").html("There is a Cortese site within 100 feet of your location."); 
				 $("#Status").html("Scan Completed");	
				}
				else{
				 if (response="Invalid Security Code") { $("#Security").css("visibility","visible"); }
				 $("#ResponseBlock").css("visibility","hidden");
				 $("#ResponseDescription").html("");				 
				 $("#Button").addClass("Z0").removeClass("Z1").removeClass("Z2").removeClass("Z3").removeClass("Z4").removeClass("Z5");				
				 $("#Status").html(response);				 
				}
			    $("#ResponseTime").html("Last Checked " + responsetime); 
			})
			.fail(function (jqxhr, textStatus, error) {
				$("#Security").css("visibility","visible");
				$("#ResponseDescription").html("");
				$("#ResponseBlock").css("visibility","hidden");
				$("#Status").html(error)
			    $("#ResponseTime").html("Last Checked " + responsetime); 				
			});
	}
	
	
	$("#Status").html("Retrieving Geolocation from your device...");
	navigator.geolocation.getCurrentPosition(success, fail,
	  {maximumAge:0, timeout:15000, enableHighAccuracy: true});
};

// Capture pressing the GO button
$('#Code').keypress(function(e) {
            var key = (e.keyCode ? e.keyCode : e.which);
            if ( (key==13) || (key==10)) { ScanCallback(); }
});
    
		
/*
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
   var code = window.localStorage.getItem("code");
   $("#Code").val(code);
 }
*/

$(document).ready(function(){   
    var bodyHeight = $(document).height();
    var headerHeight = $("#Header").height()
	var footerHeight = $("#Status").height();
	var ResponseTimeHeight = $("#ResponseTime").height();	
    var contentHeight = (bodyHeight - headerHeight - footerHeight - ResponseTimeHeight);
	var coordinateTop = (contentHeight-120)*0.20;
    $("#Content").css("height",contentHeight);
	$("#Coordinates").css("top",coordinateTop);
});

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
