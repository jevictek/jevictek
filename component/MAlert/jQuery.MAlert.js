/**
 * @name     MAlert
 * @desc     警告框组件
 * @depend   jQuery
 * @author   M.J
 * @date     2014-12-04
 * @URL      http://webjyh.com
 * @reutn    {MAlert}
 * @version  1.0.0
 *
 * @param    {attr}           {String}      当前触发警告框的属性名，默认 data-alert
 * @param    {attrValue}      {String}      当前触发警告框的属性值，默认 alert
 *
 * @PS If you have any questions, please don't look for me, I don't know anything. thank you.
 */
(function($){

	var MAlert = function( selector ){
		return new MAlert.init( selector );
	};

	MAlert.version = '1.0.0';

	MAlert.init = function( selector ){
		this.config = $.extend({}, this.defaults, selector);
		this.init();
	};
	
	MAlert.init.prototype = MAlert.prototype = {
		defaults: {
			'attr': 'data-alert',
			'attrValue': 'alert'
		},
		init: function(){
			$(document).on('click', '['+this.config.attr+'="'+this.config.attrValue+'"]', this.close );
		},
		close: function( event ){
			if ( event ) event.preventDefault();

			var $this = $(this),
			    $parent = $this.parent();

			if ( $parent.length ){
				$parent.fadeOut(function(){
					$(this).remove();
				});
			}
		}
	};

	$.fn.MAlert = MAlert;
	
}(jQuery));