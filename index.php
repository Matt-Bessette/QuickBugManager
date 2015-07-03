<?php
	if(isset(
		$_POST['BROWSER'], $_POST['APP'], $_POST['TYPE'], $_POST['DESC'], $_POST['INIT']
	)) {
		$con = new PDO("mysql:host=localhost;dbname=BUGS", "root", "Apple A Day");
		$stmt = $con->prepare("INSERT INTO bugs (bugType, browser, app, description, initials, submissionTime) VALUES (?, ?, ?, ?, ?, ?)");
		if(
			$stmt->execute(
				array(
					filter_var($_POST['TYPE'], FILTER_SANITIZE_STRING),
					filter_var($_POST['BROWSER'], FILTER_SANITIZE_STRING),
					filter_var($_POST['APP'], FILTER_SANITIZE_STRING),
					filter_var($_POST['DESC'], FILTER_SANITIZE_STRING),
					filter_var($_POST['INIT'], FILTER_SANITIZE_STRING),
					date("Y-m-d H:i:s")
				)
			) !== true
		) {
			echo "A server error has occured...";
		} else echo "Bug submitted!";
	}
?>
<html>
	<head>
		<link rel="stylesheet" type="text/css" href="normalize.css">
		<link rel="stylesheet" type="text/css" href="skeleton.css">
	</head>
	<body>
		<div class="container">
			<div class="six columns offset-by-three">
				<form action="index.php" method="POST">
					<h4>Bug submission</h4>
					<hr>
					<div class="row">
						<legend>Browser</legend>
						<select class="u-full-width" name="BROWSER" value="<?php echo $_POST['BROWSER']; ?>">
							<option value="IE">Internet Explorer</option>
							<option value="FF">Firefox</option>
							<option value="GC">Google Chrome</option>
							<option value="OP">Opera</option>
							<option value="SF">Safari</option>
						</select>
					</div>

					<div class="row">
						<legend>App</legend>
						<select class="u-full-width" name="APP" value="<?php echo $_POST['APP']; ?>">
							<option value="FB">Form Builder</option>
							<option value="FV">Form Viewer</option>
							<option value="EX">Exporter</option>
							<option value="UM">User Manager</option>
							<option value="AM">Account Manager</option>
							<option value="FM">File Manager</option>
						</select>
					</div>

					<div class="row">
						<legend>Type of Bug</legend>
						<input type="radio" name="TYPE" value="view" /> Cosmetic<br/>
						<input type="radio" name="TYPE" value="use" /> Usability<br/>
						<input type="radio" name="TYPE" value="func" /> Functionality
					</div>

					<div class="row">
						<legend>Description</legend>
						<textarea class="u-full-width" name="DESC" placeholder="Enter the bug here..."></textarea>
					</div>

					<div class="row">
						<legend>Initials of Submiter</legend>
						<input type="text" class="u-full-width" name="INIT" placeholder="JBD" value="<?php echo $_POST['INIT']; ?>" />
					</div>

					<div class="row">
						<input type="submit" class="u-full-width button-primary" name="submit" />
					</div>
				</form>
			</div>
		</div>
	</body>
</html>