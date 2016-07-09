<?php 
include("includes/head.php");
?>
<main class="main">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <h2>
                    <?php echo $sectionname;?>
                </h2>
                <p>
                    <?php
                    echo "<p>".$content[0]['content']."</p>";
                    ?>
                </p>
            </div>
        </div>
        <div class="row shoppingcart-view" id="shopping-cart-list">

        </div>
   </div>
</main>
<?php include("includes/footer.php");?>