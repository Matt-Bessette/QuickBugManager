var App = React.createClass({
	getIntialState : function() {
		return({
			view : null,
			allBugs : null,

			selBug : null
		});
	},
	getBugs : function() {
		var ctx = this;
		var bugs = $.get("actions.php?action=all-list");
		bugs.done(function(json) {
			var allBugs = $.parseJSON(json);
			var unreadA = [];
			var wipA = [];
			var completeA = [];
			var scrappedA = [];
			$.each(allBugs, function(k, bug){
				if(bug.state === "state-unread")
					unreadA.push(bug);
				else if(bug.state === "state-wip")
					wipA.push(bug);
				else if(bug.state === "state-complete")
					completeA.push(bug);
				else if(bug.state === "state-scrapped")
					scrappedA.push(bug);
			});
			ctx.setState({allBugs : wipA.concat(unreadA).concat(completeA).concat(scrappedA)});
		});
		bugs.fail(function() {
			console.log("Error getting bugs");
		});
	},
	loadView : function(bugID) {
		var ctx = this;
		var view = $.get("actions.php?action=single&val1="+bugID);
		view.done(function(json) {
			var theView = $.parseJSON(json);
			ctx.setState({view : theView});
			ctx.getBugs();
		});
		view.fail(function(){
			console.log("Error loading view");
		});
	},
	componentDidMount : function() {
		this.getBugs();
	},
	render : function() {

		if(this.state !== null && this.state.allBugs !== null) {
			return(
				<div className="container">
					<BugsList loadView={this.loadView} allBugs={this.state.allBugs} />
					<BugView loadView={this.loadView}  view={this.state.view} />
				</div>
			);
		} else {
			return (<div></div>);
		}
	}
});

var BugsList = React.createClass({
	render : function() {
		var ctx = this;
		var bugs = this.props.allBugs.map(function(bug) {
			return(
				<li className={"bugObject2 u-full-width "+bug.state} onClick={ctx.props.loadView.bind(null, bug.bugID)}>
					{"#"+bug.bugID+" - "+bug.bugType+" - "+bug.browser+" - "+bug.app+" - "+bug.initials}<br/>{bug.submissionTime}
				</li>
			);
		});

		return (
			<div className="four columns">
				<ul>
					{bugs}
				</ul>
			</div>
		);
	}
});

var BugView = React.createClass({
	sendComment : function() {
		var ctx = this;
		var send = $.ajax({
			type : "POST",
			url : "actions.php?action=comment&val1="+ctx.props.view.bugID,
			data : {COMMENT : $("#commentBox").val(), INIT : $("#initalBox").val()}
		});
		send.done(function(json) {
			ctx.props.loadView(ctx.props.view.bugID);
			$("#commentBox").val("");
		});
		send.fail(function(){
			console.log("Error sending comment");
		});
	},
	updateState : function(state) {
		var ctx = this;
		var update = $.ajax({
			type : "PUT",
			url : "actions.php?action="+state+"&val1="+this.props.view.bugID
		});
		update.done(function(){
			ctx.props.loadView(ctx.props.view.bugID);
		});
		update.fail(function(){
			console.log("Error updating state");
		});
	},
	render : function() {
		console.log(this.props.view);
		if(this.props.view !== null && this.props.view !== undefined) {
			var comments = this.props.view.comments.map(function(comment){
				return(
					<div className="row comment edit">
						<p>Author: {comment.initials}<br/>
						Submitted: {comment.submissionTime}</p>
						<p>{comment.comment}</p>
					</div>
				);
			});
			var theState = this.props.view.state.split('-');
			theState = theState[1];
			return(
				<div className="eight columns view">
					<div className="row">
						<div className="six columns styling">
							<h3>{"#"+this.props.view.bugID + " - " + theState}</h3>
							<p>Author: {this.props.view.initials}<br/>
							App: {this.props.view.app}<br/>
							Browser: {this.props.view.browser}<br/>
							Submitted: {this.props.view.submissionTime}</p>
						</div>
						<div className="six columns pad">
							<button className="button bugObject state-unread" onClick={this.updateState.bind(null, "state-unread")}>Unread</button><br/>
							<button className="button bugObject state-wip" onClick={this.updateState.bind(null, "state-wip")}>Work In Progress</button><br/>
							<button className="button bugObject state-complete" onClick={this.updateState.bind(null, "state-complete")}>Completed</button><br/>
							<button className="button bugObject state-scrapped" onClick={this.updateState.bind(null, "state-scrapped")}>Scrapped</button>
						</div>
					</div>
					<div className="row">
						<h4>Description</h4>
						<p>{this.props.view.description}</p>
					</div>
					<div className="row">
						<h4>Comments</h4>
						<div className="ten columns offset-by-one">
							{comments}
							<div className="row">
								<textarea className="u-full-width" placeholder="Enter your comment here..." id="commentBox"></textarea>
								<input type="text" className="" id="initalBox" placeholder="JFK" /> <button className="button button-primary" onClick={this.sendComment.bind(null, this.props.view.bugID)}>Submit</button>
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return(<div></div>);
		}
	}
});