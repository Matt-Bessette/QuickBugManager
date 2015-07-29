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
					<button className="button-loader" onClick={ctx.props.loader.bind(null, project.projID)}>Load</button> 
					<button className="button-loader" onClick={ctx.props.editer.bind(null, project.projID)}>Edit</button> 
					<button className="button-loader" onClick={ctx.props.modules.bind(null, project.projID)}>Modules</button>
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

var Modules = React.createClass({
	render : function() {
		var ctx = this;

		var modules = this.props.modules.map(function(module, i) {
			return (
				<li className="bug" onClick={ctx.props.loader.bind(null, module.moduleID)}>
					<span>Module# {module.moduleID}</span><br/>
					<span>Name: {module.name}</span>
				</li>
			);
		});

		return (
			<ul className="left-menu">
				<li className="bug" onClick={this.props.back}>
					Press here to go back to projects
				</li>
				<li className="bug" onClick={this.props.adder}>
					+ Press here to add a module
				</li>
				{modules}
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
						<span className="type">Type: {bug.theType}</span>
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
	render : function() {
		return(
			<div className="row">
				<table><tbody>
					<tr>
						<td>NAME</td>
						<td>
							<input type="text" defaultValue={this.props.profile.name} id="name" />
						</td>
						<td><button className="button button-primary" onClick={this.props.updateName.bind(null, this.props.profile.projID)}>Update</button></td>
					</tr>
					<tr>
						<td>OWNER</td>
						<td>
							{this.props.profile.owner}
						</td>
						<td></td>
					</tr>
					<tr>
						<td>VERSION</td>
						<td>
							<input type="text" defaultValue={this.props.profile.version} id="version" />
						</td>
						<td><button className="button button-primary" onClick={this.props.updateVersion.bind(null, this.props.profile.projID)}>Update</button></td>
					</tr>
					<tr>
						<td>CREATED</td>
						<td>
							{this.props.profile.submitted}
						</td>
						<td></td>
					</tr>
				</tbody></table>
			</div>
		);
	}
});

var ModuleView = React.createClass({
	render : function() {
		return (
			<div className="row">
				<table><tbody>
					<tr>
						<td>Module ID</td>
						<td>{this.props.profile.moduleID}</td>
						<td></td>
					</tr>
					<tr>
						<td>NAME</td>
						<td><input type="text" id="name" key={"10."+this.props.ver} defaultValue={this.props.profile.name} /></td>
						<td><button className="button button-primary" onClick={this.props.updateName.bind(null, this.props.profile.moduleID)}>Update</button></td>
					</tr>
				</tbody></table>
			</div>
		);
	}
});

var BugView = React.createClass({
	render : function() {
		var comments = this.props.profile.COMMENTS.map(function(comment, i) {
			return (
				<tr>
					<td>{comment.author}</td>
					<td>{comment.comment}</td>
					<td>{comment.submitted}</td>
				</tr>
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

		var developers = this.props.profile.ALLDEVS.map(function(dev, i) {
			return (
				<option value={dev.userID}>{dev.name}</option>
			);
		});

		var modules = this.props.profile.ALLMODS.map(function(mod, i) {
			return (
				<option value={mod.moduleID}>{mod.name}</option>
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
						<select id="status" defaultValue={this.props.profile.status} onChange={this.props.changeState.bind(null, this.props.profile.bugID)}>
							<option value="2">Unread</option>
							<option value="1">WIP</option>
							<option value="4">Completed</option>
							<option value="5">Scrapped</option>
							<option value="3">OnHold</option>
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
						<table><tbody>
							<tr>
								<td>TYPE</td>
								<td>
									<select id="type" key={"1."+this.props.ver} defaultValue={this.props.profile.theType} onChange={this.props.changeType.bind(null, this.props.profile.bugID)}>
										<option value="none">none</option>
										<option value="cosmetic">cosmetic</option>
										<option value="usability">usability</option>
										<option value="functional">functional</option>
									</select>
								</td>
							</tr>
							<tr>
								<td>MODULE</td>
								<td>
									<select id="module" key={"2."+this.props.ver} defaultValue={this.props.profile.module} onChange={this.props.changeModule.bind(null, this.props.profile.bugID)}>
										<option value="0">none</option>
										{modules}
									</select>
								</td>
							</tr>
							<tr>
								<td>DEV</td>
								<td>
									<select id="dev" key={"3."+this.props.ver} defaultValue={this.props.profile.dev} onChange={this.props.changeDev.bind(null, this.props.profile.bugID)}>
										<option value="none">none</option>
										{developers}
									</select>
								</td>
							</tr>
							<tr>
								<td>BROWSER</td>
								<td>
									<select id="browser" key={"5."+this.props.ver} defaultValue={this.props.profile.theType} onChange={this.props.changeBrowser.bind(null, this.props.profile.bugID)}>
										<option value="none">none</option>
										<option value="chrome">chrome</option>
										<option value="firefox">firefox</option>
										<option value="opera">opera</option>
										<option value="safari">safari</option>
										<option value="IE9+">IE9+</option>
										<option value="IE8-">IE8-</option>
										<option value="AndroidChrome">AndroidChrome</option>
										<option value="AndroidFF">AndroidFF</option>
										<option value="IOS">IOS</option>
									</select>
								</td>
							</tr>
						</tbody></table>
					</div>
					<div className="seven columns">
						<h5>Description</h5>
						<textarea key={"4."+this.props.ver} id="description" defaultValue={this.props.profile.description}></textarea>
						<button className="button button-primary" onClick={this.props.updateDescription.bind(null, this.props.profile.bugID)}>Update</button>
						<span id="descupdate"></span>
					</div>
				</div>
				<div className="row">
					<h5>Comments</h5>
					<table><tbody>
						<tr>
							<th>USER</th>
							<th>COMMENT</th>
							<th>WHEN</th>
						</tr>
						{comments}
						<tr>
							<td>YOU</td>
							<td><textarea id="commentbox"></textarea></td>
							<td><button className="button button-primary" onClick={this.props.sendComment.bind(null, this.props.profile.bugID)}>Submit</button></td>
						</tr>
					</tbody></table>
				</div>
			</div>
		);
	}
});