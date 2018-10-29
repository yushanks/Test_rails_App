$(function() {

//バリデーション対策（ie7対応）
$(".clearfix").css({"zoom":"1" });


//基本レイアウト
	function setLayout() {

	//totopの表示  
			$(window).scroll(function(){
				if ($(this).scrollTop() > 100 ) {
                    $("#totop").fadeIn(); 
				} else {
                    $("#totop").fadeOut();  
				}  
			});


	//SPメニューの表示
//		if( $(window).width() > 700){
//			$("header nav").show();      
//		} else { 
//			$("header nav").hide(); 
//			$(".ie8 header nav").show();  
// 		}  

	}
	setLayout();


//ウインドウリサイズ時の再設定
	$(window).resize(function () {
		setLayout();
	});


//totopのイベント
	$("#totop").click(function () {
		$("body , html").animate({ "scrollTop": "0" }, 500);
	});


//SPメニューのイベント
//	$("header .sp").click(function () {
//		$("header nav").slideUp('fast');					
//		if($("header nav").css("display")=="none"){	
//			$("header nav").slideDown('fast');		
//		}
//	});
    
// ローカルナビ状態表示
    $(".local-w a").each(function(){
        if (location.href.replace(/(#.*$|index.html.*$)/,"") == this.href.replace(/(#.*$|index.html.*$)/,"")) {
            $(this).addClass('on');
        }
    });

    
//店舗検索クリッカブル要素指定    
$("article.clickable").each(function(){  
    var rel_url = $("a", this).attr("href");  
    $(this).click(function(){  
        location.href= rel_url;  
    });  
});
    
    
    

// PIE
//   if($.browser.msie){
//        $("header .sp,.badge ,.all ,#totop,.btn , .circle").each(function(){
//            PIE.attach(this);
//        }); 
//    }  
//
// 				
});
