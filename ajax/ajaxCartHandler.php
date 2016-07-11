<?php
//initiate session for this page
session_start();
//include database connection
include_once("../includes/dbconnection.php");
//include functions file
include_once("../includes/functions.php");
//get session token
$token = $_SESSION["token"];
//array to store errors and error messages
$errors = array();
//array to store data
$data = array();

//if there is data being submitted via POST (coming from the ajax request)
if(count($_POST)>0){
   $productid=$_POST["id"];
   $quantity=$_POST["quantity"];
   $usertoken=$_POST["token"];
}
//if no data or tokens don't match, stop the script
elseif($usertoken != $token || count($_POST)==0){
   exit();
}
//create the cart if not already existing
if(!isset($_SESSION["cart"])){
   $_SESSION["cart"] = array();
}
/*---
check if user is logged in by the existence of 
a session variable called "userid"
if user has already added item(s) to the cart, a session variable
called "tempuserid" will exist
---*/
//if user has logged in with items already in the cart
if(isset($_SESSION["userid"]) && isset($_SESSION["tempuserid"])){
   $userid = $_SESSION["userid"];
   //remove the temporary userid
   unset($_SESSION["tempuserid"]);
}
elseif(!isset($_SESSION[""])){}


   //check the tokens being submitted if it matches session token(optional)
   if($usertoken==$token){
      //create the cart if it doesn't already exist
      if(!$_SESSION["cart"]){
         $_SESSION["cart"]=array();
      }
      //if user is logged in
      if(isset($_SESSION["userid"])){
         $userid = $_SESSION["userid"];
         //remove tempuserid if it exists
         if(isset($_SESSION["tempuserid"])){
            unset($_SESSION["tempuserid"]);
         }
         $itemtoadd = array("userid"=>$_SESSION["userid"],"productid"=>$productid,"quantity"=>$quantity);
      }
      //if user is not logged in
      else{
         //create a temporary userid if it does not already exist
         //the function generateUserId() is in functions.php included above
         if(!isset($_SESSION["tempuserid"])){
            //create a temporary userid for this user
            $_SESSION["tempuserid"]="temp_".generateUserId();
         }
         $userid = $_SESSION["tempuserid"];
         $itemtoadd = array("userid"=>$_SESSION["tempuserid"],"productid"=>$productid,"quantity"=>$quantity);
      }
      //check if there are items already in the cart
      if(count($_SESSION["cart"]) > 0){
         //set a boolean so if item is already in the cart, it does not
         //get a duplicate added in the function below (array_push($_SESSION["cart"],...)
         //because we are updating only an existing item's quantity
         $itemisnew = true;
         /*------------
         iterate through each item in the cart so we can find the one that is the same as
         the one the user just clicked on, so we can update its quantity
         -------------*/
         //count number of items in the cart
         $length = count($_SESSION["cart"]);
         //loop through all items in the cart
         for($i=0;$i<$length;$i++){
            //if a cart item's productid is the same as the product id of new item
            if($_SESSION["cart"][$i]["productid"]==$itemtoadd["productid"]){
               //add the new item's quantity with the one already in the cart
               $_SESSION["cart"][$i]["quantity"] += $itemtoadd["quantity"];
               //store the new quantity in $newquantity variable
               $newquantity = $_SESSION["cart"][$i]["quantity"];
               //set itemisnew to false so that it gets updated instead of inserted
               //into the database
               $itemisnew = false;
               if(updateCartItemQuantityInDB($dbconnection,$userid,$productid,$newquantity)){
                  //return success
                  $data["success"] = true;
                  //return cart quantity
                  $data["quantity"] = countCartItemsInDB($dbconnection,$userid);
                  $data["quantity"] = count($_SESSION["cart"]);
                  returnJSONData($data,$errors);
               }
               // if database update is unsuccessful
               else{
                  //return success = false
                  $data["success"] = false;
                  //return an error message
                  $errors["message"] = "item quantity update failed";
                  //print data as json, which will be read by the client side javascript
                  returnJSONData($data,$errors);
               }
            }
         }
         //if item does not already exist in the cart
         if($itemisnew==true){
            //add it to the cart
            array_push($_SESSION["cart"],$itemtoadd);
         }
         //insert the item in the database
         if(addCartItemToDB($dbconnection,$userid,$productid,$quantity)){
            //if the query succeeds
            $data["success"]=true;
            //return the number of items in the cart
            $data["quantity"]=count($_SESSION["cart"]);
            //print data as json, which will be read by the client side javascript
            returnJSONData($data,$errors);
         }
         else{
            //if it fails send an error
            $data["success"]=false;
            //an error message
            $errors["message"]="error adding item to database";
            returnJSONData($data,$errors);
         }
         //return data to the AJAX script as JSON
         //returnJSONData($data,$errors);
      }
      //----------if cart is currently EMPTY
      else{
         array_push($_SESSION["cart"],$itemtoadd);
         if(addCartItemToDB($dbconnection,$userid,$productid,$quantity)){
            $data["success"]=true;
            $data["quantity"]=countCartItemsInDB($dbconnection,$userid);
         }
         else{
            $data["success"]=true;
            $errors["message"] = "error adding item to database";
         }
         //return data as json
         returnJSONData($data,$errors);
      }
   }
   //if tokens don't match
   else{
      //kill the script
      exit();
   }


function returnJSONData($arraydata,$arrayerrors){
   //add errors to data array
   $arraydata["errors"] = $arrayerrors;
   //return data as json
   echo json_encode($arraydata);
   exit();
}

function updateCartItemQuantityInDB($connection,$userid,$productid,$quantity){
   //create date for dateupdated column in database
   $now = generateDateTime();
   //set query to update only quantity to new one
   $updatecartquery = "UPDATE shoppingcart SET quantity='$quantity',dateupdated='$now'
   WHERE productid='$productid' AND userid='$userid'";
   if($connection->query($updatecartquery)){
      //return true if successful
      return true;
   }
   else{
      //otherwise return false
      return false;
   }
}
function addCartItemToDB($connection,$userid,$productid,$quantity){
   $now = generateDateTime();
   $query = "INSERT INTO shoppingcart (userid,productid,checkedout,datecreated) 
   VALUES('$userid','$productid','false','$now')";
   //check if item already in db
   // if(checkCartForItem($connection,$productid,$userid)){
   //    $query = "UPDATE shoppingcart SET quantity='$quantity',dateupdated='$now' 
   //    WHERE productid='$productid' AND userid='$userid'";
   // }
   if($connection->query($query)){
      return true;
   }
   else{
      return false;
   }
}

function checkCartForItem($connection,$productid,$userid){
   $query = "SELECT COUNT('$productid') FROM shoppingcart WHERE userid='$userid'";
   $result = $connection->query($query);
   $num = $result->fetch_assoc();
   if($num["count(productid)"] > 0){
      return true;
   }
   else{
      return false;
   }
}
function countCartItemsInDB($connection,$userid){
   $query = "SELECT COUNT(productid) FROM shoppingcart WHERE userid='$userid'";
   $result = $connection->query($query);
   $num = $result->fetch_assoc();
   return $num["count(productid)"];
}

?>