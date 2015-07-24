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
		var ctx = this;
		var filters = this.state.filter.split(" ");
		console.log("Before map");
		var bugs = this.props.bugs.map(function(bug, i) {

			var valid = true;

			$.each(filters, function(k, filter) {
				var set = filter.split(":");
				var reg = new RegExp(set[1]);
				if(!reg.test(bug[set[0]])) {
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
		console.log("After map");
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

var NewProject = React.createClass({
	render : function() {

		return (
			<div className="projectView">
				<span className="name">Name: 
					<input type="text" id="name" placeholder="Project Name" />
				</span>
				<br/>

				<span className="owner">Owner: {this.props.user.name}</span><br/>
				<span className="version toInput">Version: 
					<input type="text" id="name" placeholder="Project Name" />
				</span>
				<br/>

				<span className="submitted">Submitted: now</span>
			</div>
		);
	}
});

var ProjectView = React.createClass({
	render : function() {
		return(
			<div className="projectView">
				<span className="name toInput">Name: {this.props.name}</span><br/>
				<span className="owner">Owner: {this.props.owner}</span><br/>
				<span className="version toInput">Version: {this.props.version}</span><br/>
				<span className="submitted">Submitted: {this.props.submitted}</span>
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
		var comments = this.props.profile.COMMENTS.map(function(comment, i) {
			return (
				<div className="comment">
					{comment.submitted} - {comment.author}<br/>
					<p>{comment.comment}</p>
				</div>
			);
		});

		var tags = this.props.profile.TAGS.map(function(tag, i) {
			return (
				<div className="tag">
					{tag}
				</div>
			);
		});

		return (
			<div className="bugView">
				<div className="row">
					<div className="nine columns">
						<span className="bugID">Bug # {this.props.profile.bugID}</span><span className="status"> - {status}</span>
						<div className="row">
							<div className="six columns">
								<span className="project-name">Project: {this.props.profile.project}</span><br/>
								<span className="owner">Owner: {this.props.profile.owner}</span><br/>
								<span className="submitted">Submitted: {this.props.profile.submitted}</span>
							</div>
							<div className="six columns">
								<span className="bug-type">Type: <span className="toSelectionType">{this.props.profile.type}</span></span><br/>
								<span className="browser">Browser: <span className="toSelectionBrowser">{this.props.profile.browser}</span></span><br/>
								<span className="module">Module: <span className="toSelectionModule">{this.props.profile.module}</span></span><br/>
								<span className="dev">Dev: <span className="toSelectionDev">{this.props.profile.dev}</span></span>
							</div>
						</div>
						<hr />
					</div>
					<div className="three columns">
						<div className="row">
							<div className="six columns">
								<button className="Unread u-full-width" onClick={this.props.changeState.bind(null, this.props.profile.bugID, "unread")}>Unread</button>
								<button className="WIP u-full-width" onClick={this.props.changeState.bind(null, this.props.profile.bugID, "wip")}>WIP</button>
								<button className="Complete u-full-width" onClick={this.props.changeState.bind(null, this.props.profile.bugID, "complete")}>Complete</button>
							</div>
							<div className="six columns">
								<button className="Scrapped u-full-width" onClick={this.props.changeState.bind(null, this.props.profile.bugID, "scrapped")}>Scrapped</button>
								<button className="OnHold u-full-width" onClick={this.props.changeState.bind(null, this.props.profile.bugID, "onhold")}>Hold</button>
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="six columns">
						<h4>Description</h4>
						<span id="descBox">
							<p className="description toTextArea">{this.props.profile.description}</p>
						</span>
					</div>
					<div className="six columns">
						<h4>Comments</h4>
						<div className="commentHolder">
							{comments}
						</div>
					</div>
				</div>
				<div className="row">
					<div className="six columns">
						<h4>Tags</h4>
						
					</div>
					<div className="six columns">
						
					</div>
				</div>
			</div>
		);
	}
});