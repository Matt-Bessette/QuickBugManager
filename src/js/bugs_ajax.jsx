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
	},
	newModule : function(projID, name, callback) {
		var module_x = $.ajax({
			type : "POST",
			url : "actions.php?action=new-module&val1="+projID,
			data : {NAME : name}
		});
		module_x.done(function() {
			dispatch.getProjects(callback);
		});
		module_x.fail(function() {
			console.log("Error creating module");
		});
	},
	newTag : function(bugID, name, callback) {
		var tag_x = $.ajax({
			type : "POST",
			url : "actions.php?action=new-tag&val1="+bugID,
			data : {NAME : name}
		});
		tag_x.done(function() {
			dispatch.procBug(bugID, callback);
		});
		tag_x.fail(function() {
			console.log("Error creating tag");
		});
	},

	editBugDescription : function(bugID, description, callback) {
		var bug_x = $.ajax({
			type : "POST",
			url : "actions.php?action=edit-bug-description&val1="+bugID,
			data : {DESCRIPTION : description}
		});
		bug_x.done(function() {
			dispatch.procBug(bugID, callback);
		});
		bug_x.fail(function() {
			console.log("Error updating bug");
		});
	},
	editBugDev : function(bugID, dev, callback) {
		var bug_x = $.ajax({
			type : "POST",
			url : "actions.php?action=edit-bug-dev&val1="+bugID,
			data : {DESCRIPTION : description}
		});
		bug_x.done(function() {
			dispatch.procBug(bugID, callback);
		});
		bug_x.fail(function() {
			console.log("Error updating bug");
		});
	},
	editBugBrowser : function(bugID, browser, callback) {
		var bug_x = $.ajax({
			type : "POST",
			url : "actions.php?action=edit-bug-browser&val1="+bugID,
			data : {BROWSER : browser}
		});
		bug_x.done(function() {
			dispatch.procBug(bugID, callback);
		});
		bug_x.fail(function() {
			console.log("Error updating bug");
		});
	},
	editBugType : function(bugID, type, callback) {
		var bug_x = $.ajax({
			type : "POST",
			url : "actions.php?action=edit-bug-type&val1="+bugID,
			data : {type : type}
		});
		bug_x.done(function() {
			dispatch.procBug(bugID, callback);
		});
		bug_x.fail(function() {
			console.log("Error updating bug");
		});
	},
	editCommentDescription : function(commentID, description, bugID, callback) {
		var comment_x = $.ajax({
			type : "POST",
			url : "actions.php?action=edit-comment-description&val1="+commentID,
			data : {DESCRIPTION : description}
		});
		comment_x.done(function() {
			dispatch.procBug(bugID, callback);
		});
		comment_x.fail(function() {
			console.log("Error updating comment");
		});
	}
};