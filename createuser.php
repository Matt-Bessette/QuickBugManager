<?php
	//session_start(); if(!isset($_SESSION['USER_ID'], $_SESSION['USERNAME'])) header("Location: index.php");
	
	if(isset($_POST['name'], $_POST['email'], $_POST['passw'], $_POST['cpassw'])) {
		if($_POST['passw'] === $_POST['cpassw']) {
			$con = new PDO("mysql:host=localhost;dbname=BUGS", "root", "Apple A Day");
			$con->beginTransaction();
			$salt = hash("sha256", bin2hex(openssl_random_pseudo_bytes(25)) . uniqid());
			$hash = hash("sha256", $_POST['passw'].$salt);
			$stmt = $con->prepare("INSERT INTO users (email, name, hash, salt) VALUES (?, ?, ?, ?)");
			$stmt->execute(array($_POST['email'], $_POST['name'], $hash, $salt));
			$con->commit();
			$res = "Account made";
		} else $res = "Invalid password";
	} else $res = "Please fill out the fields";
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
				<form action="createuser.php" method="POST">
					<input class="u-full-width" type="text" placeholder="Username" name="name" />
					<input class="u-full-width" type="text" placeholder="Email" name="email" />
					<input class="u-full-width" type="password" placeholder="Password" name="passw" />
					<input class="u-full-width" type="password" placeholder="Confirm Password" name="cpassw" />
					<input class="button button-primary u-full-width" type="submit" name="submit" value="Submit" />
				</form>
			</div>
		</div>
	</body>
</html>