var Projects = React.createClass({
	/*
		props:
			- projects - array
			- ver - int
			- loader - func
			- editer - func
			- adder - func
	*/
	render : function() {
		var ctx = this;
		var projects = this.props.projects.map(function(project, i) {
			return (
				<li className="project" key={ctx.props.ver+".p."+i}>
					<span className="name">{project.name}</span>
					<span className="version">Version: {project.version}</span>
					<span className="owner">By: {project.owner}</span>
					<span className="submitted">{project.submitted}</span>
					<button className="button-loader" onClick={ctx.props.loader.bind(null, project.projID)}>Load</button> <button className="button-loader" onClick={ctx.props.editer.bind(null, project.projID)}>Edit</button>
				</li>
			);
		});
		return (
			<ul className="left-menu">
				<li className="project" onClick={this.props.adder}>
					+ Press here to add a project
				</li>
				{projects}
			</ul>
		);
	}
});

var Bugs = React.createClass({
	/*
		props:
			- bugs - array
			- ver - int
			- loader - func
			- adder - func
			- back - func
	*/
	render : function() {
		var ctx = this;
		var bugs = this.props.bugs.map(function(bug, i) {
			var state;
			switch(bug.status) {
				case 1: state = "Unread"; 	break;
				case 2: state = "WIP";		break;
				case 3: state = "Complete";	break;
				case 4: state = "Scrapped";	break;
				case 5: state = "OnHold";	break;
				default: state = "Unread";
			}
			return (
				<li className={"bug "+state} key={ctx.props.ver+".b."+i}>
					<span className="bugID">Bug #{bug.ID}</span>
					<span className="module">Module: {bug.module}</span>
					<span className="browser">Browser: {bug.browser}</span>
					<span className="type">Type: {bug.type}</span>
					<button className="button-loader" onClick={ctx.props.loader.bind(null, bug.bugID)}>Load</button>
				</li>
			);
		});
		return (
			<ul className="left-menu">
				<li className="bug" onClick={this.props.back}>
					Press here to go back to projects
				</li>
				<li className="bug" onClick={this.props.adder}>
					+ Press here to add a bug
				</li>
				{bugs}
			</ul>
		);
	}
});

var ProjectView = React.createClass({
	getInitialState : function() {
		return ({
			name : this.props.profile.name,
			owner : this.props.profile.owner,
			version : this.props.profile.version,
			submitted : this.props.profile.submitted,
			MODULES : this.props.profile.modules
		});
	},
	render : function() {
		return(
			<div className="projectView">
				Name: <span className="name toInput">{this.state.name}</span><br/>
				Owner:<span className="owner">{this.state.owner}</span><br/>
				Version:<span className="version toInput">{this.state.version}</span><br/>
				Submitted:<span className="submitted">{this.state.submitted}</span>
			</div>
		);
	}
});

var BugView = React.createClass({
	getInitialState : function() {
		return({
			bugID : this.props.profile.bugID,
			project : this.props.profile.project,
			owner : this.props.profile.owner,
			projID : this.props.profile.projID,
			submitted : this.props.profile.submitted,
			description : this.props.profile.description,
			status : this.props.profile.status,
			type : this.props.profile.type,
			browser : this.props.profile.browser,
			module : this.props.profile.module,
			TAGS : this.props.profile.TAGS,
			COMMENTS : this.props.profile.COMMENTS
		});
	},
	render : function() {
		var status;
		switch(this.state.status) {
			case 1: status = "Unread"; 	break;
			case 2: status = "WIP";		break;
			case 3: status = "Complete";	break;
			case 4: status = "Scrapped";	break;
			case 5: status = "OnHold";	break;
			default: status = "Unread";
		}
		return (
			<div className="bugView">
				Bug #<span className="bugID">{this.state.bugID}</span> - <span className="status">{status}</span><br/>
				Project:<span className="project-name">{this.state.project}</span><br/>
				Owner:<span className="owner">{this.state.owner}</span><br/>
				Type:<span className="bug-type toSelectionType">{this.state.type}</span><br/>
				Browser:<span className="browser toSelectionBrowser">{this.state.browser}</span><br/>
				Module:<span className="browser toSelectionModule">{this.state.module}</span><br/>
				Submitted:<span className="submitted">{this.state.submitted}</span>
				<hr />
				<h4>description</h4>
				<p className="description toTextArea">{this.state.description}</p>
			</div>
		);
	}
});

