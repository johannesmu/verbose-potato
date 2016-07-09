<?php 
include_once("includes/head.php");
?>
<main class="main">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                 <h2><?php echo $sectionname;?></h2>
                <p>
                    <?php
                    echo "<p>".$content[0]['content']."</p>";
                    ?>
                </p>
            </div>
           
        </div>
        <div class="row">
            <div class="col-md-12">
                <h2>Featured Items</h2>
                <p>
                    <?php
                    echo "<p>".$content[1]['content']."</p>";
                    ?>
                </p>
                <div class="row featured-front">
                    
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <h2>Special Items</h2>
                <p>
                    <?php
                    echo "<p>".$content[2]['content']."</p>";
                    ?>
                </p>
                <div class="row special-front">
                    
                </div>
            </div>
        </div>
    </div>
</main>
<?php
include("includes/footer.php");
?>