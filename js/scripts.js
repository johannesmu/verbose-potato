/*site wide javascript*/

// UI Elements
//alert for forms
var formalert = '<div class="alert alert-dismissible">'+
'<span class="message"></span>'+
'<button type="button" class="close" data-dismiss="alert">'+
'<span>&times;</span></button></div>';

var productalert ='<div class="alert alert-warning alert-dismissible" role="alert">'+
  '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
  'No product found.</div>';

var defaultimage = "default.png";

//submit variable to stop double clicking
var submitting = false;
//function to submit and receive ajax data.
//this function will pass returned data to the callback function
//and pass ajax errors to the error handler
function sendAjaxRequest(destination_url,json_data,callback_handler,error_handler){
   $.ajax({
      type        : 'POST',
      url         : destination_url,
      data        : json_data,
      dataType    : 'json',
      encode      : true
   })
   .done(function(result){
      callback_handler(result);
   })
   .fail(function(error){
      error_handler(error);
   });
}
//we delegate listener to the store container because all store items are dynamically
//generated via javascript ajax request
function addBuyListener(elm){
   $("")
}
function logIt(data){
   console.log(data);
}
function handleAjaxError(error){
   console.log(error);
}


//all listeners for when document is ready
$(document).ready(function(){
   //------------------------------------user registration form
   //when the register button is clicked
   $("#user-registration").on("submit",function(event){
      //stop form from navigating
      event.preventDefault();
      //get data from forms
      var formData = {
         'email'     : $('input[name=email]').val(),
         'password'  : $('input[name=password]').val(),
         'user-token': $('input[name=user-token]').val()
      };
      if(submitting==false){
         removeMessage("#user-registration");
         addSpinner(event);
         submitting=true;
         $.ajax({
            type        : 'POST',
            url         : 'ajax/user-registration.php',
            data        : formData,
            dataType    : 'json',
            encode      : true
         })
         .done(function(data){
            //do something when done
            //remove the spinner
            removeSpinner(event);
            //set submitting to false
            submitting = false;
            //check what comes back
            if(data.success){
               //add alert to the form
               showMessage("#user-registration",true,"your account has been created,why not go shopping?");
               updateNavigation(0,2,"user-nav",data.email);
            }
            else if(data.errors){
               message = showErrorCode(data.errors.code);
               showMessage("#user-registration",false,message);
            }
         });
      }
   });
   // ------------------------------------------user login form
   $("#user-login").on("submit",function(event){
      event.preventDefault();
      var formData = {
         'email'     : $('input[name=email]').val(),
         'password'  : $('input[name=password]').val(),
         'user-token': $('input[name=user-token]').val()
      };
      if(submitting==false){
         addSpinner(event);
         submitting=true;
         $.ajax({
            type        : 'POST',
            url         : 'ajax/user-login.php',
            data        : formData,
            dataType    : 'json',
            encode      : true
         })
         .done(function(data){
            removeSpinner(event);
            submitting = false;
            if(data.success){
               //add alert to the form
               showMessage("#user-login",true,"welcome back!");
               updateNavigation(0,2,"user-nav",data.email);
               //update the cart quantity
               displayCartQuantity("quantity");
               if(data.admin){
                  //if user is admin, redirect to admin page
                  window.location = "admin.php";
               }
            }
            else if(data.errors){
               message = showErrorCode(data.errors.code);
               showMessage("#user-login",false,message);
            }
         });
      }
      
   });
   //these are for the store section
   //if category selector is changed, call function filterProducts()
   $("#category-select").on("change",function(event){
      filterProducts(event);
   });
   //if brand selector is changed, call function filterProducts()
   $("#brand-select").on("change",function(event){
      filterProducts(event);
   });
   //if a checkbox for stock level is selected
   $("#stocklevel").on("change",function(event){
      filterProducts(event);
   });
   $("#special").on("change",function(event){
      filterProducts(event);
   });
   //if an element with class 'store-products' exist
   if($(".store-products").length){
      loadProducts("store-products");
   }
   
   addCartClass();
   
   /*
   when the page loads, get the quantity of the shopping cart, to show on the page,
   pass the name of the class of the element used to display it, which in this case is
   quantity
   */
   displayCartQuantity("quantity");
   
   /*
   in shopping cart.php we have placed a bootstrap row with class "shoppingcart-view"
   when it is present we will call a function to render the contents of the shopping cart
   */
   if($(".shoppingcart-view").length){
      displayCartContents("shoppingcart-view");
   }
});

//functions
//----Shopping Cart section------------

