var dispatch = {

	getProjects : function(callback) {
		var proj_x = $.get("actions.php?action=all-projects");
		proj_x.done(function(json) {
			callback.setState({projects : $.parseJSON(json)});
		});
		proj_x.fail(function(){
			console.log("Error getting projects");
		});
	},
	getBugs : function(projID, callback) {
		var bugs_x = $.get("actions.php?action=project-bugs&val1="+projID);
		bugs_x.done(function(json) {
			callback.setState({bugs :$.parseJSON(json)});
		});
		bugs_x.fail(function(){
			console.log("Error getting bugs");
		});
	},
	procBug : function(bugID, callback) {
		var bug_x = $.get("actions.php?action=bug-profile&val1="+bugID);
		bug_x.done(function(json) {
			callback.setState({bugProfile : $.parseJSON(json)});
		});
		bug_x.fail(function() {
			console.log("Error getting bug profile");
		});
	},

	newProject : function(name, version, callback) {
		var proj_x = $.ajax({
			type : "POST",
			url : "actions.php?action=new-project",
			data : {NAME : name, VERSION : version}
		});
		proj_x.done(function() {
			dispatch.getProjects(callback);
		});
		proj_x.fail(function() {
			console.log("Error creating project");
		});
	},
	newBug : function(projID, description, browser, type, callback) {
		var bug_x = $.ajax({
			type : "POST",
			url : "actions.php?action=new-bug&val1="+projID,
			data : {DESCRIPTION : description, BROWSER : browser, TYPE : type}
		});
		bug_x.done(function() {
			dispatch.getBugs(projID, callback);
		});
		bug_x.fail(function() {
			console.log("Error creating bug");
		});
	},
	newComment : function(bugID, comment, callback) {
		var comment_x = $.ajax({
			type : "POST",
			url : "actions.php?action=new-comment&val1="+bugID,
			data : {COMMENT : comment}
		});
		comment_x.done(function() {
			dispatch.procBug(bugID, callback);
		});
		comment_x.fail(function() {
			console.log("Error creating comment");
		});
	}
};