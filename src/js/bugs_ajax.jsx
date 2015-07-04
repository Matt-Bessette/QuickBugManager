var dispatch = {

	getProjects : function(callback) {
		var proj_x = $.get("actions.php?action=all-projects");
		proj_x.done(function(json) {
			callback.setState({items : $.parseJSON(json), menu_state : "projects", bugs : [], currentProj : null, ver : callback.state.ver + 1});
		});
		proj_x.fail(function(){
			console.log("Error getting projects");
		});
	},
	getBugs : function(projID, callback) {
		var bugs_x = $.get("actions.php?action=project-bugs&val1="+projID);
		bugs_x.done(function(json) {
			callback.setState({items :$.parseJSON(json), menu_state : "bugs", currentProj : projID, ver : callback.state.ver + 1});
		});
		bugs_x.fail(function(){
			console.log("Error getting bugs");
		});
	},
	procBug : function(bugID, callback) {
		var bug_x = $.get("actions.php?action=bug-profile&val1="+bugID);
		bug_x.done(function(json) {
			callback.setState({view_rofile : $.parseJSON(json), view_state : "bug", ver : callback.state.ver + 1});
		});
		bug_x.fail(function() {
			console.log("Error getting bug profile");
		});
	},
	procProject : function(projID, callback) {
		var proj_x = $.get("actions.php?action=project-profile&val1="+projID);
		proj_x.done(function(json) {
			callback.setState({view_profile : $.parseJSON(json), view_state : "project", ver : callback.state.ver + 1});
		});
		proj_x.fail(function() {
			console.log("Error getting project profile");
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
	},
	editProjectName : function(projID, name, callback) {
		var proj_x = $.ajax({
			type : "POST",
			url : "actions.php?action=edit-project-name&val1="+projID,
			data : {NAME : name}
		});
		proj_x.done(function() {
			dispatch.getProjects(callback);
		});
		proj_x.fail(function() {
			console.log("Error updating project");
		});
	},
	editProjectVersion : function(projID, version, callback) {
		var proj_x = $.ajax({
			type : "POST",
			url : "actions.php?action=edit-project-version&val1="+projID,
			data : {VERSION : version}
		});
		proj_x.done(function() {
			dispatch.getProjects(callback);
		});
		proj_x.fail(function() {
			console.log("Error updating project");
		});
	},
	editModuleName : function(moduleID, name, callback) {
		var module_x = $.ajax({
			type : "POST",
			url : "acitons.php?edit-module-name&val1="+moduleID,
			data : {NAME : name}
		});
		module_x.done(function() {
			dispatch.getProjects(callback);
		});
		module_x.fail(function() {
			console.log("Error updating module");
		});
	},

	changeState : function(bugID, state, callback) {
		var stateCode;
		switch(state) {
			case "unread": 		stateCode = "unread"; 	break;
			case "wip": 		stateCode = "wip";		break;
			case "complete": 	stateCode = "complete";	break;
			case "scrapped": 	stateCode = "scrapped";	break;
			case "hold": 		stateCode = "hold";		break;
			default: 			stateCode = 0;
		}
		if(stateCode !== 0) {
			var state_x = $.ajax({
				type : "PUT",
				url : "actions.php?action=bug-state-"+stateCode+"&val1="+bugID,
			});
			state_x.done(function() {
				dispatch.procBug(bugID, callback);
			});
			state_x.fail(function() {
				console.log("Error changing bug state");
			});
		}
	},

	deleteBug : function(bugID, projID, callback) {
		deleteGeneric("bug", bugID, dispatch.getBugs.bind(null, projID, callback));
	},
	deleteComment : function(commentID, bugID, callback) {
		deleteGeneric("comment", commentID, dispatch.procBug.bind(null, bugID, callback));
	},
	deleteModule : function(moduleID, projID, callback) {
		deleteGeneric("module", moduleID, dispatch.procProject.bind(null, projID, callback));
	},
	deleteTag : function(tagID, bugID, callback) {
		deleteGeneric("tag", tagID, dispatch.procBug.bind(null, bugID, callback))
	},
	deleteProject : function(projID, callback) {
		deleteGeneric("project", projID, dispatch.getProjects.bind(null, callback));
	},
	deleteGeneric : function(the, ID, callback) {
		var gen_x = $.ajax({
			type : "DELETE",
			url : "actions.php?action="+the+"&val1="+ID
		});
		gen_x.done(function() {
			callback();
		});
		gen_x.fail(function() {
			console.log("Error deleteing "+the);
		});
	}
};