function addBuyListener2(){
   $(".buy-btn[data-id]").on("click",function(event){
      var target = event.target;
      event.preventDefault();
      //when button clicked, get the id of the button
      var id = $(target).parents(".form-inline").find(".buy-btn").data("id");
      var qty = parseInt($(target).parents(".form-inline").find(".qty").val());
      var BuyData = {
         "id" : id,
         "quantity" : qty,
         "token" : token
      }
      console.log(BuyData);
      //send ajax request to addtocart.php in ajax folder
      $.ajax({
         type        : 'POST',
         url         : 'ajax/addtocart.php',
         data        : BuyData,
         dataType    : 'json',
         encode      : true
      })
      .done(function(data){
         if(data.success){
            console.log(data);
            /* 
            When we receive data.success=true from addtocart.php we update
            the badge element inside the navigation link with the quantity.
            Badge is a built in component of Bootstrap
            see the shopping cart section inside $(document).ready() 
            */
            if(data.quantity>0){
               $(".quantity").html(data.quantity);
            }
         }
         else{
            console.log(data);
            //display any error messages
         }
      });
   });
}
function addCartClass(){
   $("a[href='shoppingcart.php'] .badge").addClass("quantity");
}
function displayCartQuantity(cartclass){
   //make an ajax request for modes, see ajax/get-cartdata.php
   var requestdata = {
      "mode" : "quantity",
      "token" : token
   }
   $.ajax({
      type        : 'POST',
      url         : 'ajax/get-cartdata.php',
      data        : requestdata,
      dataType    : 'json',
      encode      : true
   })
   .done(function(data){
      if(data.success && data.quantity>0){
         quantity = data.quantity;
         elementclass = "."+cartclass;
         $(elementclass).html(quantity);
      }
   });
}
/*this function is called to display the contents of the cart in
shoppingcart.php page. Pass the class of the container to be filled with
products as an parameter.
It needs ajax/get-cartdata.php file
*/
function displayCartContents(displaycartclass){
   requestdata = {
      "mode" : "items",
      "token" : token
   }
   //console.log(requestdata);
   $.ajax({
      type        : 'POST',
      url         : 'ajax/get-cartdata.php',
      data        : requestdata,
      dataType    : 'json',
      encode      : true
   })
   .done(function(data){
      if(data.success){
         //console.log(data);
         itemstotal = data.products.length;
         if(itemstotal){
            for(i=0;i<itemstotal;i++){
               product = data.products[i];
               console.log(product);
               renderCartItems(displaycartclass,product);
            }
         }
         else{
            $("."+displaycartclass).html('<p class="col-xs-12">Woo hoo, your cart is empty</p>');
         }
      }
   });
}
function shoppingCartEvent(){
   var elm = document.getElementById("shopping-cart-list");
   var event = new Event('created');
}
function renderCartItems(elm,item){
   //directory for product images, the slash has to be escaped with "\"
   imagedir="products\/";
   price = item.price
   if(item.specialprice){
      price = item.specialprice;
   }
   var cartitem = 
   '<div class="col-xs-12">'+
      '<div class="row">'+
         '<div class="col-sm-3">'+
            '<img class="product-image" src="'+imagedir+defaultimage+'" data-image="'+imagedir+item.image+'" onload="swapImage(event)">'+
         '</div>'+
         '<div class="col-sm-3">'+
            '<h3>'+item.name+'</h3>'+
            '<p class="price">'+
               price+
            '</p>'+
         '</div>'+
      '</div>'
   '</div>';
   $("."+elm).append(cartitem);
}
function swapImage(event){
   var elm = event.target;
   elm.addEventListener("transitionend",function(){
      var image = $(elm).attr("src");
      $(elm).data("image",image);
      console.log("called");
   });
   $(elm).addClass("fade-out");
}
//define spinner
var spinner = '<i class="fa fa-spinner fa-spin spinner"></i>';
//function to add the spinner
function addSpinner(event){
   if($(event.target).find(".btn").length){
      $(event.target).find(".btn").append(spinner);
   }
   else{
      $(event.target).parent(".btn").append(spinner);
   }
}

function removeSpinner(event){
   $(event.target).find(".spinner").remove();
}

function showMessage(element,success,message){
   $(element).append(formalert);
   if(success){
      $(".message").parent(".alert").addClass("alert-success");
   }
   else{
      $(".message").parent(".alert").addClass("alert-warning");
   }
   $(".message").html(message);
}


