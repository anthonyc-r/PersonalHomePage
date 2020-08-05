<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="author" content="Anthony Cohn-Richardby">
  <title>Home</title>
  <link href='http://fonts.googleapis.com/css?family=Signika+Negative' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" type="text/css" href="../style/style.css">
</head>

<body>
  <!--Wrapper-->
  <div id="wrapper">
  
  <!--Main header-->
  <header>
    <h1>Email Database</h1>
  </header>

  <!--Main Nav-->
  <nav class="main">
    <ul>
      <li><a href="../New_User/New_User.html">New User</a></li>
      <li><a href="../Existing_User/Recover.html">Existing User</a></li>
    </ul>
  </nav>

  <!--Article explaining purpose and use-->
  <article>
    <?php
    
    $MAX_USERS = 100;

    //DB creds and info
	$host = DB_HOST;
	$usrName = DB_UNAME;
	$passw = DB_PASS;
	$db = 'email_db';
	$table = 'users';
	
	//User info
    $name = $_REQUEST['newname'];
	$email = $_REQUEST['newemail'];
    
    //Validate input
    if(!$name || !$email){
        die("No name/email input.");
    }

    //Generate email image
    $imgType = 'png';
    $emailImg = imagecreatefrompng('../img/blank_email.png');
    $black = imagecolorallocate($emailImg, 0, 0, 0);
    imagestring($emailImg, 5, 12, 12, $email, $black);

    //Output image to buffer, then save the contents of the buffer for storage
    ob_start();
    imagepng($emailImg); 
    $email_bin = ob_get_contents();
    ob_clean();

	//Connect to database
	$sqlConn = mysql_pconnect($host, $usrName, $passw) or die(mysql_error());
	$sqlDb = mysql_select_db($db) or die(mysql_error());
    
    //check number of emails stored - need to limit this to prevent abuse
    $numCheck = "SELECT COUNT(*) FROM user_info";
    $result = mysql_fetch_array(mysql_query($numCheck));
    if(!$result){
        die("Failed to count the number of existing users");
    }
    elseif($result[0] > $MAX_USERS) {
    	$refreshUsers = "DELETE FROM user_info WHERE TRUE";
		$refreshImgs = "DELETE FROM user_email WHERE TRUE";
		mysql_query($refreshUsers);
		mysql_query($refreshImgs);
    }

    //Check for a duplicate name
    $dupCheck = sprintf('SELECT user_name FROM user_info WHERE user_name="%s"',
        mysql_real_escape_string($name));
    $result = mysql_fetch_array(mysql_query($dupCheck));
    if($result[0]){
        die("Duplicate name found in the database.");
    }

    //Queries to run
    $queries[0] = sprintf('INSERT INTO user_info (user_name) VALUES ("%s")', 
        mysql_real_escape_string($name));
    $queries[1] = sprintf('INSERT INTO user_email (image_type, image_bin) VALUES ("%s", "%s")', 
        mysql_real_escape_string($imgType), mysql_real_escape_string($email_bin));
    
   	//Run queries
    foreach($queries as $query){
        mysql_query($query) or die(mysql_error());
    }

    //Clear image memory
    imagedestroy($emailImg);

    echo sprintf("Inserted new user: %s <br /><br />", $name);
    echo "To access your image go to: <br />";
    //Print out a relative link to the image for portability
    $thisPage = $_SERVER['SERVER_NAME'].$_SERVER['PHP_SELF'].sprintf("?name=%s", $name);
    $requestPage = str_replace("newUser.php", "recover.php", $thisPage);
    echo $requestPage;

	//End connection
	mysql_close();

    ?>
  </article>

  <!--Footer-->
  <footer>
    <p>Page written by Anthony Cohn-Richardby. Last updated 2014.</p>
  </footer>

  <!--End Wrapper-->
  </div>
</body>
