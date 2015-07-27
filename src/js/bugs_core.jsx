$(document).ready(function(){
	React.render(<App />, document.getElementById('app'));
});

var App = React.createClass({
	getInitialState : function() {
		return ({
			ver : 0,
			menu_state : "none",
			view_state : "none",
			view_profile : {},
			currentProj : null,
			items : []
		});
	},
	componentDidMount : function() {
		dispatch.getProjects(this);
	},
	PROJECTS_loader : function(projID) {
		console.log("Getting bugs");
		dispatch.getBugs(projID, this);
	},
	PROJECTS_editer : function(projID) {
		dispatch.procProject(projID, this);
	},
	PROJECTS_adder : function() {
		this.setState({
			view_state : "project",
			view_profile : {
				name : "",
				owner : "you",
				version : "",
				submitted : "TBD",
				MODULES : []
			}
		});
	},
	BUGS_loader : function(bugID) {
		dispatch.procBug(bugID, this);
	},
	BUGS_adder : function() {
		dispatch.newBug(this.state.currentProj, "", "any", "cosmetic", this);
	},
	BUGS_back : function() {
		dispatch.getProjects(this);
	},
	BUGS_changeState : function(bugID) {
		var status = $("#status").val();
		dispatch.editBugState(bugID, status, this);
		dispatch.getBugs(this.state.currentProj, this);
	},
	BUGS_sendComment : function(bugID) {
		dispatch.newComment(bugID, $("#commentbox").val(), this);
		$("#commentbox").val("");
	},
	BUGS_changeType : function(bugID) {
		var type = $("#type").val();
		dispatch.editBugType(bugID, type, this);
	},
	BUGS_changeModule : function(bugID) {
		var mod = $("#module").val();
		dispatch.editBugModule(bugID, mod, this);
	},
	BUGS_changeDev : function(bugID) {
		var dev = $("#dev").val();
		dispatch.editBugDev(bugID, dev, this);
	},
	BUGS_changeBrowser : function(bugID) {
		var browser = $("#browser").val();
		dispatch.editBugBrowser(bugID, dev, this);
	},
	BUGS_updateDescription : function(bugID) {
		var desc = $("#description").val();
		dispatch.editBugDescription(bugID, desc, this);
		$("#descupdate").html("Description updated @ "+Date.now());
	},
	NEWPROJECT_addProject : function() {
		dispatch.newProject($("#name").val(), $("#version").val(), this);
	},
	render : function() {
		console.log(this.state);
		var toRender, toView;
		if(this.state.menu_state === "projects")
			toRender = (<Projects loader={this.PROJECTS_loader} editer={this.PROJECTS_editer} adder={this.PROJECTS_adder} projects={this.state.items} />);
		else if(this.state.menu_state === "bugs")
			toRender = (<Bugs loader={this.BUGS_loader} adder={this.BUGS_adder} bugs={this.state.items} back={this.BUGS_back} />);

		if(this.state.view_state === "project")
			toView = (<div className="container"><ProjectView profile={this.state.view_profile} /></div>);
		else if(this.state.view_state === "bug")
			toView = (<div className="container"><BugView 
				profile={this.state.view_profile} 
				changeState={this.BUGS_changeState} 
				changeType={this.BUGS_changeType} 
				changeModule={this.BUGS_changeModule} 
				changeDev={this.BUGS_changeDev} 
				changeBrowser={this.BUGS_changeBrowser} 
				sendComment={this.BUGS_sendComment} 
				updateDescription={this.BUGS_updateDescription} 

				ver={this.state.ver} 
			/></div>);
		else if(this.state.view_state === "new_project")
			toView = (<div className="container"><NewProject addProject={this.NEWPROJECT_addProject} /></div>);

		return(
			<div>
				{toRender}
				{toView}
			</div>
		);		
	}
});