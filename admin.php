<?php
session_start();
include_once("includes/dbconnection.php");
include("includes/head.php");
//verify session variables, make sure that the user is logged in and is admin
if($_SESSION["userid"] && $_SESSION["admin"]){
   //verify user id with the one in database
   if(checkAdmin($_SESSION["userid"],$dbconnection)){
      echo "user is admin";
   }
   else{
      echo "user is not admin";
      exit();
   }
}
else{
   echo "user is not logged in";
}




//functions

?>