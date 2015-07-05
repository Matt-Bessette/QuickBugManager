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
				<li className="project">
					<span className="name">{project.name}</span><br/>
					<span className="version">Version: {project.version}</span><br/>
					<span className="owner">By: {project.owner}</span><br/>
					<span className="submitted">{project.submitted}</span><br/>
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
	mixins : [React.addons.LinkedStateMixin],
	getInitialState : function() {
		return ({filter : ""});
	},
	/*
		props:
			- bugs - array
			- ver - int
			- loader - func
			- adder - func
			- back - func
	*/
	render : function() {
		console.log(this.state.filter)
		var ctx = this;
		var filters = this.state.filter.split(",");
		var bugs = this.props.bugs.map(function(bug, i) {

			var valid = true;

			$.each(filters, function(k, filter) {
				var set = filter.split(":");
				if(bug[set[0]] !== set[1]) {
					valid = false;
					return false;
				}
			});
			if(valid) {
				var state;
				switch(bug.status) {
					case "1": state = "WIP"; 		break;
					case "2": state = "Unread";		break;
					case "3": state = "OnHold";		break;
					case "4": state = "Complete";	break;
					case "5": state = "Scrapped";	break;
					default: state = "Unread";
				}
				return (
					<li className={"bug "+state} onClick={ctx.props.loader.bind(null, bug.bugID)}>
						<span className="bugID">Bug #{bug.bugID}</span><br/>
						<span className="module">Module: {bug.module}</span><br/>
						<span className="browser">Browser: {bug.browser}</span><br/>
						<span className="type">Type: {bug.type}</span>
					</li>
				);
			}
		});
		return (
			<ul className="left-menu">
				<li className="filter">
					<input type="text" placeholder="Filters" valueLink={this.linkState('filter')} />
				</li>
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
				<span className="name toInput">Name: {this.state.name}</span><br/>
				<span className="owner">Owner: {this.state.owner}</span><br/>
				<span className="version toInput">Version: {this.state.version}</span><br/>
				<span className="submitted">Submitted: {this.state.submitted}</span>
			</div>
		);
	}
});

var BugView = React.createClass({
	render : function() {
		var status;
		switch(this.props.profile.status) {
			case "1": status = "WIP"; 		break;
			case "2": status = "Unread";	break;
			case "3": status = "OnHold";	break;
			case "4": status = "Complete";	break;
			case "5": status = "Scrapped";	break;

			default: status = "Unread";
		}
		return (
			<div className="bugView">
				<div className="row">
					<div className="six columns">
						<span className="bugID">Bug # {this.props.profile.bugID}</span><span className="status"> - {status}</span><br/>
						<span className="project-name">Project: {this.props.profile.project}</span><br/>
						<span className="owner">Owner: {this.props.profile.owner}</span><br/>
						<span className="bug-type toSelectionType">Type: {this.props.profile.type}</span><br/>
						<span className="browser toSelectionBrowser">Browser: {this.props.profile.browser}</span><br/>
						<span className="browser toSelectionModule">Module: {this.props.profile.module}</span><br/>
						<span className="submitted">Submitted: {this.props.profile.submitted}</span>
					</div>
					<div className="six columns">
						<button className="Unread u-full-width" onClick={this.props.changeState.bind(null, this.props.profile.bugID, "unread")}>Unread</button>
						<button className="WIP u-full-width" onClick={this.props.changeState.bind(null, this.props.profile.bugID, "wip")}>WIP</button>
						<button className="Complete u-full-width" onClick={this.props.changeState.bind(null, this.props.profile.bugID, "complete")}>Complete</button>
						<button className="Scrapped u-full-width" onClick={this.props.changeState.bind(null, this.props.profile.bugID, "scrapped")}>Scrapped</button>
						<button className="OnHold u-full-width" onClick={this.props.changeState.bind(null, this.props.profile.bugID, "onhold")}>Hold</button>
					</div>
				</div>
				<h4>Description</h4>
				<p className="description toTextArea">{this.props.profile.description}</p>
			</div>
		);
	}
});