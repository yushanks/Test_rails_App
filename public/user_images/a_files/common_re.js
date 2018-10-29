$(function() {

//SPメニューのイベント
	$("header .sp").click(function (e) {

		e.preventDefault();

		var $body = $('body');
		var $global_sp = $('header .global-sp');

		if( !$body.hasClass('opened') ){

			$global_sp.css({
				display: 'block',
				height: Math.max.apply( null, [document.body.clientHeight , document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight] )
			});

			$body
				.addClass('opened')
				.stop()
				.animate({
					left: -145
				},{
					duration: 200,
					easing: 'linear'
				});

		}
		else{

			$body
				.removeClass('opened')
				.stop()
				.animate({
					left: 0
				},{
					duration: 200,
					easing: 'linear',
					complete: function(){
						$global_sp.css({
							display: 'none'
						});
					}
				});

		};
		
	});

	$(window).resize(function(){
        /*
		if( $('body').hasClass('opened') ){
			$("header .sp").click();
		};
		*/

	});

});
