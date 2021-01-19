if(typeof gv == "undefined"){
	gv = {};
	gv.main  = function (){
		try{
			gv.url = location.href.toLowerCase();
			gv.is_cart_page = gv.url.indexOf('/cart') != -1;
			gv.is_estimator_page = gv.url.indexOf('/estimator') != -1;
	  
			if(gv.is_cart_page){
			   gv.update_checkout_button();
			   gv.save_cart();
			} else if(gv.is_estimator_page){
				 if(localStorage.getItem('subtotal') == null || localStorage.getItem('cart') == null){
					 location.href = "/?error=1";
					 return;
				 }
				gv.handle_est_page();
			}
		}catch(e){
			console.log('[ main ] : ' + e);
		}
	};
	gv.style_estimate_page = function (){
		//text under email field
		if(document.querySelector('#email-yui_3_17_2_1_1553888888520_3745') != null){
			var text_div = document.createElement('div');
			text_div.innerHTML = "You'll receive a copy of your estimate at this email address";
			text_div.id = 'new_email_text';
			document.querySelector('#email-yui_3_17_2_1_1553888888520_3745').appendChild(text_div);
		}else{
			console.log('[ style_estimate_page ] Email field container not found');
		}
		//update 'email' to 'your email'
		if(document.querySelector('#email-yui_3_17_2_1_1553888888520_3745 > label.title') != null){
			document.querySelector('#email-yui_3_17_2_1_1553888888520_3745 > label.title').innerHTML = 'Your Email *';
		}else{
			console.log('[ style_estimate_page ] Email title not found');
		}
		//update Print button
		if(document.querySelector('a.sqs-block-button-element') != null){
			document.querySelector('a.sqs-block-button-element').addEventListener('click', function(){
				window.print();
			});	
		}
	};
	gv.handle_est_page = function (){
		try{
			var cart = JSON.parse(localStorage.getItem('cart'));
			var cart_container = document.querySelector('div.summary-item-list');
			if(cart_container != null){
				gv.populate_cart(cart);
				setTimeout(function(){
					document.querySelector('div.sqs-block-content strong').innerHTML = "Estimate of services"
					gv.show_cart_contents();
					gv.show_subtotal();
				}, 1000);
			}
			//data to be sent to the email
			gv.populate_form_email_fields();

			//place text under Email field
			gv.style_estimate_page();
		}catch(e){
			console.log('[ handle_est_page ] : ' + e);
		}
	};
	gv.populate_form_email_fields = function (){
		var cart = JSON.parse(localStorage.getItem('cart'));
		var subtotal = localStorage.getItem('subtotal');
		if(document.querySelectorAll('input[type="text"]').length == 3){
			//populate subtotal field
			document.querySelectorAll('input[type="text"]')[1].value = "$ " + subtotal;
			console.log(" [ populate_form_email_fields ] Subtotal: " + document.querySelectorAll('input[type="text"]')[1].value);

			//populate cart field
			var field = "";
			for(var i = 0; i < cart.length; i++){
				field += cart[i].name + (typeof cart[i].variant != "undefined" ? " (" + cart[i].variant + ")" : "") + ", ";
			}
			document.querySelectorAll('input[type="text"]')[2].value = field;
			console.log(" [ populate_form_email_fields ] Cart: " + document.querySelectorAll('input[type="text"]')[2].value);
		}
	};
	gv.show_subtotal = function (){
		var subtotal = localStorage.getItem('subtotal');
		if(document.querySelectorAll('#block-yui_3_17_2_1_1608780199913_4687 p').length == 3){
			//subtotal
			document.querySelectorAll('#block-yui_3_17_2_1_1608780199913_4687 p')[0].style.color = "#696c6d";
			document.querySelectorAll('#block-yui_3_17_2_1_1608780199913_4687 p')[0].innerHTML = "Subtotal <span style='float: right;'>$" + subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</span>";
			//tax
			document.querySelectorAll('#block-yui_3_17_2_1_1608780199913_4687 p')[1].style.color = "#696c6d";
			document.querySelectorAll('#block-yui_3_17_2_1_1608780199913_4687 p')[1].innerHTML = "Tax <span style='float: right;'>-</span>";
			//total
			document.querySelectorAll('#block-yui_3_17_2_1_1608780199913_4687 p')[2].style.color = "#313030";
			document.querySelectorAll('#block-yui_3_17_2_1_1608780199913_4687 p')[2].style.lineHeight = "3";
			document.querySelectorAll('#block-yui_3_17_2_1_1608780199913_4687 p')[2].innerHTML = "Total <span style='float: right;'>$" + subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</span>";
		}else{
			console.log('[ show_subtotal ] Subtotal fields not found');
		}
	};
	gv.populate_cart = function (cart){
		try{
			var cart_container = document.querySelector('div.summary-item-list');
			var first_item = document.querySelector('div.summary-item-list > div.summary-item');
			if(first_item != null){
				for(var i = 0 ; i < cart.length; i++){
					if(i !== 0){
						var new_prod_el = first_item.cloneNode(true);
						cart_container.appendChild(new_prod_el);
					}
					//image
					document.querySelectorAll('div.summary-item-list > div.summary-item img')[i].src = cart[i].pic;
					document.querySelectorAll('div.summary-item-list > div.summary-item img')[i].setAttribute('data-src', cart[i].pic);
					document.querySelectorAll('div.summary-item-list > div.summary-item img')[i].setAttribute('data-image', cart[i].pic);
					document.querySelectorAll('div.summary-item-list > div.summary-item img')[i].style.width = "100%";
					document.querySelectorAll('div.summary-item-list > div.summary-item img')[i].style.height = "auto";
					//links
					document.querySelectorAll('div.summary-item-list > div.summary-item a.summary-title-link')[i].href = cart[i].link;
					document.querySelectorAll('div.summary-item-list > div.summary-item a.summary-thumbnail-container')[i].href = cart[i].link;
					//name
					document.querySelectorAll('div.summary-item-list > div.summary-item a.summary-title-link')[i].innerHTML = cart[i].name + (cart[i].variant != null ? "<br><span style='color: #9c9c9c; font-size: 15px'>" + cart[i].variant +  "</span>": "");
					//price
					document.querySelectorAll('div.summary-item-list > div.summary-item div.summary-excerpt > p')[i].innerHTML = "$" + cart[i].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

					console.log('[ populate_cart ] Cart item set.');
				}
			}else{
				console.log('[ populate_cart ] First item not found')
			}
		}catch(e){
			console.log('[ populate_cart ] An error occurred when rebuilding cart');
		}
	};
	gv.show_cart_contents = function (){
		var styles = `
					div.summary-item-list{
						display: block !important;
					}
				`;
		var styleSheet = document.createElement("style")
		styleSheet.type = "text/css"
		styleSheet.innerText = styles
		document.head.appendChild(styleSheet);
		console.log('[ show_cart_contents ] Showing cart contents');
	};
	gv.save_cart = function (){
		var cart = gv.scrape_cart();
		var subtotal = gv.scrape_subtotal();

		console.log('Cart: ', cart);
		console.log('Subtotal: ', subtotal);

		if(cart.length > 0){
			localStorage.setItem('cart', JSON.stringify(cart));
		}else{
			localStorage.removeItem('cart');
		}

		if(subtotal > 0){
			localStorage.setItem('subtotal', subtotal);
		}else{
			localStorage.removeItem('subtotal');
		}
	};
	gv.scrape_cart = function (){
		var cart_rows = document.querySelectorAll('div.CartTableRow-cartItemList-qrq0l');
		var cart = [];
		var prod = {};
		try{
			if(cart_rows.length > 0){
				for(var i = 0; i < cart_rows.length; i++){
					prod = {};
					prod.name = cart_rows[i].querySelector('a').innerHTML;
					prod.link = cart_rows[i].querySelector('a').href;
					prod.pic = cart_rows[i].querySelector('div.item-image > div').style.backgroundImage.replace('url("', '').replace('")','');
					prod.qty = cart_rows[i].querySelector('input').value;
					prod.price = cart_rows[i].querySelector('div.item-price').innerHTML.replace('$','').replace(',','');

					if(cart_rows[i].querySelector('div.variant') != null){
						prod.variant = cart_rows[i].querySelector('div.variant').textContent;
					}

					console.log(prod);
					cart.push(prod);
				}
			}
		}catch(e){
			console.log('[ scrape_cart ] ' + e);
		}
		if(cart_rows.length = cart.length){
			return cart;
		}else{
			console.log('Something went wrong chief')
			return [];
		}
	};
	gv.scrape_subtotal = function (){
		var page_rows = document.querySelectorAll('#sqs-cart-container div.cart-container span');
		var subtotal = 0;
		for(var i = 0; i < page_rows.length; i++){
			if(page_rows[i].className.indexOf('subtotalPrice') != -1){
				subtotal = page_rows[i].innerHTML.replace('$','').replace(',','');
			}
		}
		return subtotal;
	};
	gv.update_checkout_button = function (){
	   if(document.querySelector('div.checkout button') != null){
		  var button_container = document.querySelector('div.checkout button').parentNode;
		  var new_button = document.createElement('a');
		  new_button.id = 'new_checkoutbutton'
		  new_button.className = 'sqs-editable-button CheckoutButton-checkoutButton-3yWY2';
		  new_button.innerHTML = 'SAVE YOUR ESTIMATE';
		  new_button.href = "/estimator";
		  new_button.style.marginTop = "2%";
		  button_container.appendChild(new_button);
	   }
	};
	if (typeof (document.readyState) != "undefined" && document.readyState === "complete") {
	   console.log('[Main] Loading code..')
	   gv.main();
	} else if (window.addEventListener) {
	   window.addEventListener('load', gv.main, true);
	} else if (window["attachEvent"]) {
	   window["attachEvent"]('onload', gv.main);
	} else {
	   setTimeout(gv.main, 5000);
	}
 }