function showErrorCode(code){
   //use error codes from user-registration.php
   switch(code){
      case 1:
         message = "tokens not matching";
         return message;
         break;
      case 2:
         message = "that email address is already used, would you like to"+"<a href='password-reset.php'>"+" reset"+"</a> the password instead?";
         return message;
         break;
      case 3:
         message = "password needs to be 8 characters or more";
         return message;
         break;
      case 4:
         message = "email address is invalid";
         return message;
         break;
      case 5:
         message = "no form data received";
         return message;
         break;
      case 6:
         message = "sorry, account creation failed";
         return message;
         break;
      case 7:
         message = "authentication failed";
         return message;
      case 8:
         message = "your account has been deactivated";
         return message;
      case 9:
         message = "database log error";
      default:
         break;
   }
}
//this function relies on get-navigation.php in the ajax directory
function updateNavigation(navlevel,navgroup,navelement,user){
   var navdata = {
      'level' : navlevel,
      'group' : navgroup
   };
   $.ajax({
      type        : 'POST',
      url         : 'ajax/get-navigation.php',
      data        : navdata,
      dataType    : 'json',
      encode      : true
   })
   .done(function(data){
      if(data.success){
         var nav = data.navigation;
         elm = "."+navelement;
         $(elm).html(nav);
         $(elm).parent().prepend("<span class='navbar-text navbar-left user-greeting'>"+user+"</span>");
         //add the cart class
         addCartClass();
      }
   });
}
//this function returns an object with data from the store view filter form
//in store.php file
function getStoreViewFilterData(){
   var formdata = {
      'category' : $('#category-select option:selected').val(),
      'brand' : $('#brand-select option:selected').val(),
      'stocklevel' : $('#stocklevel:checked').val(),
      'special' : $('#special:checked').val(),
      'token' : token
   }
   if(formdata.special==null){
      formdata.special = 0;
   }
   if(formdata.stocklevel==null){
      formdata.stocklevel = 0;
   }
   return formdata;
}
//this function gets called to load products into the store.php page.
function loadProducts(){
   var ProductData = getStoreViewFilterData();
   $.ajax({
      type        : 'POST',
      url         : 'ajax/get-products.php',
      data        : ProductData,
      dataType    : 'json',
      encode      : true
   })
   .done(function(data){
      if(data.success){
         $(".store-products").html("");
         var lg = data.products.length;
         for(i=0;i<lg;i++){
            renderProduct("store-products",data.products[i]);
         }
         addBuyListener();
      }
      else{
         $(".store-products").html("");
         $(".store-products").append(productalert);
      }
   });
}
//this function is used to load products when filtering is used in the store
//this program depends on get-products.php in ajax directory
function filterProducts(evt){
   var SelectorsData = getStoreViewFilterData();
   $.ajax({
      type        : 'POST',
      url         : 'ajax/get-products.php',
      data        : SelectorsData,
      dataType    : 'json',
      encode      : true
   })
   .done(function(data){
      if(data.success){
         $(".store-products").empty();
         var lg = data.products.length;
         for(i=0;i<lg;i++){
            renderProduct("store-products",data.products[i],i);
         }
         addBuyListener();
      }
      else{
         $(".store-products").empty();
         $(".store-products").append(productalert);
      }
   });
}

function renderProduct(elm,product){
   var container = $("[class='elm']");
   var id = "#"+product.productid;
   //path to the product image directory (the forward slash has to be escaped)
   var imagedir = 'products\/';
   //the product container
   var productelm = 
   '<div id="'+product.productid+'" class="col-md-4 col-xs-6 product-item">'+
   '<h4>'+product.productname+'</h4>'+
   '<a href="product-detail.php?id='+product.productid+'">'+
   '<img class="product-image" src="'+imagedir+defaultimage+'" data-image="'+product.productimage+'"></a>'+
   '<div class="price-bar"><span class="dollar price normal-price">'+
   product.productprice+'</span></div>'+
   '<div class="product-button-bar">'+
   '<form class="form-inline">'+
   '<button class="btn btn-default buy-btn" data-id="'+product.productid
   +'"><i class="fa fa-shopping-bag"></i><span class="hidden-sm">Buy It</span></button>'+
   '<input class="form-control qty" type="number" value="1" min="1">'+
   '<button class="btn btn-default wish-btn" data-id="'+product.productid
   +'"><i class="fa fa-heart"></i><span class="hidden-sm">Fave It</span></button>'+
   '</form>'+
   '</div></div>';
   //add the product to store container in store.php
   $("."+elm).append(productelm);
   var image=imagedir+$(id+" .product-image").data("image");
   //wait 500ms (1/2 sec) before loading each image
   setTimeout(function(){
     $(id+" img").attr("src",image); 
   },500);
   //if product is on special, 
   if(product.special==1){
      var specialmark='<span class="dollar special-mark">'+product.saleprice+'</span>';
      $("#"+product.productid+" .price-bar").append(specialmark);
      $("#"+product.productid+" .normal-price").addClass("cross");
   }
}


