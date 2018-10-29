$(function() {

	var bxSlider;
	var $slide = $('#slide');
	var $mask = $('.slider .mask');
	var is_init = true;
	var ie = function(){
		var undef, v = 3, d = document.createElement('div');
		while (
			d.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
				d.getElementsByTagName('i')[0]
			);
		return v> 4 ? v : undef;
	}

	$(document).ready(function(){
	  
	  // 初回スライダー構築
	  setTimeout(function(){
	  	$slide.css({
	  		visibility: "visible"
	  	});
	  	setSlide();
	  }, 300);

	});

	$(window).resize(function(){
		setSlide();
	});


	/* -----------------------------------------------
	 * リサイズ処理 （スライダーを再構築）
	 * ----------------------------------------------- */
	function setSlide(){
		if(bxSlider) bxSlider.destroySlider();

		if($(window).width() < 940){ // タブレット・スマホは１枚表示
			bxSlider = $slide.bxSlider({
					speed: 1000,
					easing: "ease-in-out",
					auto: true,
					slideWidth: $(window).width(),
					startSlide: 0,
					minSlides: 1,
					maxSlides: 1,
					moveSlides: 1,
					infinite: false,
					slideMargin: 0,
					pager: true,
					responsive: false,
					padding: 0,
					controls: false
		  });

			// マスク画像をリサイズ
			$mask.css({
		  	height: $slide.find('img').height(),
		  	backgroundSize: 'auto ' + String($slide.find('img').height()) + 'px'
		  	// marginLeft: $('#slide img').width()/2 * -1
		  });

		}
		else{ // PCは３枚表示
			//PC版の場合は末尾のアイテムを先頭に移動（2番めのアイテムが正面に表示されるため）
			$slide.children("li:last-child").prependTo($slide);
			if((ie() != undefined) && (ie() < 10)){
				bxSlider = $slide.bxSlider({
					speed: 1000,
					auto: true,
					slideWidth: 900,
					startSlide: 0,
					minSlides: 3,
					maxSlides: 3,
					moveSlides: 1,
					infinite: false,
					slideMargin: 20,
					pager: true,
					responsive: false,
					padding: 0,
					controls: false
				});
			}else{
				bxSlider = $slide.bxSlider({
					speed: 1000,
					easing: "ease-in-out",
					auto: true,
					slideWidth: 900,
					startSlide: 0,
					minSlides: 3,
					maxSlides: 3,
					moveSlides: 1,
					infinite: false,
					slideMargin: 20,
					pager: true,
					responsive: false,
					padding: 0,
					controls: false
				});
			}
		};

		if(is_init){
			$slide
			  	.css({
	  				opacity: 0
			  	})
	  			.animate({
			  		opacity: 1
			  	},{
	  				duration: 800
	  			});
		  	is_init = false;
		};
	};
 				
});
