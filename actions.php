<?php
	session_start();
	if(isset($_SESSION['userID'])) {
		$con = new PDO("mysql:host=localhost;dbname=BUGS", "root", "Apple A Day");

		try {
			switch($_SERVER['REQUEST_METHOD']) {
				case "GET":
					getActions($con, $_GET['action'], $_GET['val1'], $_SESSION['userID']));
				break;
				case "POST":
					postActions($con, $_GET['action'], $_GET['val1'], $_SESSION['userID']) $_POST);
				break;
				case "PUT":
					putActions($con, $_GET['action'], $_GET['val1'], $_SESSION['userID']));
				break;
				case "DELETE":
					deleteActions($con, $_GET['action'], $_GET['val1'], $_SESSION['userID']));
				break;
				default:
					echo json_encode(array("error"=>"Method not supported"));

			}
		} catch(Exception $e) {
			header("HTTP/1.1 400", true, 400);
			echo json_encode(array("error"=>$e->getMessage()));
		}
	} else {
		header("HTTP/1.1 400", true, 400);
		echo json_encode(array("error"=>"User must be logged in"));
	}

	function getActions($con, $action, $user, $val1) {
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

			case "project-bugs":
				$stmt = $con->prepare(
					"SELECT bugs.projID, bugs.bugID, modules.name as module, users.name as dev, bugs.browser, bugs.type, bugs.status
					FROM bugs
					INNER JOIN modules ON modules.moduleID = bugs.moduleID
					INNER JOIN users ON users.userID = bugs.dev"
				);
				$stmt->execute();
				echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
			break;

			case "bug-profile":
				$stmt = $con->prepare(
					"SELECT project.name, bugs.projID, bugs.bugID, users.name as owner, bugs.dev, bugs.submitted, bugs.status, bugs.type, bugs.description, bugs.browser, modules.name as module
					FROM bugs
					INNER JOIN modules ON modules.moduleID = bugs.moduleID
					INNER JOIN users ON users.userID = bugs.owner
					WHERE AND bugID = ?"
				);
				$stmt->execute(array($val1));
				echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
			break;

			case "bug-tags":
				$stmt = $con->prepare(
					"SELECT tag FROM tags WHERE bugID = ?"
				);
				$stmt->execute(array($val1));
				$data = array();
				foreach($stmt->fetch(PDO::FETCH_ASSOC) as $k=>$v)
					$data[] = $v['tag'];
				echo json_encode($data);
			break;

			case "comments":
				$stmt = $con->prepare(
					"SELECT comments.bugID, comments.projID, comments.commentID, users.name as author, comments.comment, comments.submitted
					FROM comments
					INNER JOIN users ON users.userID = comments.userID
					WHERE bugID = ?"
				);
				$stmt->execute(array($val1));
				echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
			break;

			case "modules":
				$stmt = $con->prepare(
					"SELECT name FROM modules WHERE projID = ?"
				);
				$stmt->execute(array($val1));
				$data = array();
				foreach($stmt->fetch(PDO::FETCH_ASSOC) as $k=>$v)
					$data[] = $v['name'];
				echo json_encode($data);
			break;

			case "tag-bugs":
				$stmt = $con->prepare(
					"SELECT bugs.projID, bugs.bugID, modules.name as module, users.name as dev, bugs.browser, bugs.type, bugs.status
					FROM tags
					INNER JOIN bugs ON bugs.bugID = tags.bugID
					INNER JOIN modules ON modules.moduleID = bugs.moduleID
					INNER JOIN users ON users.userID = bugs.dev
					WHERE tags.tag LIKE ?"
				);
				$stmt->execute(array("%".$val."%"));
				echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
			break;
			default:
				header("HTTP/1.1 400", true, 400);
				echo json_encode(array("error"=>"Action not supported"));
		}
	}

	/*
		TODO: CHECK FOR FIELDS IN POST
	*/

	function postActions($con, $action, $val1, $user, $pdata) {
		switch($action) {
			case "new-bug":
				$stmt = $con->prepare("INSERT INTO bugs (projID, creator, dev, description, browser, type, submitted, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
				$stmt->execute(array(
					$val1,
					$user,
					0,
					$pdata['DESCRIPTION'],
					$pdata['BROWSER'],
					$pdata['TYPE'],
					date("Y-m-d H:i:s"),
					"unread"
				));
				echo json_encode(array("ok"=>"bug_created", "id"=>$stmt->lastInsertId));
			break;

			case "new-comment":
				$stmt = $con->prepare("INSERT INTO comments (bugID, userID, comment, submitted) VALUES (?, ?, ?, ?)");
				$stmt->execute(array(
					$val1,
					$user,
					$pdata['COMMENT'],
					date("Y-m-d H:i:s")
				));
				echo json_encode(array("ok"=>"comment_created", "id"=>$stmt->lastInsertId));
			break;

			case "new-project":
				$stmt = $con->prepare("INSERT INTO projects (name, userID, version, submitted) VALUES (?, ?, ?, ?)");
				$stmt->execute(array(
					$pdata['NAME'],
					$user,
					$pdata['VERSION'],
					date("Y-m-d H:i:s")
				));
				echo json_encode(array("ok"=>"project_created", "id"=>$stmt->lastInsertId));
			break;

			case "new-module":
				$stmt = $con->prepare("INSERT INTO modules (projID, name) VALUES (?, ?)");
				$stmt->execute(array($val1, $pdata['NAME']));
				echo json_encode(array("ok"=>"module_created", "id"=>$stmt->lastInsertId));
			break;

			case "new-tag":
				$stmt = $con->prepare("INSERT INTO tages (bugID, tag) VALUES (?, ?)");
				$stmt->execute(array($val1, $pdata['TAG']));
				echo json_encode(array("ok"=>"tag_created"));
			break;

			case "edit-bug-description":
				$stmt = $con->prepare("UPDATE bugs SET description = ? WHERE bugID = ?");
				$stmt->execute(array($pdata['DESCRIPTION']), $val1);
				echo json_encode(array("ok"=>"bug_updated"));
			break;

			case "edit-bug-dev":
				$stmt = $con->prepare("UPDATE bugs SET dev = ? WHERE bugID = ?");
				$stmt->execute(array($pdata['DEV']), $val1);
				echo json_encode(array("ok"=>"bug_updated"));
			break;

			case "edit-bug-browser":
				$stmt = $con->prepare("UPDATE bugs SET browser = ? WHERE bugID = ?");
				$stmt->execute(array($pdata['BROWSER']), $val1);
				echo json_encode(array("ok"=>"bug_updated"));
			break;

			case "edit-bug-type":
				$stmt = $con->prepare("UPDATE bugs SET type = ? WHERE bugID = ?");
				$stmt->execute(array($pdata['TYPE']), $val1);
				echo json_encode(array("ok"=>"bug_updated"));
			break;

			case "edit-comment-description":
				$stmt = $con->prepare("UPDATE comments SET comment = ? WHERE commentID = ?");
				$stmt->execute(array($pdata['COMMENT'], $val1));
				echo json_encode(array("ok"=>"comment_updated"));
			break;

			case "edit-project-name":
				$stmt = $con->prepare("UPDATE projects SET name = ? WHERE projID = ?");
				$stmt->execute(array($pdata['NAME'], $val1));
				echo json_encode(array("ok"=>"project_updated"));
			break;

			case "edit-project-version":
				$stmt = $con->prepare("UPDATE projects SET version = ? WHERE projID = ?");
				$stmt->execute(array($pdata['NAME'], $val1));
				echo json_encode(array("ok"=>"project_updated"));
			break;

			case "edit-module-name":
				$stmt = $con->prepare("UPDATE modules SET name = ? WHERE projID = ?");
				$stmt->execute(array($pdata['NAME'], $val1));
				echo json_encode(array("ok"=>"module_updated"));
			break;

			default:
				header("HTTP/1.1 400", true, 400);
				echo json_encode(array("error"=>"Action not supported"));
		}
	}

	function putActions($con, $action, $user, $val1) {
		switch($action) {
			case "bug-state-unread":	// 0
				$stmt = $con->prepare("UPDATE bugs SET state = 'unread' WHERE bugID = ?");
				$stmt->execute(array($val1));
				echo json_encode(array("ok"=>"bug_updated"));
			break;
			case "bug-state-wip":		// 1
				$stmt = $con->prepare("UPDATE bugs SET state = 'wip' WHERE bugID = ?");
				$stmt->execute(array($val1));
				echo json_encode(array("ok"=>"bug_updated"));
			break;
			case "bug-state-scrapped":	// 2
				$stmt = $con->prepare("UPDATE bugs SET state = 'scrapped' WHERE bugID = ?");
				$stmt->execute(array($val1));
				echo json_encode(array("ok"=>"bug_updated"));
			break;
			case "bug-state-complete":	// 3
				$stmt = $con->prepare("UPDATE bugs SET state = 'complete' WHERE bugID = ?");
				$stmt->execute(array($val1));
				echo json_encode(array("ok"=>"bug_updated"));
			break;
			case "bug-state-hold":
				$stmt = $con->prepare("UPDATE bugs SET state = 'hold' WHERE bugID = ?");
				$stmt->execute(array($val1));
				echo json_encode(array("ok"=>"bug_updated"));
			break;
			default:
				header("HTTP/1.1 400", true, 400);
				echo json_encode(array("error"=>"Action not supported"));
		}
	}

	function deleteActions($con, $action, $user, $val1) {
		switch($action) {
			case "bug":

			break;

			case "project":

			break;

			case "comment":

			break;
			default:
				header("HTTP/1.1 400", true, 400);
				echo json_encode(array("error"=>"Action not supported"));
		}
	}
?>