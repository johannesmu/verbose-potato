<?php 
include("includes/head.php");
?>
<main class="main">
    <div class="container">
        <div class="row">
            <div class="col-md-6">
                <h2>Search Result</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-md-8">
                <?php
                if($_POST["search"]){
                    $keywords = filter_var($_POST["search"],FILTER_SANITIZE_STRING);
                    echo "<p>You searched for <strong>$keywords</strong></p>";
                }
                ?>
            </div>
        </div>
    </div>
</main>
<?php include("includes/footer.php");?>