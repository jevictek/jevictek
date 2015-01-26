/**
 * @name     MDropdown
 * @desc     下拉菜单组件
 * @depend   jQuery
 * @author   M.J
 * @date     2014-11-30
 * @URL      http://webjyh.com
 * @reutn    {MDropdown}
 * @version  1.0.0
 *
 * @param    {attr}           {String}      当前下拉菜单的属性名，默认 data-toggle
 * @param    {attrValue}      {String}      当前下拉菜单的属性值，默认 dropdown
 * @param    {dropdownClass}  {String}      当前下拉菜单的菜单 class 名，默认 dropdown-menu
 * @param    {parentClass}    {String}      当前下拉菜单 显示下拉菜单的 class 名，默认 open
 *
 * @PS If you have any questions, please don't look for me, I don't know anything. thank you.
 */
define(['jquery'], function($){

	//构造函数
	var MDropdown = function( options ){
		return new MDropdown.fn.init( options );
	};

	MDropdown.version = '1.0.0'

	//扩展原型，使上面返回的 new 对象 继承以下方法和属性。
	MDropdown.fn = MDropdown.prototype = {
		defaults: {
			'attr': 'data-toggle',
			'attrValue': 'dropdown',
			'dropdownClass': 'dropdown-menu',
			'parentClass': 'open'
		},
		init: function( options ){
			var _this = this;
			    $elem = $(document);

		    this.config = $.extend({}, this.defaults, options);

		    $elem.on( 'click', '['+this.config.attr+'="'+this.config.attrValue+'"]', function(event){ _this.action( _this, $(this), event ); } );
		    $elem.on( 'click', function( event ){ _this.unaction( _this, event ) });
		},

		/**
		 * 执行下拉菜单
		 * @param  {Object} _this [指向 MDropdown 对象]
		 * @param  {Object} $this [当前元素对象本身]
		 * @param  {Object} event [事件]
		 * @return {null}
		 */
		action: function( _this, $this, event ){
			var $oldAttr = _this.elem && _this.getAttr( _this.elem ),
			    $attr = _this.getAttr( $this );

			if ( typeof $oldAttr !== 'undefined' ){
				_this.setAttr( _this.elem, false );
			}

			_this.elem = $this;
			    
			if ( typeof $attr === 'undefined' ){
				_this.setAttr( $this, true );
			} else {
				$.parseJSON( $attr ) ? _this.setAttr( $this, false ) : _this.setAttr( $this, true );
			}
		},

		/**
		 * 下拉菜单元素取消
		 * @param  {Object} _this [指向 MDropdown 对象]
		 * @param  {Object} event [事件]
		 * @return {null}
		 */
		unaction: function( _this, event ){
			var $target = $(event.target),
			    $attr = $target.attr( _this.config.attr ) === _this.config.attrValue,
			    $elem = $attr ? $target : $target.parents('['+_this.config.attr+'="'+_this.config.attrValue+'"]').length;

			if ( !$elem ){
				_this.elem && _this.setAttr( _this.elem, false );
			}
		},

		/**
		 * 获取元素 Attr 属性
		 * @param  {Element}
		 * @return {String}
		 */
		getAttr: function( elem ){
			return elem.attr('aria-expanded');
		},

		/**
		 * 设置元素 Attr 属性
		 * @param  {Element}
		 * @param  {val}
		 * @return {null}
		 */
		setAttr: function( elem, val ){
			elem.attr('aria-expanded', val).parent()[val ? 'addClass' : 'removeClass']( this.config.parentClass );
		}
	};

	// .fn.init 继承 MDropdown 对象
	MDropdown.fn.init.prototype = MDropdown.prototype;

	return MDropdown;
});