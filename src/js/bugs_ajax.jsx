var dispatch = {

	getUserProfile : function(callback) {
		var user_x = $.get("actions.php?action=user-profile");
	},
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
			callback.setState({items : $.parseJSON(json), menu_state : "bugs", currentProj : projID, ver : callback.state.ver + 1});
		});
		bugs_x.fail(function(){
			console.log("Error getting bugs");
		});
	},
	getModules : function(projID, callback) {
		var modules_x = $.get("actions.php?action=project-modules&val1="+projID);
		modules_x.done(function(json) {
			callback.setState({items : $.parseJSON(json), currentProj : projID, menu_state : "modules", ver : callback.state.ver + 1});
		});
		modules_x.fail(function() {
			console.log("Error getting modules");
		});
	},
	procBug : function(bugID, callback) {
		var bug_x = $.get("actions.php?action=bug-profile&val1="+bugID);
		bug_x.done(function(json) {
			callback.setState({view_profile : $.parseJSON(json), view_state : "bug", ver : callback.state.ver + 1});
		});
		bug_x.fail(function() {
			console.log("Error getting bug profile");
		});
	},
	procProject : function(projID, callback) {
		var proj_x = $.get("actions.php?action=project-profile&val1="+projID);
		proj_x.done(function(json) {
			callback.setState({view_profile : $.parseJSON(json), view_state : "project", ver : callback.state.ver + 1, currentProj : projID});
		});
		proj_x.fail(function() {
			console.log("Error getting project profile");
		});
	},
	procModule : function(moduleID, callback) {
		var module_x = $.get("actions.php?action=module-profile&val1="+moduleID);
		module_x.done(function(json) {
			callback.setState({view_profile : $.parseJSON(json), view_state : "module", ver : callback.state.ver + 1});
		});
		module_x.fail(function() {
			console.log("Error getting module profile");
		});
	},

	newProject : function(callback) {
		var proj_x = $.ajax({
			type : "POST",
			url : "actions.php?action=new-project"
		});
		proj_x.done(function(json) {
			var id_json = $.parseJSON(json);
			dispatch.getProjects(callback);
			dispatch.procProject(id_json.id, callback);
		});
		proj_x.fail(function() {
			console.log("Error creating project");
		});
	},
	newBug : function(projID, callback) {
		var bug_x = $.ajax({
			type : "POST",
			url : "actions.php?action=new-bug&val1="+projID
		});
		bug_x.done(function(json) {
			var id = $.parseJSON(json);
			dispatch.getBugs(projID, callback);
			dispatch.procBug(id.id, callback);
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
	newModule : function(projID, callback) {
		var module_x = $.ajax({
			type : "POST",
			url : "actions.php?action=new-module&val1="+projID
		});
		module_x.done(function(json) {
			var id = $.parseJSON(json);
			dispatch.getModules(projID, callback);
			dispatch.procModule(id.id, callback);
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
			dispatch.getBugs(this.state.projID, callback);
		});
		bug_x.fail(function() {
			console.log("Error updating bug");
		});
	},
	editBugDev : function(bugID, dev, callback) {
		var bug_x = $.ajax({
			type : "POST",
			url : "actions.php?action=edit-bug-dev&val1="+bugID,
			data : {DEV : dev}
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
			data : {TYPE : type}
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
			dispatch.procProject(projID, callback);
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
			dispatch.procProject(projID, callback);
		});
		proj_x.fail(function() {
			console.log("Error updating project");
		});
	},
	editModuleName : function(moduleID, name, callback) {
		var module_x = $.ajax({
			type : "POST",
			url : "actions.php?action=edit-module-name&val1="+moduleID,
			data : {NAME : name}
		});
		module_x.done(function() {
			dispatch.getModules(callback.state.currentProj, callback);
		});
		module_x.fail(function() {
			console.log("Error updating module");
		});
	},

	editBugState : function(bugID, state, callback) {
		var stateCode;
		switch(state) {
			case "2": 		stateCode = "unread"; 	break;
			case "1": 		stateCode = "wip";		break;
			case "4": 		stateCode = "complete";	break;
			case "5": 		stateCode = "scrapped";	break;
			case "3": 		stateCode = "hold";		break;
			default: 		stateCode = 0;
		}
		if(stateCode !== 0) {
			var state_x = $.ajax({
				type : "PUT",
				url : "actions.php?action=bug-state-"+stateCode+"&val1="+bugID,
			});
			state_x.done(function() {
				dispatch.procBug(bugID, callback);
				dispatch.getBugs(callback.state.currentProj, callback);
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