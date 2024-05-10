$(document).ready(function () {
    
    alertify.set('notifier','position', 'top-right');
    
    $(document).on('click', '.increment', function (){

        var $quantityInput = $(this).closest('.qtyBox').find('.qty');
        var productId = $(this).closest('.qtyBox').find('.prodId').val();
        var currentValue = parseInt($quantityInput.val());

        if(!isNaN(currentValue)){
            var qtyVal = currentValue + 1;
            $quantityInput.val(qtyVal);
            quantityIncDec(productId, qtyVal);
        }
    });

    $(document).on('click', '.decrement', function (){

        var $quantityInput = $(this).closest('.qtyBox').find('.qty');
        var productId = $(this).closest('.qtyBox').find('.prodId').val();
        var currentValue = parseInt($quantityInput.val());

        if(!isNaN(currentValue) && currentValue > 1){
            var qtyVal = currentValue - 1;
            $quantityInput.val(qtyVal);
            quantityIncDec(productId, qtyVal);
        }
    });

    function quantityIncDec(prodId, qty){

        $.ajax({
            type: "POST",
            url: "orders-code.php",
            data: {
                'productIncDec': true,
                'product_id': prodId,
                'quantity':qty
            },
            success: function (response){
                var res = JSON.parse(response);

                if(res.status == 200){
                    $('#productArea').load(' #productContent');
                    alertify.success(res.message);
                }else{
                    $('#productArea').load(' #productContent');
                    alertify.error(res.message);
                }
            }
        });

    }

    // proceed to place order button click

    $(document).on('click', '.proceedToPlace', function () {

        // console.log('proceedToPlace');

        var cphone = $('#cphone').val();
        var payment_mode = $('#payment_mode').val();

        if(payment_mode == ''){

            swal("Select Payment Mode", "Select your payment mode","warning");
            return false;

        }

        if(cphone == '' && !$.isNumeric(cphone)){

            swal("Enter Phone Number", "Enter Valid Phone Number","warning");
            return false;

        }

        var data = {
            'proceedToPlaceBtn': true,
            'cphone' : cphone,
            'payment_mode': payment_mode,
        };

        $.ajax({
            type: "POST",
            url: "orders-code.php",
            data: data,
            success: function (response){

                var res = JSON.parse(response);
                if(res.status == 200){
                    window.location.href = "order-summary.php";

                }else if(res.status == 404){

                    swal(res.message, res.message, res.status_type, {
                        buttons:{
                            catch:{
                                text: "Add Customer",
                                value: "catch"
                            },
                            cancel: "Cancel"
                        }
                    })
                    .then((value) => {
                        switch(value){

                            case "catch":
                                $('#addCustomerModel').modal('show');
                                // console.log('Pop the customer add modal');
                                break;
                            default:
                        }
                    });

                }else{
                    swal(res.message, res.message, res.status_type);
                }
            }
        });      


    });

});