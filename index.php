<?php	session_start(); if(isset($_SESSION['USER_ID'], $_SESSION['USERNAME'])) header("Location: bugs.php"); 

	if(isset($_POST['email'], $_POST['passw'])) {
		$con = new PDO("mysql:host=localhost;dbname=BUGS", "root", "Apple A Day");
		$stmt = $con->prepare("SELECT userID, name, hash, salt FROM users WHERE email = ?");
		$stmt->execute(array($_POST['email']));
		$profile = $stmt->fetch(PDO::FETCH_ASSOC);
		if(hash("sha256", $_POST['passw'].$profile['salt']) === $profile['hash']) {
			$_SESSION['USER_ID'] = $profile['userID'];
			$_SESSION['USERNAME'] = $profile['name'];
			header("Location: bugs.php");
		} else $res = "Invalid username or password";
	} else $res = "Please login";
?>
<html>
	<head>
		<link rel="stylesheet" type="text/css" href="lib/css/normalize.css">
		<link rel="stylesheet" type="text/css" href="lib/css/skeleton.css">
	</head>
	<body>
		<div class="container" style="margin-top:20px">
			<div class="six columns offset-by-three">
				<h5><?php echo $res; ?></h5>
				<form action="index.php" method="POST">
					<input class="u-full-width" type="text" placeholder="Email" name="email" />
					<input class="u-full-width" type="password" placeholder="Password" name="passw" />
					<input class="button button-primary u-full-width" type="submit" name="submit" value="Submit" />
				</form>
			</div>
		</div>
	</body>
</html>