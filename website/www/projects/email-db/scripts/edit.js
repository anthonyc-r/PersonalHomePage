function init(){
	StateEnum = {
		NAME	: 'Edit Name',
		EMAIL	: 'Edit Email'
	}

	var state;
	var nameButton = $('#editName');
	var emailButton = $('#editEmail');

	nameButton.click(setEditName);
	emailButton.click(setEditEmail);
}

function run(){
	
}

function setEditName(){
	state = StateEnum.NAME;
	$('#menuForm').remove();
	$('#menuArticle').append(generateForm(state));
	
}

function setEditEmail(){
	state = StateEnum.EMAIL;
	$('#menuForm').remove();
	$('#menuArticle').append(generateForm(state));
		
}

function generateForm(someState){
	var currentState;
	if(someState == StateEnum.NAME){
		currentState = "name"
	}
	else if(someState == StateEnum.EMAIL){
		currentState = "email"
	}

	return '\
	<form id="menuForm" action="../php/edit.php" method="post">\
	  <table>\
        <input type="hidden" value="'+currentState+'" name="which">\
	    <tr><td><label>Name</label></td></tr>\
	    <tr><td><input type="text" name="name" placeholder="Enter your name..." maxlength="40" size="20" required/></td></tr>\
	    <tr><td><label>New '+currentState+'</label></td></tr>\
	    <tr><td><input type="text" name="new'+currentState+'" placeholder="Enter your new '+currentState+'..." maxlength="40" size="20" required/></td></tr>\
	    <tr><td><input type="submit" value="Submit" /></td></tr>\
	  </table>\
	</form>'
}

$(document).ready(function() {
	init();
	run();
});
