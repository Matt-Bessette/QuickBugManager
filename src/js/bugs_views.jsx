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
				<span className={"tag "+tag.color}>
					<span className="in-tag">{tag.tag}</span>
					<span><i className="fa fa-times fa-fw"></i></span>
				</span>
			);
		});

		return (
			<div className="bugView">
				<div className="row">
					<div className="four columns">
						<h5>Bug # {this.props.profile.bugID}</h5>
					</div>
					<div className="four columns">
						<h5>{this.props.profile.project}</h5>
					</div>
					<div className="four columns">
						<select name="status" defaultValue={status}>
							<option value="Unread">Unread</option>
							<option value="WIP">WIP</option>
							<option value="Completed">Completed</option>
							<option value="Scraped">Scraped</option>
							<option value="OnHold">OnHold</option>
						</select>
					</div>
				</div>
				<div className="row">
					<div className="eight columns">
						<p>Submitted on {this.props.profile.submitted} by {this.props.profile.owner}</p>
					</div>
				</div>
				<hr />
				<div className="row">
					{tags}
				</div>
				<hr />
				<div className="row">
					<div className="five columns">
						<table>
							<tr>
								<td>TYPE</td>
								<td>{this.props.profile.type}</td>
							</tr>
							<tr>
								<td>MODULE</td>
								<td>{this.props.profile.module}</td>
							</tr>
							<tr>
								<td>DEV</td>
								<td>{this.props.profile.dev}</td>
							</tr>
							<tr>
								<td>BROWSER</td>
								<td>{this.props.profile.browser}</td>
							</tr>
						</table>
					</div>
					<div className="seven columns">
						<h5>Description</h5>
						<p>{this.props.profile.description}</p>
					</div>
				</div>
				<div className="row">
					<h5>Comments</h5>
				</div>
			</div>
		);
	}
});