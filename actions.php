<?php
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

	function getActions($con, $action, $val1) {
		switch($action) {
			case "all-list":
				$stmt = $con->prepare("SELECT bugID, browser, bugType, app, submissionTime, state, initials FROM bugs");
				$stmt->execute();
				echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
			break;
			case "single":
				$stmt = $con->prepare("SELECT * FROM bugs WHERE bugID = ?");
				$stmt->execute(array($val1));
				$view = $stmt->fetch(PDO::FETCH_ASSOC);
				$stmt = $con->prepare("SELECT * FROM comments WHERE bugID = ? ORDER BY submissionTime DESC");
				$stmt->execute(array($val1));
				$view['comments'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
				echo json_encode($view);
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