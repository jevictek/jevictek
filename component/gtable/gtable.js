/**
 * @name     gtable
 * @desc     依赖服务端的表格排序
 * @depend   jQuery 1.7+
 * @author   M.J
 * @date     2015-03-20
 * @URL      http://webjyh.com
 * @reutn    {null}
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
        beforeSend: null
    };

    // URL 匹配
    var queryString = function (query) {
        if (typeof (query) == "object") { return query; }
        var regex = /([^\?\&\#\=]*)\=([^\?\&\#\=]*)/g;
        var obj = {};
        do {
            var param = regex.exec(query);
            if (param != null) {
                obj[decodeURIComponent(param[1])] = decodeURIComponent(param[2]);
            }
        } while (param != null);
        return obj;
    };

    // 构造函数
    var gtable = function(elem, options) {
        this.elem = $(elem);
        this.form = this.elem.parents('form');
        this.config = $.extend({}, defaults, options);
        this.elem.addClass('gtable');
        this.sort().addEvent();
    };

    gtable.prototype = {
        sort: function () {
            var sort,
                order,
                $input,
                _this = this,
                hash = window.location.hash,
                $table = this.elem,
                $form = this.form,
                $attr = $table.attr('data-orderbys');

            if ($attr === undefined) {
                return this;
            }

            $attr = $attr.split(',');
            if (!$.isArray($attr) && !$attr.length) {
                return this;
            }

            // 检测排序input
            $input = $('input[name="sort"]', $form);
            if (!$input.length) {
                $input = $('<input type="hidden" name="sort" />').appendTo($form);
            }

            //hash 检测
            var val = queryString(hash);
            if (val.sort !== undefined) {
                $input.val(val.sort);
            }

            sort = $input.val();
            order = sort.indexOf('-') > -1;
            sort = sort.replace('-', '');

            // 排序样式绑定
            var bind = function() {
                var $elem = $('#'+this, $table),
                    tpl = ' <i class="icon-sort{class}"></i>';

                if (!$elem.length) {
                    return;
                }

                //排序匹配
                if (sort && sort == this) {
                    tpl = order ? (tpl.replace('{class}', '-down')) : (tpl.replace('{class}', '-up'));
                    $elem.addClass('sort');
                } else {
                    tpl = tpl.replace('{class}', '');
                }
                $elem.attr('title', '\u6392\u5e8f').addClass('order').append(tpl);
            };
            $.each($attr, bind);

            // 排序事件绑定
            var events = function() {
                var val, result,
                    $elem = $(this),
                    attr = $elem.attr('id');

                if (attr == sort) {
                    $input.val(order ? attr : ('-'+attr));
                } else {
                    $input.val('-'+attr);
                }

                if ($.isFunction(_this.config.beforeSend)) {
                    result = _this.config.beforeSend();
                }

                if (result === false) {
                    return false;
                }
                debugger;
                $form.submit();
            };
            $form.off('click').on('click', 'th.order', events);
            return this;
        },
        addEvent: function() {
            var $input = $('input[type="checkbox"]', this.elem.find('tbody td')),
                $elem = $('input[type="checkbox"]', this.elem.find('th'));

            // 单击选中某行添加样式
            this.elem.off('click').on('click', 'tbody > tr', function() {
                var isActive = $(this).hasClass('active');
                $(this)[isActive ? 'removeClass' : 'addClass']('active');
                $(this).find('input[type="checkbox"]').prop('checked', isActive ? false : true);
            });

            // 全选，全不选
            if ($input.length) {
                $elem.off('click').on('click', function() {
                    var $elem = $(this),
                        isChecked = $elem.is(':checked');

                    $input.each(function() {
                        $(this).parents('tr')[isChecked ? 'addClass' : 'removeClass']('active');
                        $(this).prop('checked', isChecked);
                    })
                });
            }
            return this;
        }
    };

    $.fn.gtable = function (options) {
        this.each(function() {
            var $this = $(this),
                $data = $this.data('gTable');

            if (!$data) $this.data('gTable', new gtable(this, options));
        });
    };

    // 获取所有选中
    $.fn.getSelectAll = function () {
        var $this = $(this),
            result = [],
            $input = $('input[type="checkbox"]:checked', $this.find('tbody td'));
        $input.each(function() {
            var id = $(this).parents('tr').attr('id');
            if (id) {
                result.push(id);
            }
        });
        return result;
    };

    return $;    
}));