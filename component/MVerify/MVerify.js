/**
 * @name     MVerify
 * @desc     简单表单验证组件
 * @depend   jQuery 1.7+
 * @author   M.J
 * @date     2015-03-10
 * @URL      http://webjyh.com
 * @reutn    {MVerify}
 * @version  1.0.0
 *
 */
define(['jquery', 'ajaxForm'], function($) {

    "use strict";

    var 
        /** 匹配类型正则表达式
         * 1. 是否为数字
         * 2. IP地址
         * 3. 网址
         * 4. 邮箱
         * 5. 日期格式
         * 6. 手机号码
         * 7. 电话号码 (3-4位区号，7-8位直播号码，1－4位分机号)
         * 8. 密码（6-20）位
         * 9. 以字母开头，只能是字母或数字的文本
         * 10.匹配除 <, >, & 的任意字符
         */
        exps = {
            number: /^[-]?\d+(\.\d+)?$/,
            ip: /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/,
            url: /^((https?|ftp|news):\/\/)?([a-z]([a-z0-9\-]*[\.。])+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&]*)?)?(#[a-z][a-z0-9_]*)?$/,
            email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
            date: /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$/,
            mobile: /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/,
            phone: /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
            password: /^(\w){6,20}$/,
            simpletext: /^[a-zA-Z][a-zA-Z0-9_]*$/,
            text: /^[^<^>^&]*$/
        },

        /**
         * 默认插件配置
         * @type {Object}
         */
        defaults = {
            message: {
                required: "\u6b64\u9879\u4e3a\u5fc5\u586b\u9879",
                checkMinLen: '\u6700\u5c11\u4e0d\u80fd\u5c11\u4e8e\u007b\u0024\u0076\u0061\u006c\u007d\u4e2a\u5b57\u7b26',
                checkMaxLen: '\u6700\u591a\u4e0d\u80fd\u591a\u4e8e\u007b\u0024\u0076\u0061\u006c\u007d\u4e2a\u5b57\u7b26',
                number: '\u6b64\u5904\u53ea\u80fd\u586b\u5199\u6570\u5b57',
                ip: '\u8bf7\u586b\u5199\u6b63\u786e\u7684\u0020\u0069\u0070\u0020\u683c\u5f0f',
                url: '\u8bf7\u586b\u5199\u6b63\u786e\u7684\u7f51\u5740\u683c\u5f0f',
                email: '\u8bf7\u586b\u5199\u6b63\u786e\u7684\u0020\u0045\u006d\u0061\u0069\u006c\u0020\u683c\u5f0f',
                date: '\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u65e5\u671f\u683c\u5f0f',
                mobile: '\u8bf7\u586b\u5199\u6b63\u786e\u7684\u624b\u673a\u53f7\u7801',
                phone: '\u8bf7\u586b\u5199\u6b63\u786e\u7684\u7535\u8bdd\u53f7\u7801',
                password: '\u5bc6\u7801\u4e0d\u5f97\u5c11\u4e8e\u0036\u4e2a\u5b57\u7b26\u4e14\u4e0d\u80fd\u5927\u4e8e\u0032\u0030\u4e2a\u5b57\u7b26',
                simpletext: '\u53ea\u80fd\u4ee5\u82f1\u6587\u5f00\u5934\u4e14\u53ea\u80fd\u662f\u82f1\u6587\u6216\u6570\u5b57',
                text: '\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u5b57\u7b26',
                checkReg: '\u6b64\u9879\u683c\u5f0f\u9519\u8bef',
                runFuncName: '\u0021\u0020\u672a\u627e\u5230\u5b9a\u4e49\u7684\u0020\u0064\u0061\u0074\u0061\u002d\u0063\u0068\u0065\u0063\u006b\u0046\u0075\u006e\u0063\u003d\u0026\u0071\u0075\u006f\u0074\u003b\u0026\u0071\u0075\u006f\u0074\u003b\u0020\u65b9\u6cd5'
            },
            isShowText: false,   // 是否显示错误文本
            init: null,          // 加载完后回调 
            beforeSend: null,    // 提交之前函数  
            success: null,       // 提交成功回调
            error: null,         // 提交失败回调
            afterSend: null,     // 提交过后函数
            dataType: 'json',    // 请求的数据类型
            jsonp: false         // 是否跨越请求
        };


    // 构造函数
    var MVerify = function(elem, type, name, func) {

        // 设置默认配置项
        if (typeof type === 'object') {
       		this.config  = $.extend({}, defaults, type);
        }
        if (!this.config) {
            return false;
        }

        // 当前整个Form元素
        this.DOM = elem;

        // 用于标记错误重复添加
        this.rep = null;

        // 用于表示Ajax是否允许重复提交
        this.isSend = false;

        /**
         * 存放表单要检测的方法
         * this.handlers = [
         *     {elem: input.Elements, handler: [{type: 'required', value: null}, {type: 'checkMinLen', value: '5'}]},
         *     {elem: input.Elements, handler: [{type: 'required', value: null}, {type: 'checkMinLen', value: '5'}]}
         * ]
         */
        this.handlers = [];

        /**
         * 存放自定义扩展方法
         * this.events {
         *     functionName: function,
         *     functionName: function
         * }
         */
        this.events = {};

        // 初始化
        this.init().publist();

        // 加载回调函数 this.config.init
        if ($.isFunction(this.config.init)) {
            this.config.init.apply(this.DOM);
        }
    };

    MVerify.prototype = {
        init: function() {

            var $DOM = this.DOM,
                $elem = $('input[type="text"], textarea', $DOM),
                _this = this;

            $elem.each(function() {

                var elem = $(this),
                    handler = [],
                    required = elem.attr('data-required'),
                    dataType = elem.attr('data-checkType'),
                    minlength = elem.attr('data-minlength'),
                    maxlength = elem.attr('data-maxlength'),
                    reg = elem.attr('data-checkReg'),
                    func = elem.attr('data-checkFunc');

                if (required) handler.push({type: 'required', value: null});
                if (dataType) handler.push({type: 'checkType', value: dataType});
                if (minlength) handler.push({type: 'checkMinLen', value: minlength});
                if (maxlength) handler.push({type: 'checkMaxLen', value: maxlength});
                if (reg) handler.push({type: 'checkReg', value: reg});
                if (func) handler.push({type: 'runFuncName', value: func});

                _this.handlers.push({
                    elem: elem[0],
                    handler: handler
                });

            });
            
            return this;
        },

        /**
         * 暴露 showError 方法
         * @param  {Elements} elem 当前表单元素
         * @param  {String}   text 错误提示文字
         */
        showError: function(elem, text) {
            this.addErrorMark(elem, '', text, true);
        },

        /**
         * 错误处理标识添加
         * @param  {Elements} elem 当前表单元素
         * @param  {String}   type 当前所触发的类型
         * @param  {String}   val  当前所触发的值
         * @return {Boolean}       返回布尔值
         */
        addErrorMark: function(elem, type, val, diy) {
            var tpl = '<div class="clear"></div><span class="help-block">{text}</span>',
                _this = this,
                $parent = $(elem).parent(),
                $parents = $(elem).parents('.form-group');
                
            //防止重复 append
            if (!this.rep) {
                $(elem).focus();
                $parents.addClass('has-error');
                if (this.config.isShowText) {
                    if (typeof diy != 'undefined') {
                        tpl = tpl.replace('{text}', val);
                    } else {
                        if (type == 'checkMinLen' || type == 'checkMaxLen') {
                            this.config.message[type] = this.config.message[type].replace('{$val}', val);
                        } 
                        tpl = tpl.replace('{text}', this.config.message[type]);
                    }
                    $parent.append(tpl);
                }

                this.rep = true;
                setTimeout(function() {
                    _this.removeErrorMark(elem);
                }, 2500);
            }

            return false;
        },

        /**
         * 错误处理标识移除
         * @param  {Elements} elem 当前表单元素
         * @param  {String}   type 当前所触发的类型
         * @param  {String}   val  当前所触发的值
         * @return {Boolean}       返回布尔值
         */
        removeErrorMark: function(elem) {
            var $parent = $(elem).parent(),
                $parents = $(elem).parents('.form-group');

            $parents.removeClass('has-error');
            if (this.config.isShowText) {
                $parent.children('div.clear, span.help-block').remove();
            }

            //取消重复 append
            this.rep = false;
        },

        /**
         * 扩展自定义方法
         * @param {Elements} elem 当前元素
         * @param {String}   name 当前函数名
         * @param {Function} func 函数内容
         */
        addMethod: function(elem, name, func) {
            if (!name || !func) {
                return false;
            }
            this.events[name] = func;
        },

        /**
         * 验证必填项目
         * @param  {Elements} elem 当前表单元素
         * @param  {String}   type 当前所触发的类型
         * @param  {String}   val  当前所触发的值
         * @return {Boolean}       返回布尔值
         */
        required: function(elem, type, val) {
            var $elem = $(elem);
            if ($elem.val() != '' && $elem.val().length > 0) {
                return true;
            } else {
                return this.addErrorMark(elem, type);
            }
        },

        /**
         * 验证默认正则类型
         * @param  {Elements} elem 当前表单元素
         * @param  {String}   type 当前所触发的类型
         * @param  {String}   val  当前所触发的值
         * @return {Boolean}       返回布尔值
         */
        checkType: function(elem, type, val) {
            var $elem = $(elem),
                $val = $elem.val(),
                reg = new RegExp(exps[val]);

            if ($val != '' && $val.length > 0) {
                if (reg.test($val)) {
                    return true;
                } else {
                    return this.addErrorMark(elem, val);
                }
            } else {
                return true;
            }
        },

        /**
         * 检测最小长度
         * @param  {Elements} elem 当前表单元素
         * @param  {String}   type 当前所触发的类型
         * @param  {String}   val  当前所触发的值
         * @return {Boolean}       返回布尔值
         */
        checkMinLen: function(elem, type, val) {
            var $elem = $(elem),
                $val = $elem.val();

            if ($val != '' && $val.length > 0) {
                if ($val.length >= val) {
                    return true;
                } else {
                    return this.addErrorMark(elem, type, val);
                }
            } else {
                return true;
            }
        },

        /**
         * 检测最大长度
         * @param  {Elements} elem 当前表单元素
         * @param  {String}   type 当前所触发的类型
         * @param  {String}   val  当前所触发的值
         * @return {Boolean}       返回布尔值
         */
        checkMaxLen: function(elem, type, val) {
            var $elem = $(elem),
                $val = $elem.val();

            if ($val != '' && $val.length > 0) {
                if ($val.length <= val) {
                    return true;
                } else {
                    return this.addErrorMark(elem, type, val);
                }
            } else {
                return true;
            }
        },

        /**
         * 检测最大长度
         * @param  {Elements} elem 当前表单元素
         * @param  {String}   type 当前所触发的类型
         * @param  {String}   val  当前所触发的值
         * @return {Boolean}       返回布尔值
         */
        checkReg: function(elem, type, val) {
            var $elem = $(elem),
                $val = $elem.val(),
                reg = new RegExp(eval(val));

            if ($val != '' && $val.length > 0) {
                 if (reg.test($val)) {
                    return true;
                } else {
                    return this.addErrorMark(elem, type);
                }
            } else {
                return true;
            }
        },

        /**
         * 运行自定义函数
         * @param  {Elements} elem 当前表单元素
         * @param  {String}   type 当前所触发的类型
         * @param  {String}   val  当前所触发的值
         * @return {Boolean}       返回布尔值
         */
        runFuncName: function(elem, type, val) {
            var $elem = $(elem),
                $val = $elem.val();

            if ($val != '' && $val.length > 0) {
                if (this.events[val]) {
                   return this.events[val].apply(this, [elem]); 
                } else {
                    return this.addErrorMark(elem, type);
                }
            } else {
                return true;
            }
        },

        /**
         * 提交表单触发器
         * @return {null}
         */
        publist: function() {
            var $DOM = this.DOM,
                _this = this,
                handler = this.handlers,
                length =  handler.length,
                repeat = false; 

            var submit = function() {
                //防止连续点击而导致的多次遍历产生的性能问题
                if (repeat) return false;
                repeat = true;

                // 遍历所有要检测的 Element
                for(var i = 0; i < length; i++) {

                    // 元素上是否绑定检测方法
                    if ($.isArray(handler[i].handler) && handler[i].handler.length > 0) {

                        // 不检测隐藏元素
                        if (!$(handler[i].elem).is(':hidden')) {

                            var elem = handler[i].elem,
                                data = handler[i].handler;

                            // 遍历并执行所有绑定的检测方法
                            // 一但遇到 error 停止执行
                            for (var j = 0, len = data.length; j < len; j++) {
                                var result = _this[data[j].type](elem, data[j].type, data[j].value);
                                if (!result) {
                                    repeat = false;
                                    return false;
                                }
                            }
                        }
                    }
                }

                //准备检测发送数据
                repeat = false;

                 // 表单发送之前执行回调
                if ($.isFunction(_this.config.beforeSend)) {
                    var returns = _this.config.beforeSend.apply($DOM);
                    if (returns) {
                        _this.post();
                    }
                } else {
                    _this.post();
                }

                return false;
            };

            $DOM.on('submit', submit);
        },

        /**
         * 请求发送
         * @return {null}
         */
        post: function () {
            var _this = this,
                $DOM = this.DOM,
                action = $DOM.attr('action') || window.location.href,
                method = $DOM.attr('method') || 'get',
                data = $DOM.serializeArray();

            //防重复提交
            if (this.isSend) {
                return false;
            }
            this.isSend = true;
            
            $DOM.ajaxForm({
                url: action,
                type: method,
                dataType: this.config.dataType,
                success: function (responseText, statusText, xhr, $form) {
                    _this.isSend = false;
                    _this.config.success(responseText, statusText, xhr, $form);
                },
                error: function() {
                    _this.isSend = false;
                    if ($.isFunction(_this.config.error)) {
                       _this.config.error.apply($DOM); 
                    }
                }
            }).trigger('submit.form-plugin');
           

            //请求发送完之后回调
            if ($.isFunction(this.config.afterSend)) {
                this.config.afterSend.apply($DOM);
            }
        }
    };

    // 扩展jQuery
    $.fn.MVerify = function(type, name, func) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('MVerify');

            if (!data) $this.data('MVerify', (data = new MVerify($this, type, name, func)));
            if (typeof type === 'string') data[type].apply(data, [this[0], name, func]);
        });
    };
    
    return $;
});
