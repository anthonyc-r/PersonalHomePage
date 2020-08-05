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
    //DB creds and info. Ensure config.php is included in ini.
	$host = DB_HOST;
	$usrName = DB_UNAME;
	$passw = DB_PASS;
	$db = 'email_db';
	$table = 'users';
	//User info
        $name = $_REQUEST['name'];

	//Connect to database
	$sqlConn = mysql_pconnect($host, $usrName, $passw) or die(mysql_error());
	$sqlDb = mysql_select_db($db) or die(mysql_error());

    //Query to run
    $query = sprintf('DELETE user_info, user_email FROM user_info, user_email WHERE user_info.user_id=user_email.user_id AND user_info.user_name="%s"',
        mysql_real_escape_string($name));
    mysql_query($query) or die(mysql_error());
    
    //Check if it deleted anything
    if(mysql_affected_rows() == 0){
        echo $name." not found in our database.";
    }
    else{
        echo $name." deleted from our database.";
    }

	//End connection
	mysql_close();

    ?>
  </article>

  <!--Footer-->
  <footer>
    <p>Page written by Anthony Cohn-Richardby. Last updated 2020.</p>
  </footer>

  <!--End Wrapper-->
  </div>
</body>
