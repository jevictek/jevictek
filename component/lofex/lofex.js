/**
 * @name     lofex
 * @desc     简单的路由加载器
 * @depend   jQuery 1.7+
 * @author   M.J
 * @date     2015-03-16
 * @URL      http://webjyh.com
 * @reutn    {MVerify}
 * @version  1.0.0
 *
 */
(function(factory) {

    "use strict";

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }

}(function($) {

    "use strict";

    var defaults = {
        url: null,
        wrap: null,
        headers: {},
        dataType: 'html',
        select: '[data-lofex="lofex"]'
    };
    
    // 构造函数
    var lofex = function(options) {
        var _this = this;
        
        this.config = $.extend({}, defaults, options);
        this.isPushState = "pushState" in window.history;
        this.wrap = null;

        if (!this.config.url || !this.config.wrap) {
            return;
        }

        this.addEvent().post();
        $(document).off('click lofex').on('click lofex', this.config.select, function(e) { _this.init(e, this); });
    };

    lofex.prototype = {
        init: function (e, elem) {
            e.preventDefault();

            var $elem = $(elem),
                href = $elem.attr('href'),
                wrap = $elem.attr('lofex-wrap');
                
            if (!wrap || !href) return;
            this.wrap = wrap;
            
            this.href = href.indexOf('?') > -1 ? (href + '&lofexRoute') : (href + '?lofexRoute');
            this[this.isPushState ? 'pushState' : 'hashChange']();
        },
        addEvent: function() {
            var _this = this,
                location = window.location,
                oldHash = location.hash,
                isSupported = ("onhashchange" in window) && (document.documentMode === undefined || document.documentMode > 7);

            //IE 10+, Chrome, FireFox
            if (this.isPushState) {
                $(window).on('popstate', function(){ _this.post(); });
            } else {
                //IE 8, 9
                if (isSupported) {
                    $(window).on('hashchange', function(){ _this.post(); });
                } else {
                    //IE 6, 7
                    //检测 Hash 值
                    setInterval(function() {
                        var newHash = location.hash;
                        if (newHash != oldHash) {
                            _this.post();
                            oldHash = newHash;
                        }
                    }, 100);
                }
            }
            return this;
        },
        pushState: function () {
            window.history.pushState({lofex: 'lofex'}, '', this.href);
            this.post();
            return this;
        },
        hashChange: function() {
            var url = window.location.href;
            window.location.hash = '#' + url.replace(/^[^#]*#*(.*)$/, '') + this.href;
            return this;
        },
        post: function() {
            var $wrap, href,
                url = window.location.href,
                isHash = url.indexOf('#') > -1,
                isSend = url.indexOf('lofexRoute') > -1;

            if (!isHash && isSend) {
                $wrap = $(isSend ? this.wrap : this.config.wrap);
                href = isSend ? url : this.config.url;
            } else {
                $wrap = $( (isHash && isSend) ? this.wrap : this.config.wrap );
                if (isHash && isSend) {
                    var arr = url.match(/^.*#(.*)$/);
                    ($.isArray(arr) && arr.length > 0) ? (href = arr[1]) : (href = this.config.url);
                } else {
                    href = this.config.url;
                }
            }

            if (!$wrap.length) {
                $wrap = $(this.config.wrap);
            }

            $.ajax({
                type: 'post',
                headers: $.extend({}, {'embed': '1'}, this.config.headers),
                url: href,
                dataType: this.config.dataType
            })
            .done(function(data) {
                if (data) {
                    $wrap.empty().html(data);
                }
            });
        }
    };
    
    $.fn.lofex = function(options) {
        return new lofex(options);
    };

    return $;    
}));