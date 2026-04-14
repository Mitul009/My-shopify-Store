$(document).ready(function(){
  
  $(window).on('load', function () {
    $(".main_loader_wpr").addClass('is-close');
  });
  
  $(window).on('load', function () {
    setTimeout(function () {
        $('.coupon-wrapper').addClass('active');
    }, 3000);
  });

  $("body").on('click', '.coupon_close', function () {
    $(this).closest(".coupon-wrapper").removeClass('active');
  });
  
  $("body").on('click', '.search a, .mobile_search', function () {
    $(".search_bar_main").addClass('is-open');
  });
  
  $("body").on('click', '.search_close a', function () {
    $(this).closest(".search").find(".search_bar_main").removeClass("is-open");
  });

   $("body").on('click', '.basket a', function () {
     $(".cart_main").addClass('is-open');
     $(".cart_overlay").addClass('is-open');
   });
  $("body").on('click', '.cart_close, .cart_overlay', function () {
    $(this).closest(".basket").find(".cart_main, .cart_overlay").removeClass("is-open");
  });
  // mobile menu
   $("body").on('click', '.mobile_toggle', function () {
     $(".header_menu").addClass('is-open');
     $("body").addClass('is-open');
   });
   $("body").on('click', '.mob_menu_close', function () {
     $(this).parent(".header_menu").removeClass('is-open');
     $("body").removeClass('is-open');
   });

  //======================= SHOP SLIDER
  var shop = new Swiper('.shop_slider', {
    slidesPerView: 1.5,
    spaceBetween: 0,
    pagination: {
      el: '.swiper-pagination.shop_pagination',
      clickable: true
    },
     breakpoints: {
        991: {
            slidesPerView: 4
        },
        575: {
            slidesPerView: 2,
        }
    }
  });
  var product_slider = new Swiper('.product_sliders', {
    slidesPerView: 1,
    spaceBetween: 0,
    effect: "fade",
    pagination: {
        el: ".swiper-pagination.product_sliders_pagination",
        type: "fraction",
    },
    navigation: {
      nextEl: ".swiper-button-next.product_sliders_arrow",
      prevEl: ".swiper-button-prev.product_sliders_arrow",
    },
  });
  var announcement = new Swiper('.announcement-bar', {
    slidesPerView: 'auto',
    loop: true,
    allowTouchMove: false,
    spaceBetween: 0,
    speed: 8000,
      autoplay: {
        delay: 0,
        disableOnInteraction: true,
    }
  });


  //===================== NICE_SELECT
  $('.nice-select').each(function () {
		var select = $(this),
		name = select.attr('name');
		select.hide();
		select.wrap('<div class="nice-select-wrap"></div>');
		var parent = select.parent('.nice-select-wrap');
		parent.append('<ul id=' + name + ' style="display:none"></ul>');
		var selected = $('.nice-select').find(":selected").val();
		select.find('option').each(function () {
		var option = $(this),
		value = option.attr('value'),
		label = option.text();
        // var select_arrow = $('<span></span>>');
		if (option.is(":first-child")) {
			$('<a href="javascript:void(0)" class="drop">' + label + '</a>').insertBefore(parent.find('ul'));
		} else if(selected == value){
			var shortBy = $('.nice-select').find('[value="sort-by"]').text();
			var niceOption = $(this),
			text = niceOption.text();        
			parent.find('.drop').text( shortBy + ' - ' + text).addClass('filter-active');
			parent.find('ul').append('<li><a class="active sort_active" href="javascript:void(0)" id="' + value + '" value="' + value + '"><span></span>' + label + '</a></li>');
		} else {
			parent.find('ul').append('<li><a href="javascript:void(0)" id="' + value + '" value="' + value + '"><span></span>' + label + '</a></li>');
		}
	}); 
	parent.find('a').on('click', function (e) {
	parent.toggleClass('down').find('ul').slideToggle(300);
	e.preventDefault();
  });
    parent.find('ul a').on('click', function (e) {
        var shortBy = $('.nice-select').find('[value="sort-by"]').text();
        var niceOption = $(this),
        value = niceOption.attr('id'),
        text = niceOption.text();
        select.val(value);
        parent.find('.drop').text( shortBy + ' - ' + text).addClass('filter-active');
        e.preventDefault();
        $(this).closest('#sort').find('li a').removeClass('active sort_active');
        $(this).addClass('active sort_active');
    });
  });
  
  //================ PDP quantity plus 

// miniCartUpdate
function miniCartUpdate() {
  $.get("/cart?view=mini-cart", function(cart) {
      console.log("Mini-cart response Done:");
      var html = $(cart).find('.cart_inner').html();
      if (html) {
          $('.cart_inner').html(html);
      } else { 
          console.error('Mini-cart content not found in response');
      }
  })
  }
  
// quantity update
$('body').on('click', '.dr_qty_btn .qty_btn', function (e) {
    e.preventDefault();

    let $btn = $(this).closest(".dr_qty_btn");
    let $clickedElement = $(this);
    let $input = $btn.find('.qty_number');
    let qty = parseInt($input.val());
    let line = $btn.data('line');

    if ($clickedElement.hasClass('qty_plus')) {
        qty = qty + 1;
    } else if ($clickedElement.hasClass('qty_minus')) {
        qty = qty - 1;
    }

    // ❗ minimum 1 rakho
    if (qty < 1) qty = 1;

    $input.val(qty);

    $.ajax({
        type: 'POST',
        url: '/cart/change.js',
        dataType: 'json',
        data: { 
            line: line,
            quantity: qty
        },
        success: function (cart) {
            miniCartUpdate();
        }
    });
});

  //Mini-cartjs
  $('body').on('click','.remove_items',function(e){
    e.preventDefault();
    var variantObject = {};
    var removevariantid = $(this).attr('data-variant');
    variantObject[removevariantid] = 0;
    var jsonObject = {}
    jsonObject['updates'] = variantObject;
    $.ajax({
      type: "post",
      url: "/cart/update.js",
      data: jsonObject,
      dataType: "json",
      success: function (cart) { 
         miniCartUpdate();
        }
    });
 });

$('body').on('click', '.add-to-bag', function(e) {
    e.preventDefault();
    var $form = $(this).closest('.form_addtocart');
    var formData = $form.serialize();
    var cartmain = $(".cart_main");
    var cartoverlay = $(".cart_overlay");
    $.ajax({
    type: 'POST',
    url: '/cart/add.js',
    data: formData,
    dataType: 'json',
    success: function(response) {
        cartmain.addClass("is-open"); 
        cartoverlay.addClass("is-open");
        miniCartUpdate();
      }
    });

});

  // search bar====================
  var debounceTimer;
  $("body").on('keyup', '#searchInput', function () {
    clearTimeout(debounceTimer);
    var q = $('#searchInput').val();
    var b = '&resources[type]=product';
    debounceTimer = setTimeout(function() {
      $.ajax({
        url: '/search/suggest.json?q=' + q + b,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
          var productSuggestions = response.resources.results.products;
          var results = $("#searchResults").empty();
          if (productSuggestions.length) {
            $.each(productSuggestions.slice(0, 3), function(i, product) {
              var productImage = product.image || '/path/to/default/image.jpg';
              results.append(
                '<li><a href="'+ product.url +'">' +
                  '<img src="'+ productImage +'" alt="'+ product.title +'"/>' +
                  product.title +
                '</a></li>'
              );
            });
          } else {
            results.append('<li><small>No Results Found</small></li>');
          }
        },
        error: function() {
          $("#searchResults").empty().append('<li><small>Error loading results. Please try again.</small></li>');
        }
      });
    }, 500);
  });

    
    // const variantSelector = $('#ProductSelect-product-template');
    // const hiddenInput = $('#AddToCartForm input[name="id"]');
    // hiddenInput.val(variantSelector.val());
    // variantSelector.on('change', function () {
    //     hiddenInput.val($(this).val());
    //     console.log("Updated hidden 'id' field:", hiddenInput.val());
    // });

  $(".faq_heading").click(function () {
      $(".faq_heading").removeClass("active");
      $(".faq_content").slideUp();
      if (!$(this).next().is(":visible")) {
          $(this).next().slideDown();
          $(this).addClass("active");
      }
   })

   document.querySelectorAll('#AddToCartForm .product_size_option .product_option')
    .forEach(function(optionEl, index) {
      const select = document.querySelectorAll('#AddToCartForm .selector-wrapper select')[index];
      if (!select) return;
      optionEl.querySelectorAll('input').forEach(function(input) {
        input.addEventListener('change', function() {
          const value = this.value;
          select.value = value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        });

      });

    });
    

});