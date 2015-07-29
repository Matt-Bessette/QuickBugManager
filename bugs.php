<?php	session_start(); if(!isset($_SESSION['USER_ID'], $_SESSION['USERNAME'])) header("Location: index.php"); ?>
<html>
	<head>
		<meta charset="UTF-8"> 
		<link rel="stylesheet" type="text/css" href="lib/css/normalize.css">
		<link rel="stylesheet" type="text/css" href="lib/css/skeleton.css">
		<link rel="stylesheet" type="text/css" href="bin/css/bugs.css">
		<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
		<script src="https://fb.me/react-with-addons-0.13.3.js"></script>
		<script src='bin/js/bugs_core.js'></script>
		<script src='bin/js/bugs_ajax.js'></script>
		<script src='bin/js/bugs_views.js'></script>
	</head>
	<body>
		<div id="app"></div>
	</body>
</html>