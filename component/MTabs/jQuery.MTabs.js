/**
 * @name     MTabs
 * @desc     Tab选项卡切换
 * @depend   jQuery
 * @author   M.J
 * @date     2014-11-11
 * @URL      http://webjyh.com
 * @reutn    {jQuery}
 * @version  1.0.0
 *
 * @param    {tabs}     {String}      当前Tabs的元素，默认获取选择器下的子元素，也可以填写jQuery选择器。如：ul.tabs > li
 * @param    {tabsCont} {String}      当前TabContent的元素，默认 null，请填写选择器。如 div.tabsCont > div
 * @param    {current}  {String}      当前Tabs选中之后当前元素的 class 名  默认 current
 * @param    {onBefore} {Function}    点击当前Tabs元素之前的回调函数。默认 null；回调函数 this 指向当前元素，函数传入 event 对象。
 * @param    {onAfter}  {Function}    点击当前Tabs元素之后的回调函数。默认 null；回调函数 this 指向当前元素，函数传入 event 对象。
 * @param    {effect}   {String}      点击Tabs时的切换效果，默认 show；参数 show || fadeIn
 * @param    {event}    {String}      Tabs 切换时所触发的事件  默认 click；参数 click || mouseover
 * @param    {show}     {Number}      设置当前Tabs第几个显示 以1为开始
 *
 * @PS If you have any questions, please don't look for me, I don't know anything. thank you.
 */
(function($) {

	var MTabs = function(elem, options){
		this.init(elem, options);
	};

	MTabs.version = '1.0.0';

	MTabs.prototype = {

		defaults: {
			tabs: null,
			tabsCont: null,
			current: 'current',
			onBefore: null,
			onAfter: null, 
			effect: 'show',
			event: 'click',
			show: 0
		},

		init: function(elem, options){

			this.elem = $(elem);
			this.config = $.extend({}, this.defaults, options);
			this.tabs = (this.config.tabs) ? $(this.config.tabs) : this.elem.children();
			this.tabsCont = (this.config.tabsCont) ? $(this.config.tabsCont) : null;
			
			this.addEvent();
		},

		addEvent: function(){
			var _this = this,
			    show = this.config.show < 1 ? 0 : --this.config.show;

			//默认重置
			this.tabs.removeClass(this.config.current).eq(show).addClass(_this.config.current);
			this.tabsCont.hide().eq(show).show();

			//绑定事件
			this.tabs.on( this.config.event, function(event){
				//点击前
				if ( typeof _this.config.onBefore === 'function' ) _this.config.onBefore.call( this, event );

				//Tab 处理
				var eq = $(this).index();
				_this.tabs.removeClass(_this.config.current);
				$(this).addClass(_this.config.current);
				_this.tabsCont.hide().eq(eq)[_this.config.effect]();

				//点击后
				if ( typeof _this.config.onAfter === 'function' ) _this.config.onAfter.call( this, event );
			});
		}

	};

	$.fn.MTabs = function(options){
		return this.each(function(){
			new MTabs(this, options);
		});
	};

	return $;
    
}(jQuery));