$(document).ready(function(){
	React.render(<App />, document.getElementById('app'));
});

var App = React.createClass({
	getIntialState : function() {
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
		this.setState({
			view_state : "bug",
			view_profile : {
				project : "",
				owner : "you",
				projID : this.state.currentProj,
				submitted : "TBD",
				status : 1,
				type : "cosmetic",
				description : "",
				browser : "Google Chrome",
				module : "none",
				TAGS : [],
				COMMENTS : []
			}
		});
	},
	render : function() {
		var toRender;
		if(this.state.menu_state === "project")
			toRender += (<Projects loader={this.PROJECTS_loader} editer={this.PROJECTS_editer} adder={this.PROJECTS_adder} projects={this.state.items} ver={this.state.ver} />);
		else if(this.state.menu_state === "bugs")
			toRender += (<Bugs loader={this.BUGS_loader} adder={this.BUGS_adder} bugs={this.state.items} ver={this.state.ver} />);

		if(this.state.view_state === "project")
			toRender += (<Project profile={this.state.view_profile} />);
		else if(this.state.view_state === "bug")
			toRender += (<Bug profile={this.state.view_profile} />);

		return({toRender});		
	}
});

