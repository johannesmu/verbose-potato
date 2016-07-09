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
        <div class="row">
            <div class="col-md-2 sidebar">
                <!--sidebar-->
                <form id="store-view-filter">
                    <h5>Select Category</h5>
                    <select class="form-control" id="category-select">
                        <?php
                            $filter = getProductFilter($dbconnection,"categories");
                            //var_dump($filter);
                            foreach ($filter as $category) {
                                $id=$category["id"];
                                $name=$category["name"];
                                echo "<option value=\"$id\">$name</option>";
                            }
                        ?>
                    </select>
                    <h5>Select Brand</h5>
                    <select class="form-control" id="brand-select">
                        <?php
                            // $filter = getProductFilter($dbconnection,"categories");
                            $filter = getProductFilter($dbconnection,"brands");
                            //var_dump($filter);
                            foreach ($filter as $category) {
                                $id=$category["id"];
                                $name=$category["name"];
                                echo "<option value=\"$id\">$name</option>";
                            }
                        ?>
                    </select>
                    <div class="checkbox">
                        <label>
                            <input id="stocklevel" type="checkbox" name="stocklevel" value="1">
                            Show only items currently in stock
                        </label>
                    </div>
                    <div class="checkbox">
                        <label>
                            <input id="special" type="checkbox" name="special" value="1">
                            Show only items on special
                        </label>
                    </div>
                </form>
            </div>
            <div class="col-md-10 store-products">
                <!--store products will be rendered here-->
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <h3>
                    <?php
                    echo "<p>".$content[1]['title']."</p>";
                    ?>
                </h3>
                <p>
                    <?php
                    echo "<p>".$content[1]['content']."</p>";
                    ?>
                </p>
            </div>
        </div>
    </div>
</main>
<?php include("includes/footer.php");?>