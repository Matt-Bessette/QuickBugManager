<?php
	session_start();
	if(isset($_SESSION['userID'])) {
		$con = new PDO("mysql:host=localhost;dbname=BUGS", "root", "Apple A Day");

		switch($_SERVER['REQUEST_METHOD']) {
			case "GET":
				getActions($con, $_GET['action'], $_GET['val1']);
			break;
			case "POST":
				postActions($con, $_GET['action'], $_GET['val1'], $_POST);
			break;
			case "PUT":
				putActions($con, $_GET['action'], $_GET['val1']);
			break;
			case "DELETE":
				deleteActions($con, $_GET['action'], $_GET['val1']);
			break;
			default:
				echo json_encode(array("error"=>"Method not supported"));

		}
	} else {
		echo json_encode(array("error"=>"User must be logged in"));
	}

	function getActions($con, $action, $val1) {
		switch($action) {
			case "all-projects":
				$stmt = $con->prepare(
					"SELECT projects.projID, users.name as owner, projects.name, projects.version, projects.submitted, projects.locked 
					FROM projects, users 
					WHERE projects.userID = users.userID"
				);
				$stmt->execute();
				echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
			break;

			case "bugs":
				$stmt = $con->prepare(
					"SELECT COALESCE(bugs.projID, '') + '-' + COALESCE(bugs.bugID, '') as ID, modules.name, users.name, bugs.browser, bugs.type, bugs.status
					FROM bugs, modules, users
					WHERE bugs.moduleID = modules.moduleID AND bugs.projID = modules.projID AND users.userID = bugs.mod"
				);
				$stmt->execute();
				echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
			break;

			case "single":
				$val = explode()
			break;
			default:
				echo json_encode(array("error"=>"Action not supported"));
		}
	}

	function postActions($con, $action, $val1, $pdata) {
		switch($action) {
			case "comment":
				$stmt = $con->prepare("INSERT INTO comments (bugID, initials, comment, submissionTime) VALUES (?, ?, ?, ?)");
				$stmt->execute(array(
					filter_var($val1, FILTER_SANITIZE_STRING),
					filter_var($_POST['INIT'], FILTER_SANITIZE_STRING),
					filter_var($_POST['COMMENT'], FILTER_SANITIZE_STRING),
					date("Y-m-d H:i:s")
				));
			break;
			default:
				echo json_encode(array("error"=>"Action not supported"));
		}
	}

	function putActions($con, $action, $val1) {
		switch($action) {
			case "state-unread":	// 0
				$stmt = $con->prepare("UPDATE bugs SET state = 'state-unread' WHERE bugID = ?");
				$stmt->execute(array($val1));
				echo json_encode(array("ok"=>"Success"));
			break;
			case "state-wip":		// 1
				$stmt = $con->prepare("UPDATE bugs SET state = 'state-wip' WHERE bugID = ?");
				$stmt->execute(array($val1));
				echo json_encode(array("ok"=>"Success"));
			break;
			case "state-scrapped":	// 2
				$stmt = $con->prepare("UPDATE bugs SET state = 'state-scrapped' WHERE bugID = ?");
				$stmt->execute(array($val1));
				echo json_encode(array("ok"=>"Success"));
			break;
			case "state-complete":	// 3
				$stmt = $con->prepare("UPDATE bugs SET state = 'state-complete' WHERE bugID = ?");
				$stmt->execute(array($val1));
				echo json_encode(array("ok"=>"Success"));
			break;
			default:
				echo json_encode(array("error"=>"Action not supported"));
		}
	}

	function deleteActions($con, $action, $val1) {
		echo json_encode(array("error"=>"Action not supported"));
	}
?>