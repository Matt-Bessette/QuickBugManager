<?php
	//session_start();
	if(true) {
		$con = new PDO("mysql:host=localhost;dbname=BUGS", "root", "Apple A Day");

		try {
			switch($_SERVER['REQUEST_METHOD']) {
				case "GET":
					getActions($con, $_GET['action'], $_GET['val1'], 1);
				break;
				case "POST":
					postActions($con, $_GET['action'], $_GET['val1'], 1, $_POST);
				break;
				case "PUT":
					putActions($con, $_GET['action'], $_GET['val1'], 1);
				break;
				case "DELETE":
					deleteActions($con, $_GET['action'], $_GET['val1'], 1);
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

	function getActions($con, $action, $val1, $user) {
		switch($action) {
			case "all-projects":
				$stmt = $con->prepare(
					"SELECT projects.projID, users.name as owner, projects.name, projects.version, projects.submitted 
					FROM projects, users 
					WHERE projects.userID = users.userID
					ORDER BY projects.name ASC"
				);
				$stmt->execute();
				echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
			break;

			case "project-profile":
				$stmt = $con->prepare(
					"SELECT users.name as owner, projects.name, projects.version, projects.submitted
					FROM projects, users
					WHERE projects.userID = users.userID AND projects.projID = ?"
				);
				$stmt->execute(array($val1));
				$prof = $stmt->fetch(PDO::FETCH_ASSOC);
				$stmt = $con->prepare("SELECT moduleID, name FROM modules WHERE projID = ?");
				$stmt->execute(array($val1));
				$prof['MODULES'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
				echo json_encode($prof);
			break;

			case "project-bugs":
				$stmt = $con->prepare(
					"SELECT bugs.bugID, modules.name as module, users.name as dev, bugs.browser, bugs.type, bugs.status, bugs.submitted
					FROM bugs
					INNER JOIN modules ON modules.moduleID = bugs.moduleID
					INNER JOIN users ON users.userID = bugs.dev
					WHERE bugs.projID = ?"
				);
				$stmt->execute(array($val1));
				echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
			break;

			case "bug-profile":
				$stmt = $con->prepare(
					"SELECT bugs.bugID, projects.name as project, bugs.projID, users.name as owner, bugs.dev, bugs.submitted, bugs.status, bugs.type, bugs.description, bugs.browser, modules.name as module
					FROM bugs
					INNER JOIN projects ON projects.projID = bugs.projID
					INNER JOIN modules ON modules.moduleID = bugs.moduleID
					INNER JOIN users ON users.userID = bugs.maker
					WHERE bugs.bugID = ?"
				);
				$stmt->execute(array($val1));
				$prof = $stmt->fetch(PDO::FETCH_ASSOC);

				$stmt = $con->prepare(
					"SELECT tagID, tag FROM tags WHERE bugID = ?"
				);
				$stmt->execute(array($val1));
				$prof['TAGS'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

				$stmt = $con->prepare(
					"SELECT comments.commentID, users.name as author, comments.comment, comments.submitted
					FROM comments
					INNER JOIN users ON users.userID = comments.userID
					WHERE comments.bugID = ?"
				);
				$stmt->execute(array($val1));
				$prof['COMMENTS'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

				echo json_encode($prof);
			break;

			case "project-modules":
				$stmt = $con->prepare(
					"SELECT moduleID, name FROM modules WHERE projID = ?"
				);
				$stmt->execute(array($val1));
				echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
			break;

			/*REVIEW, UNKNOWN HOW TO PROCEED*/

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
			case "bug-state-unread":	// 1
				$stmt = $con->prepare("UPDATE bugs SET state = 1 WHERE bugID = ?");
				$stmt->execute(array($val1));
				echo json_encode(array("ok"=>"bug_updated"));
			break;
			case "bug-state-wip":		// 2
				$stmt = $con->prepare("UPDATE bugs SET state = 2 WHERE bugID = ?");
				$stmt->execute(array($val1));
				echo json_encode(array("ok"=>"bug_updated"));
			break;
			case "bug-state-scrapped":	// 4
				$stmt = $con->prepare("UPDATE bugs SET state = 4 WHERE bugID = ?");
				$stmt->execute(array($val1));
				echo json_encode(array("ok"=>"bug_updated"));
			break;
			case "bug-state-complete":	// 3
				$stmt = $con->prepare("UPDATE bugs SET state = 3 WHERE bugID = ?");
				$stmt->execute(array($val1));
				echo json_encode(array("ok"=>"bug_updated"));
			break;
			case "bug-state-hold":		// 5
				$stmt = $con->prepare("UPDATE bugs SET state = 5 WHERE bugID = ?");
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
				$con->beginTransaction();
				$stmt = $con->prepare("DELETE FROM bugs WHERE bugID = ?");
				if($stmt->execute(array($val1)) !== true) $con->rollback();
				$stmt = $con->prepare("DELETE FROM comments WHERE bugID = ?");
				if($stmt->execute(array($val1)) !== true) $con->rollback();
				$stmt = $con->prepare("DELETE FROM tags WHERE bugID = ?");
				if($stmt->execute(array($val1)) !== true) $con->rollback();
				$con->commit();
				echo json_encode(array("ok"=>"bug_deleted"));
			break;

			case "project":
				$stmt = $con->prepare("DELETE FROM projects WHERE projID = ?");
				$stmt->execute(array($val1));
				echo json_encode(array("ok"=>"project_deleted"));
			break;

			case "comment":
				$stmt = $con->prepare("DELETE FROM comments WHERE commentID = ?");
				$stmt->execute(array($val1));
				echo json_encode(array("ok"=>"comment_deleted"));
			break;

			case "tag":
				$stmt = $con->prepare("DELETE FROM tags WHERE tagID = ?");
				$stmt->execute(array($val1));
				echo json_encode(array("ok"=>"tag_deleted"));
			break;

			case "module":
				$stmt = $con->prepare("DELETE FROM modules WHERE moduleID = ?");
				$stmt->execute(array($val1));
				echo json_encode(array("ok"=>"module_deleted"));
			break;

			default:
				header("HTTP/1.1 400", true, 400);
				echo json_encode(array("error"=>"Action not supported"));
		}
	}
?>