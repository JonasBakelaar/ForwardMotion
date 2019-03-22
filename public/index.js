var maxRows = 5;
var tableIndex = 0;

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
