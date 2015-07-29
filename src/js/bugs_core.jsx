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
		dispatch.getBugs(projID, this);
	},
	PROJECTS_editer : function(projID) {
		dispatch.procProject(projID, this);
	},
	PROJECTS_adder : function() {
		dispatch.newProject(this);
	},
	PROJECTS_modules : function(projID) {
		dispatch.getModules(projID, this);
	},
	PROJECT_updateVersion : function() {
		dispatch.editProjectVersion(this.state.currentProj, $('#version').val(), this);
	},
	PROJECT_updateName : function() {
		dispatch.editProjectName(this.state.currentProj, $('#name').val(), this);
	},
	BUGS_loader : function(bugID) {
		dispatch.procBug(bugID, this);
	},
	BUGS_adder : function() {
		dispatch.newBug(this.state.currentProj, this);
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
	MODULES_adder : function() {
		dispatch.newModule(this.state.currentProj, this);
	},
	MODULES_back : function() {
		this.BUGS_back();
	},
	MODULES_loader : function(moduleID) {
		dispatch.procModule(moduleID, this);
	},
	MODULE_updateName : function(moduleID) {
		dispatch.editModuleName(moduleID, $("#name").val(), this);
	},
	render : function() {
		console.log(this.state);
		var toRender, toView;
		if(this.state.menu_state === "projects")
			toRender = (<Projects 
				loader={this.PROJECTS_loader} 
				editer={this.PROJECTS_editer} 
				adder={this.PROJECTS_adder} 
				projects={this.state.items} 
				modules={this.PROJECTS_modules} 
			/>);
		else if(this.state.menu_state === "bugs")
			toRender = (<Bugs 
				loader={this.BUGS_loader} 
				adder={this.BUGS_adder} 
				bugs={this.state.items} 
				back={this.BUGS_back} 
			/>);
		else if(this.state.menu_state === "modules")
			toRender = (<Modules 
				back={this.MODULES_back} 
				adder={this.MODULES_adder} 
				loader={this.MODULES_loader} 
				modules={this.state.items} 
			/>);

		if(this.state.view_state === "project")
			toView = (<div className="container"><ProjectView 
				profile={this.state.view_profile} 
				updateName={this.PROJECT_updateName} 
				updateVersion={this.PROJECT_updateVersion}
			/></div>);
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
		else if(this.state.view_state === "module")
			toView = (<div className="container"><ModuleView profile={this.state.view_profile} updateName={this.MODULE_updateName} ver={this.state.ver}  /></div>);

		return(
			<div>
				{toRender}
				{toView}
			</div>
		);		
	}
});