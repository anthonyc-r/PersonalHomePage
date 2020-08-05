<?php
    //DB creds and info
    $host = DB_HOST;
    $usr_name = DB_UNAME;
    $passw = DB_PASS;
    $db = 'email_db';
    $table = 'users';
	
    //User info
    $name = $_REQUEST['name'];  

    //Connect to database
    $sql_conn = mysql_pconnect($host, $usr_name, $passw) or die(mysql_error());
    $sql_db = mysql_select_db($db) or die(mysql_error());
    
    //Get info
    $get_img = sprintf('SELECT image_bin FROM user_info, user_email WHERE user_info.user_id = user_email.user_id AND user_info.user_name="%s"', 
        mysql_real_escape_string($name));
    
    //Run query
    $user_data_result = mysql_query($get_img) or die(mysql_error());
    $user_data = mysql_fetch_array($user_data_result); 
    
    $email_image = $user_data[0];

    if($email_image){
        header("Content-type: image/png");
         echo $email_image;
    }
    else{
        echo "User Not Found";
    }
    //Destroy conn
    mysql_close();
?>
