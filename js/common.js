/**
 * @name    Common Moudle
 * @desc    常用共用模块
 * @depend  jQuery, MDialog, artTemplate
 * @author  M.J
 * @date    2014-11-10
 * @return  {null}
 */
require(['jquery', 'MTabs'], function($){

	//Kill IE6
	var IE6 = !-[1,] && !window.XMLHttpRequest;
	if ( IE6 ){
		var $IE6Code = $('#kill-ie').html(),
		    $winH = $(window).outerHeight(),
		    $body = $('body');

		$body.css({ 'position':'relative', 'overflow':'hidden', 'height': $winH }).append( $IE6Code );
		$(window).on('resize', function(){ $body.height( $(window).outerHeight() ); });

		return false;
	}

	var $search = $('#search'),
	    $searchForm = $search.next(),
	    $userInfo = $('#user-info'),
	    $userDropdown = $userInfo.next();

	//搜索
	$search.on('click', function(){
		var hasClass = $(this).hasClass('current');
		hasClass ? $(this).removeClass('current') : $(this).addClass('current');
		hasClass ? $searchForm.addClass('hidden') : $searchForm.removeClass('hidden');
	});

	//个人中心
	$userInfo.on('click', function(){
		var hasClass = $(this).hasClass('current');
		hasClass ? $(this).removeClass('current') : $(this).addClass('current');
		hasClass ? 	$userDropdown.addClass('hidden') : $userDropdown.removeClass('hidden');
	});

	//document
	$(document).on('click', function(e){
		var $target = $(e.target);

		if ( !$target.parents('.navbar-search').length ){
			$search.removeClass('current');
			$searchForm.addClass('hidden');
		}

		if ( !$target.parents('.navbar-user').length ){
			$userInfo.removeClass('current');
			$userDropdown.addClass('hidden');
		}
	});

	// Tabs
	$('#col-tabsNav > ul').MTabs({ tabsCont: '#col-row > .container'});

});