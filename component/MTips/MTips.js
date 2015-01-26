/**
 * @name     MTips
 * @desc     工具提示框
 * @depend   jQuery
 * @author   M.J
 * @date     2014-12-11
 * @URL      http://webjyh.com
 * @reutn    {jQuery}
 * @version  1.0.0
 *
 * @param    {effect}      {String}      当前 MTips 载入时的动画效果，默认为 true。
 * @param    {direction}   {String}      当前 MTips 载入时的方向，默认为 top 。
 * @param    {selector}    {String}      当前 MTips 所触发的选择器，默认为 [data-tips="tips"]。
 * 
 * @PS If you have any questions, please don't look for me, I don't know anything. thank you.
 */
define(['jquery'], function( $ ){

	var MTips = function( option ){
		return new MTips.fn.init(option);
	};

	MTips.version = '1.0.0';

	MTips.template = '<div class="tooltips {direction}"><div class="tooltips-arrow"></div><div class="tooltips-inner">{text}</div></div>';

	MTips.fn = MTips.prototype = {
		defaults: {
			effect: true,
			direction: 'top',
			selector: '[data-tips="tips"]'
		},
		init: function( option ){
			var $elem = $(document),
			    _this = this;

			this.config = $.extend({}, this.defaults, option);

			$elem.on( 'mouseover', this.config.selector, function(){ _this.create( $(this) ); } );
			$elem.on( 'mouseout', this.config.selector, function(){ _this.destroy(); } );
		},
		create: function( $this ){

			//set data
			this.elem = $this;
			this.effect = $this.attr('data-effect') ? $this.attr('data-effect') == 'true' ? true : false : this.config.effect;
			this.title = $this.attr('title');
			this.direction = $this.attr('data-direction') ? $this.attr('data-direction') : this.config.direction;

			//insert template
			var tpl = MTips.template.replace('{direction}', this.direction).replace('{text}', this.title);
			this.tips = $(tpl).appendTo('body');
			
			//set Tips
			var css = this.getDirection();
			$this.removeAttr('title');
			this.tips.css(css)[this.effect ? 'fadeIn' : 'show']();

		},
		destroy: function(){
			this.elem.attr('title', this.title);
			this.tips[this.effect ? 'fadeOut': 'hide']( this.effect ? 400 : 0, function(){ $(this).remove() });
		},
		getOffset: function(){
			var $elem = this.elem,
			    $tips = this.tips,
			    offset = $elem.offset();

			return {
				top: offset.top,
				left: offset.left,
				width: $elem.outerWidth(),
				height: $elem.outerHeight(),
				tipsWidth: $tips.outerWidth(),
				tipsHeight: $tips.outerHeight()
			}
		},
		getDirection: function(){
			var $top = $(window).scrollTop(),
			    offset = this.getOffset(),
			    direction = this.direction,
			    css = {};

			switch ( direction ){
				case 'top': css = { top: offset.top - offset.tipsHeight, left: offset.left + (offset.width / 2) - (offset.tipsWidth / 2) }; break;
				case 'right': css = { top: offset.top + (offset.height / 2) - (offset.tipsHeight / 2), left: offset.left + offset.width }; break;
				case 'bottom': css = { top: offset.top + offset.height, left: offset.left + (offset.width / 2) - (offset.tipsWidth / 2) }; break;
				case 'left': css = { top: offset.top + (offset.height / 2) - (offset.tipsHeight / 2), left: offset.left - offset.tipsWidth }; break;
			}

			return css;
		}
	};

	//将当前 init 指向当前 MTips
	MTips.fn.init.prototype = MTips.prototype;

	return MTips;
});