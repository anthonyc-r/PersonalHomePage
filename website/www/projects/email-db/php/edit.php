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
    //DB creds and info
	$host = DB_HOST;
	$usrName = DB_UNAME;
	$passw = DB_PASS;
	$db = 'email_db';
	$table = 'users';
	
	//Connect to database
	$sqlConn = mysql_pconnect($host, $usrName, $passw) or die(mysql_error());
	$sqlDb = mysql_select_db($db) or die(mysql_error());
    
    //User info
    $which = $_REQUEST['which'];
    $name = $_REQUEST['name'];

    //Different query depending on which version of the form is submitted
    if($which=="name" && $name && $_REQUEST['newname']){
        $newname = $_REQUEST['newname'];

        //In the case of altering names, check for a existing name entry
         $dupCheck = sprintf('SELECT user_name FROM user_info WHERE user_name="%s"',
             mysql_real_escape_string($newname));
        $result = mysql_fetch_array(mysql_query($dupCheck));
        if($result[0]){
            die("Duplicate name found in the database.");
        }

        $queries[0] = sprintf('UPDATE user_info SET user_name="%s" WHERE user_name="%s"', 
            mysql_real_escape_string($newname), mysql_real_escape_string($name));
    }
    else if($which=="email" && $name && $_REQUEST['newemail']){
        $newemail = $_REQUEST['newemail'];

        //Gen new image
        $imgType = 'png';
        $emailImg = imagecreatefrompng('../img/blank_email.png');
        $black = imagecolorallocate($emailImg, 0, 0, 0);
        imagestring($emailImg, 5, 12, 12, $newemail, $black);
        ob_start();
        imagepng($emailImg);
        $email_bin = ob_get_contents();
        ob_clean();
        
        $queries[0] = sprintf('UPDATE user_info, user_email SET user_email.image_bin="%s" WHERE user_email.user_id=user_info.user_id AND user_info.user_name="%s"', 
            mysql_real_escape_string($email_bin), mysql_real_escape_string($name));
    }
    //Checks for existance of fields failed
    else{
        die("Required field not complete.");
    }
   
    //Queries to run
    foreach($queries as $query){
        mysql_query($query) or die(mysql_error()); 
    }

    //Check if anything was updated
    if(mysql_affected_rows() == 0){
        echo $name." not found in our database.";
    }
    else{
        echo $which." successfully edited for user ".$name.".";
    }

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
