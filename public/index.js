var maxRows = 5;
var tableIndex = 0;

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("statsBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Put all onload AJAX calls here, and event listeners
$(document).ready(function() {
    $.ajax({
        type: 'post',            //Request type
        dataType: 'text',       //Data type - we will use JSON for almost everything 
        url: '/refreshOntarioData',   //The server endpoint we are connecting to
        success: function (data) {
           $.ajax({
				type: 'get',            //Request type
				dataType: 'json',       //Data type - we will use JSON for almost everything 
				url: '/getTableData',   //The server endpoint we are connecting to
				data: {
					rows : maxRows,
					startIndex : tableIndex
				},
				success: function (data) {
					data.forEach(function(entry) {
						addDataToTableONT(entry);
					});
				},
				fail: function(error) {
					// Non-200 return, do something with error
					console.log(error); 
				}
			});
		
        },
        fail: function(error) {
            // Non-200 return, do something with error
            console.log(error); 
        }
    });
});

function addDataToTableONT(entry) {
	var bod = $("#Tbody");
	bod.append("<tr>");
	bod.append("<th>"+entry["Last Name"]+"</th>");
	bod.append("<th>"+entry["First Name"]+"</th>");
	bod.append("<th>"+entry["Salary Paid"]+"</th>");
	bod.append("<th>"+entry["Employer"]+"</th>");
	bod.append("<th>"+entry["Job Title"]+"</th>");
	bod.append("<th>Ontario</th>");
	bod.append("<th>"+entry["Calendar Year"]+"</th>");
	bod.append("</tr>")
}

$("#nextSet").click(function() {
	document.getElementById("Tbody").innerHTML = "";
	tableIndex += maxRows;
	$.ajax({
		type: 'get',            //Request type
		dataType: 'json',       //Data type - we will use JSON for almost everything 
		url: '/getTableData',   //The server endpoint we are connecting to
		data: {
			rows : maxRows,
			startIndex : tableIndex
		},
		success: function (data) {
				
			data.forEach(function(entry) {
				addDataToTableONT(entry);
			});
		},
		fail: function(error) {
			// Non-200 return, do something with error
			console.log(error); 
		}
	});
});

$("#prevSet").click(function() {
	if (tableIndex == 0) {
		return
	}
	document.getElementById("Tbody").innerHTML = "";
	tableIndex -= maxRows;
	$.ajax({
		type: 'get',            //Request type
		dataType: 'json',       //Data type - we will use JSON for almost everything 
		url: '/getTableData',   //The server endpoint we are connecting to
		data: {
			rows : maxRows,
			startIndex : tableIndex
		},
		success: function (data) {
				
			data.forEach(function(entry) {
				addDataToTableONT(entry);
			});
		},
		fail: function(error) {
			// Non-200 return, do something with error
			console.log(error); 
		}
	});
});

$("#refButton").click(function() {
	$.ajax({
        type: 'post',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/refreshOntarioData',   //The server endpoint we are connecting to
        success: function (data) {
           console.log(data);
        },
        fail: function(error) {
            // Non-200 return, do something with error
            console.log(error); 
        }
    });
});
