var maxRows = 100;
var tableIndex = 0;

// Put all onload AJAX calls here, and event listeners
$(document).ready(function() {
  $.ajax({
    type: 'get',            //Request type
    //dataType: 'json',       //Data type - we will use JSON for almost everything
    url: '/connect',   //The server endpoint we are connecting to
    success: function (data) {
      console.log("test");
      console.log(data);
      if(data === "success"){
        //update status panel
        console.log("Success");
        setTimeout(function() { getStatus(); }, 1500);
      }
      if(data === "failure"){
        //update status panel
        console.log("Failure");
        console.log("Failure connecting");
      }
    }
});

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
            //console.log("salary: " + entry["Salary Paid"]);
            //let sentData = {lastName: entry["Last Name"], firstName: entry["First Name"], salary: entry["Salary Paid"], employer: entry["Employer"], jobTitle: entry["Job Title"], year: entry["Calendar Year"]};
            //console.log(sentData.salary);
            /*$.ajax({
              type: 'get',            //Request type
              dataType: 'json',       //Data type - we will use JSON for almost everything
              url: '/insertRow',      //The server endpoint we are connecting to
              data: sentData,
              success: function (data) {
                console.log("Successfully inserted a row!");
              }
            });*/
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

$("#searchButton").click(function(){
  let employer = $('#inputEmployer1').val();
  console.log("Searching" + employer);
  $.ajax({
		type: 'get',            //Request type
		dataType: 'json',       //Data type - we will use JSON for almost everything
		url: '/searchDatabase',   //The server endpoint we are connecting to
		data: {
			employer : employer
		},
		success: function (data) {
      if(data === "failure"){
        console.log("Fail");
      } else {
        console.log("records found!");
        console.log(data);

        clearDataTable();
        data.forEach(function(entry) {
          console.log(entry);
          addSearchDataToTableONT(entry);
  			});
      }
		},
		fail: function(error) {
			// Non-200 return, do something with error
			console.log(error);
		}
	});
});


$("#advancedSearchButton").click(function(){
  let rangeFrom = $('#inputSalaryFrom').val();
  let rangeTo = $('#inputSalaryTo').val();
  console.log("Searching");
  if(rangeFrom == "" || rangeFrom == "") {
    console.log("Can't search!");
  } else {
    $.ajax({
  		type: 'get',            //Request type
  		dataType: 'json',       //Data type - we will use JSON for almost everything
  		url: '/advancedSearchDatabase',   //The server endpoint we are connecting to
  		data: {
        rangeFrom : rangeFrom,
    		rangeTo : rangeTo
  		},
  		success: function (data) {
        if(data === "failure"){
          console.log("Fail");
        } else {
          console.log("records found!");
          console.log(data);

          clearDataTable();
          data.forEach(function(entry) {
            console.log(entry);
            addSearchDataToTableONT(entry);
    			});
        }
  		},
  		fail: function(error) {
  			// Non-200 return, do something with error
  			console.log(error);
  		}
  	});
  }
});

function clearDataTable(){
  var bod = $("#Tbody");
  bod.html("")
}

function addSearchDataToTableONT(searchData){
  var bod = $("#Tbody");
	bod.append("<tr>");
	bod.append("<th>"+searchData.lastName+"</th>");
	bod.append("<th>"+searchData.firstName+"</th>");
	bod.append("<th>$"+searchData.salary+"</th>");
	bod.append("<th>"+searchData.employer+"</th>");
	bod.append("<th>"+searchData.jobTitle+"</th>");
	bod.append("<th>Ontario</th>");
	bod.append("<th>"+searchData.year+"</th>");
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
