// Put all onload AJAX calls here, and event listeners
$(document).ready(function() {
    

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
