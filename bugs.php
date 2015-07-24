<?php	session_start(); if(!isset($_SESSION['USER_ID'], $_SESSION['USERNAME'])) header("Location: index.php"); ?>
<html>
	<head>
		<link rel="stylesheet" type="text/css" href="lib/css/normalize.css">
		<link rel="stylesheet" type="text/css" href="lib/css/skeleton.css">
		<link rel="stylesheet" type="text/css" href="bin/css/bugs.css">
		<script src='lib/js/jquery.js'></script>
		<script src='lib/js/react.js'></script>
		<script src='bin/js/bugs_core.js'></script>
		<script src='bin/js/bugs_ajax.js'></script>
		<script src='bin/js/bugs_views.js'></script>
	</head>
	<body>
		<div id="app"></div>
	</body>
</html>