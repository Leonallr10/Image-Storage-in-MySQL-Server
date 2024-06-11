$(document).ready(function() {
    // Function to fetch products data from the API endpoint
    function fetchProductsData(productType) {
        // Check if productType is valid
        if (!['smartphones', 'laptops', 'accessories'].includes(productType)) {
            console.error('Invalid product type:', productType);
            return; // Exit function if productType is invalid
        }

        $.ajax({
            url: 'http://localhost:3000/api/products?type=' + productType,
            type: 'GET',
            success: function(data) {
                if (data && data.length > 0) {
                    // Populate products data dynamically
                    var products = '';
                    data.forEach(function(item) {
                        // Extracting relevant data based on product type
                        var productName = item.pdt_name;
                        var currentPrice = item.current_price;
                        var initialPrice = item.initial_price;
                        var spec1 = item.storage_capacity + ' GB RAM';
                        var spec2 = item.camera_setup + ', ' + item.processor;
                        var spec3 = item.operating_system;
                        var imagePath = item.image_path; // Dynamic image path

                        // Building the product HTML with dynamic image path
                        products += "<div role='listitem' class='menu-item w-dyn-item w-col w-col-6'>" +
                                        "<div class='food-card'><a href='/product/" + productName + "' class='food-image-square w-inline-block'><img src='" + imagePath + "' alt='' class='food-image' /></a>" +
                                            "<div class='food-card-content'><a href='/product/" + productName + "' class='food-title-wrap w-inline-block'>" +
                                                "<h6>" + productName + "</h6>" +
                                                "<div data-wf-sku-bindings='%5B%7B%22from%22%3A%22f_price_%22%2C%22to%22%3A%22innerHTML%22%7D%5D' class='price'>$ " + currentPrice + " USD - $ " + initialPrice + "</div>" +
                                            "</a>" +
                                            "<p class='paragraph'>" +
                                                "<div class='spec'>" + spec1 + "</div>" +
                                                "<div class='spec'>" + spec2 + "</div>" +
                                                "<div class='spec'>" + spec3 + "</div>" +
                                            "</p>" +
                                            "<div class='add-to-cart'>" +
                                                "<div class='wishlist mt-3'>" +
                                                    "<button class='btn btn-outline-danger wishlist-button'><i class='bi bi-heart'></i> Add to Wishlist</button>" +
                                                "</div>" +
                                                "<div style='display:none' class='w-commerce-commerceaddtocartoutofstock out-of-stock-state'>" +
                                                    "<div>This product is out of stock.</div>" +
                                                "</div>" +
                                                "<div data-node-type='commerce-add-to-cart-error' style='display:none' class='w-commerce-commerceaddtocarterror'>" +
                                                    "<div data-node-type='commerce-add-to-cart-error' data-w-add-to-cart-quantity-error='Product is not available in this quantity.' data-w-add-to-cart-general-error='Something went wrong when adding this item to the cart.' data-w-add-to-cart-mixed-cart-error='You can’t purchase another product with a subscription.' data-w-add-to-cart-buy-now-error='Something went wrong when trying to purchase this item.' data-w-add-to-cart-checkout-disabled-error='Checkout is disabled on this site.' data-w-add-to-cart-select-all-options-error='Please select an option in each set.'>Product is not available in this quantity.</div>" +
                                                "</div>" +
                                            "</div>" +
                                        "</div>" +
                                    "</div>" +
                                "</div>" +
                            "</div>";
                    });
                    // Displaying products in the respective tab
                    $('#products-container-' + productType).html(products);
                } else {
                    console.error('No products found for:', productType);
                }
            },
            error: function(err) {
                console.error('Error fetching products:', err);
            }
        });
    }

    // Fetch smartphones data initially
    fetchProductsData('smartphones');

    // Event listener for tab change
    $('.tab-link-round').click(function() {
        var productType = $(this).data('w-tab'); // Extract product type from tab data attribute
        $('.tab-content-wrap').hide(); // Hide all product containers
        fetchProductsData(productType); // Fetch and display products for the selected tab
        $('#products-container-' + productType).show(); // Show the product container for the selected tab
    });
});
