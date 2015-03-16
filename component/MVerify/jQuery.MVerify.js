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
(function($) {

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
}(jQuery));

/*!
 * jQuery Form Plugin
 * version: 3.51.0-2014.06.20
 * Requires jQuery v1.5 or later
 * Copyright (c) 2014 M. Alsup
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses.
 * https://github.com/malsup/form#copyright-and-license
 */
; !function (a) { "use strict"; "function" == typeof define && define.amd ? define(["jquery"], a) : a("undefined" != typeof jQuery ? jQuery : window.Zepto) }(function (a) { "use strict"; function b(b) { var c = b.data; b.isDefaultPrevented() || (b.preventDefault(), a(b.target).ajaxSubmit(c)) } function c(b) { var c = b.target, d = a(c); if (!d.is("[type=submit],[type=image]")) { var e = d.closest("[type=submit]"); if (0 === e.length) return; c = e[0] } var f = this; if (f.clk = c, "image" == c.type) if (void 0 !== b.offsetX) f.clk_x = b.offsetX, f.clk_y = b.offsetY; else if ("function" == typeof a.fn.offset) { var g = d.offset(); f.clk_x = b.pageX - g.left, f.clk_y = b.pageY - g.top } else f.clk_x = b.pageX - c.offsetLeft, f.clk_y = b.pageY - c.offsetTop; setTimeout(function () { f.clk = f.clk_x = f.clk_y = null }, 100) } function d() { if (a.fn.ajaxSubmit.debug) { var b = "[jquery.form] " + Array.prototype.join.call(arguments, ""); window.console && window.console.log ? window.console.log(b) : window.opera && window.opera.postError && window.opera.postError(b) } } var e = {}; e.fileapi = void 0 !== a("<input type='file'/>").get(0).files, e.formdata = void 0 !== window.FormData; var f = !!a.fn.prop; a.fn.attr2 = function () { if (!f) return this.attr.apply(this, arguments); var a = this.prop.apply(this, arguments); return a && a.jquery || "string" == typeof a ? a : this.attr.apply(this, arguments) }, a.fn.ajaxSubmit = function (b) { function c(c) { var d, e, f = a.param(c, b.traditional).split("&"), g = f.length, h = []; for (d = 0; g > d; d++) f[d] = f[d].replace(/\+/g, " "), e = f[d].split("="), h.push([decodeURIComponent(e[0]), decodeURIComponent(e[1])]); return h } function g(d) { for (var e = new FormData, f = 0; f < d.length; f++) e.append(d[f].name, d[f].value); if (b.extraData) { var g = c(b.extraData); for (f = 0; f < g.length; f++) g[f] && e.append(g[f][0], g[f][1]) } b.data = null; var h = a.extend(!0, {}, a.ajaxSettings, b, { contentType: !1, processData: !1, cache: !1, type: i || "POST" }); b.uploadProgress && (h.xhr = function () { var c = a.ajaxSettings.xhr(); return c.upload && c.upload.addEventListener("progress", function (a) { var c = 0, d = a.loaded || a.position, e = a.total; a.lengthComputable && (c = Math.ceil(d / e * 100)), b.uploadProgress(a, d, e, c) }, !1), c }), h.data = null; var j = h.beforeSend; return h.beforeSend = function (a, c) { c.data = b.formData ? b.formData : e, j && j.call(this, a, c) }, a.ajax(h) } function h(c) { function e(a) { var b = null; try { a.contentWindow && (b = a.contentWindow.document) } catch (c) { d("cannot get iframe.contentWindow document: " + c) } if (b) return b; try { b = a.contentDocument ? a.contentDocument : a.document } catch (c) { d("cannot get iframe.contentDocument: " + c), b = a.document } return b } function g() { function b() { try { var a = e(r).readyState; d("state = " + a), a && "uninitialized" == a.toLowerCase() && setTimeout(b, 50) } catch (c) { d("Server abort: ", c, " (", c.name, ")"), h(A), w && clearTimeout(w), w = void 0 } } var c = l.attr2("target"), f = l.attr2("action"), g = "multipart/form-data", j = l.attr("enctype") || l.attr("encoding") || g; x.setAttribute("target", o), (!i || /post/i.test(i)) && x.setAttribute("method", "POST"), f != m.url && x.setAttribute("action", m.url), m.skipEncodingOverride || i && !/post/i.test(i) || l.attr({ encoding: "multipart/form-data", enctype: "multipart/form-data" }), m.timeout && (w = setTimeout(function () { v = !0, h(z) }, m.timeout)); var k = []; try { if (m.extraData) for (var n in m.extraData) m.extraData.hasOwnProperty(n) && (a.isPlainObject(m.extraData[n]) && m.extraData[n].hasOwnProperty("name") && m.extraData[n].hasOwnProperty("value") ? k.push(a('<input type="hidden" name="' + m.extraData[n].name + '">').val(m.extraData[n].value).appendTo(x)[0]) : k.push(a('<input type="hidden" name="' + n + '">').val(m.extraData[n]).appendTo(x)[0])); m.iframeTarget || q.appendTo("body"), r.attachEvent ? r.attachEvent("onload", h) : r.addEventListener("load", h, !1), setTimeout(b, 15); try { x.submit() } catch (p) { var s = document.createElement("form").submit; s.apply(x) } } finally { x.setAttribute("action", f), x.setAttribute("enctype", j), c ? x.setAttribute("target", c) : l.removeAttr("target"), a(k).remove() } } function h(b) { if (!s.aborted && !F) { if (E = e(r), E || (d("cannot access response document"), b = A), b === z && s) return s.abort("timeout"), y.reject(s, "timeout"), void 0; if (b == A && s) return s.abort("server abort"), y.reject(s, "error", "server abort"), void 0; if (E && E.location.href != m.iframeSrc || v) { r.detachEvent ? r.detachEvent("onload", h) : r.removeEventListener("load", h, !1); var c, f = "success"; try { if (v) throw "timeout"; var g = "xml" == m.dataType || E.XMLDocument || a.isXMLDoc(E); if (d("isXml=" + g), !g && window.opera && (null === E.body || !E.body.innerHTML) && --G) return d("requeing onLoad callback, DOM not available"), setTimeout(h, 250), void 0; var i = E.body ? E.body : E.documentElement; s.responseText = i ? i.innerHTML : null, s.responseXML = E.XMLDocument ? E.XMLDocument : E, g && (m.dataType = "xml"), s.getResponseHeader = function (a) { var b = { "content-type": m.dataType }; return b[a.toLowerCase()] }, i && (s.status = Number(i.getAttribute("status")) || s.status, s.statusText = i.getAttribute("statusText") || s.statusText); var j = (m.dataType || "").toLowerCase(), k = /(json|script|text)/.test(j); if (k || m.textarea) { var l = E.getElementsByTagName("textarea")[0]; if (l) s.responseText = l.value, s.status = Number(l.getAttribute("status")) || s.status, s.statusText = l.getAttribute("statusText") || s.statusText; else if (k) { var o = E.getElementsByTagName("pre")[0], p = E.getElementsByTagName("body")[0]; o ? s.responseText = o.textContent ? o.textContent : o.innerText : p && (s.responseText = p.textContent ? p.textContent : p.innerText) } } else "xml" == j && !s.responseXML && s.responseText && (s.responseXML = H(s.responseText)); try { D = J(s, j, m) } catch (t) { f = "parsererror", s.error = c = t || f } } catch (t) { d("error caught: ", t), f = "error", s.error = c = t || f } s.aborted && (d("upload aborted"), f = null), s.status && (f = s.status >= 200 && s.status < 300 || 304 === s.status ? "success" : "error"), "success" === f ? (m.success && m.success.call(m.context, D, "success", s), y.resolve(s.responseText, "success", s), n && a.event.trigger("ajaxSuccess", [s, m])) : f && (void 0 === c && (c = s.statusText), m.error && m.error.call(m.context, s, f, c), y.reject(s, "error", c), n && a.event.trigger("ajaxError", [s, m, c])), n && a.event.trigger("ajaxComplete", [s, m]), n && !--a.active && a.event.trigger("ajaxStop"), m.complete && m.complete.call(m.context, s, f), F = !0, m.timeout && clearTimeout(w), setTimeout(function () { m.iframeTarget ? q.attr("src", m.iframeSrc) : q.remove(), s.responseXML = null }, 100) } } } var j, k, m, n, o, q, r, s, t, u, v, w, x = l[0], y = a.Deferred(); if (y.abort = function (a) { s.abort(a) }, c) for (k = 0; k < p.length; k++) j = a(p[k]), f ? j.prop("disabled", !1) : j.removeAttr("disabled"); if (m = a.extend(!0, {}, a.ajaxSettings, b), m.context = m.context || m, o = "jqFormIO" + (new Date).getTime(), m.iframeTarget ? (q = a(m.iframeTarget), u = q.attr2("name"), u ? o = u : q.attr2("name", o)) : (q = a('<iframe name="' + o + '" src="' + m.iframeSrc + '" />'), q.css({ position: "absolute", top: "-1000px", left: "-1000px" })), r = q[0], s = { aborted: 0, responseText: null, responseXML: null, status: 0, statusText: "n/a", getAllResponseHeaders: function () { }, getResponseHeader: function () { }, setRequestHeader: function () { }, abort: function (b) { var c = "timeout" === b ? "timeout" : "aborted"; d("aborting upload... " + c), this.aborted = 1; try { r.contentWindow.document.execCommand && r.contentWindow.document.execCommand("Stop") } catch (e) { } q.attr("src", m.iframeSrc), s.error = c, m.error && m.error.call(m.context, s, c, b), n && a.event.trigger("ajaxError", [s, m, c]), m.complete && m.complete.call(m.context, s, c) } }, n = m.global, n && 0 === a.active++ && a.event.trigger("ajaxStart"), n && a.event.trigger("ajaxSend", [s, m]), m.beforeSend && m.beforeSend.call(m.context, s, m) === !1) return m.global && a.active--, y.reject(), y; if (s.aborted) return y.reject(), y; t = x.clk, t && (u = t.name, u && !t.disabled && (m.extraData = m.extraData || {}, m.extraData[u] = t.value, "image" == t.type && (m.extraData[u + ".x"] = x.clk_x, m.extraData[u + ".y"] = x.clk_y))); var z = 1, A = 2, B = a("meta[name=csrf-token]").attr("content"), C = a("meta[name=csrf-param]").attr("content"); C && B && (m.extraData = m.extraData || {}, m.extraData[C] = B), m.forceSync ? g() : setTimeout(g, 10); var D, E, F, G = 50, H = a.parseXML || function (a, b) { return window.ActiveXObject ? (b = new ActiveXObject("Microsoft.XMLDOM"), b.async = "false", b.loadXML(a)) : b = (new DOMParser).parseFromString(a, "text/xml"), b && b.documentElement && "parsererror" != b.documentElement.nodeName ? b : null }, I = a.parseJSON || function (a) { return window.eval("(" + a + ")") }, J = function (b, c, d) { var e = b.getResponseHeader("content-type") || "", f = "xml" === c || !c && e.indexOf("xml") >= 0, g = f ? b.responseXML : b.responseText; return f && "parsererror" === g.documentElement.nodeName && a.error && a.error("parsererror"), d && d.dataFilter && (g = d.dataFilter(g, c)), "string" == typeof g && ("json" === c || !c && e.indexOf("json") >= 0 ? g = I(g) : ("script" === c || !c && e.indexOf("javascript") >= 0) && a.globalEval(g)), g }; return y } if (!this.length) return d("ajaxSubmit: skipping submit process - no element selected"), this; var i, j, k, l = this; "function" == typeof b ? b = { success: b } : void 0 === b && (b = {}), i = b.type || this.attr2("method"), j = b.url || this.attr2("action"), k = "string" == typeof j ? a.trim(j) : "", k = k || window.location.href || "", k && (k = (k.match(/^([^#]+)/) || [])[1]), b = a.extend(!0, { url: k, success: a.ajaxSettings.success, type: i || a.ajaxSettings.type, iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank" }, b); var m = {}; if (this.trigger("form-pre-serialize", [this, b, m]), m.veto) return d("ajaxSubmit: submit vetoed via form-pre-serialize trigger"), this; if (b.beforeSerialize && b.beforeSerialize(this, b) === !1) return d("ajaxSubmit: submit aborted via beforeSerialize callback"), this; var n = b.traditional; void 0 === n && (n = a.ajaxSettings.traditional); var o, p = [], q = this.formToArray(b.semantic, p); if (b.data && (b.extraData = b.data, o = a.param(b.data, n)), b.beforeSubmit && b.beforeSubmit(q, this, b) === !1) return d("ajaxSubmit: submit aborted via beforeSubmit callback"), this; if (this.trigger("form-submit-validate", [q, this, b, m]), m.veto) return d("ajaxSubmit: submit vetoed via form-submit-validate trigger"), this; var r = a.param(q, n); o && (r = r ? r + "&" + o : o), "GET" == b.type.toUpperCase() ? (b.url += (b.url.indexOf("?") >= 0 ? "&" : "?") + r, b.data = null) : b.data = r; var s = []; if (b.resetForm && s.push(function () { l.resetForm() }), b.clearForm && s.push(function () { l.clearForm(b.includeHidden) }), !b.dataType && b.target) { var t = b.success || function () { }; s.push(function (c) { var d = b.replaceTarget ? "replaceWith" : "html"; a(b.target)[d](c).each(t, arguments) }) } else b.success && s.push(b.success); if (b.success = function (a, c, d) { for (var e = b.context || this, f = 0, g = s.length; g > f; f++) s[f].apply(e, [a, c, d || l, l]) }, b.error) { var u = b.error; b.error = function (a, c, d) { var e = b.context || this; u.apply(e, [a, c, d, l]) } } if (b.complete) { var v = b.complete; b.complete = function (a, c) { var d = b.context || this; v.apply(d, [a, c, l]) } } var w = a("input[type=file]:enabled", this).filter(function () { return "" !== a(this).val() }), x = w.length > 0, y = "multipart/form-data", z = l.attr("enctype") == y || l.attr("encoding") == y, A = e.fileapi && e.formdata; d("fileAPI :" + A); var B, C = (x || z) && !A; b.iframe !== !1 && (b.iframe || C) ? b.closeKeepAlive ? a.get(b.closeKeepAlive, function () { B = h(q) }) : B = h(q) : B = (x || z) && A ? g(q) : a.ajax(b), l.removeData("jqxhr").data("jqxhr", B); for (var D = 0; D < p.length; D++) p[D] = null; return this.trigger("form-submit-notify", [this, b]), this }, a.fn.ajaxForm = function (e) { if (e = e || {}, e.delegation = e.delegation && a.isFunction(a.fn.on), !e.delegation && 0 === this.length) { var f = { s: this.selector, c: this.context }; return !a.isReady && f.s ? (d("DOM not ready, queuing ajaxForm"), a(function () { a(f.s, f.c).ajaxForm(e) }), this) : (d("terminating; zero elements found by selector" + (a.isReady ? "" : " (DOM not ready)")), this) } return e.delegation ? (a(document).off("submit.form-plugin", this.selector, b).off("click.form-plugin", this.selector, c).on("submit.form-plugin", this.selector, e, b).on("click.form-plugin", this.selector, e, c), this) : this.ajaxFormUnbind().bind("submit.form-plugin", e, b).bind("click.form-plugin", e, c) }, a.fn.ajaxFormUnbind = function () { return this.unbind("submit.form-plugin click.form-plugin") }, a.fn.formToArray = function (b, c) { var d = []; if (0 === this.length) return d; var f, g = this[0], h = this.attr("id"), i = b ? g.getElementsByTagName("*") : g.elements; if (i && !/MSIE 8/.test(navigator.userAgent) && (i = a(i).get()), h && (f = a(":input[form=" + h + "]").get(), f.length && (i = (i || []).concat(f))), !i || !i.length) return d; var j, k, l, m, n, o, p; for (j = 0, o = i.length; o > j; j++) if (n = i[j], l = n.name, l && !n.disabled) if (b && g.clk && "image" == n.type) g.clk == n && (d.push({ name: l, value: a(n).val(), type: n.type }), d.push({ name: l + ".x", value: g.clk_x }, { name: l + ".y", value: g.clk_y })); else if (m = a.fieldValue(n, !0), m && m.constructor == Array) for (c && c.push(n), k = 0, p = m.length; p > k; k++) d.push({ name: l, value: m[k] }); else if (e.fileapi && "file" == n.type) { c && c.push(n); var q = n.files; if (q.length) for (k = 0; k < q.length; k++) d.push({ name: l, value: q[k], type: n.type }); else d.push({ name: l, value: "", type: n.type }) } else null !== m && "undefined" != typeof m && (c && c.push(n), d.push({ name: l, value: m, type: n.type, required: n.required })); if (!b && g.clk) { var r = a(g.clk), s = r[0]; l = s.name, l && !s.disabled && "image" == s.type && (d.push({ name: l, value: r.val() }), d.push({ name: l + ".x", value: g.clk_x }, { name: l + ".y", value: g.clk_y })) } return d }, a.fn.formSerialize = function (b) { return a.param(this.formToArray(b)) }, a.fn.fieldSerialize = function (b) { var c = []; return this.each(function () { var d = this.name; if (d) { var e = a.fieldValue(this, b); if (e && e.constructor == Array) for (var f = 0, g = e.length; g > f; f++) c.push({ name: d, value: e[f] }); else null !== e && "undefined" != typeof e && c.push({ name: this.name, value: e }) } }), a.param(c) }, a.fn.fieldValue = function (b) { for (var c = [], d = 0, e = this.length; e > d; d++) { var f = this[d], g = a.fieldValue(f, b); null === g || "undefined" == typeof g || g.constructor == Array && !g.length || (g.constructor == Array ? a.merge(c, g) : c.push(g)) } return c }, a.fieldValue = function (b, c) { var d = b.name, e = b.type, f = b.tagName.toLowerCase(); if (void 0 === c && (c = !0), c && (!d || b.disabled || "reset" == e || "button" == e || ("checkbox" == e || "radio" == e) && !b.checked || ("submit" == e || "image" == e) && b.form && b.form.clk != b || "select" == f && -1 == b.selectedIndex)) return null; if ("select" == f) { var g = b.selectedIndex; if (0 > g) return null; for (var h = [], i = b.options, j = "select-one" == e, k = j ? g + 1 : i.length, l = j ? g : 0; k > l; l++) { var m = i[l]; if (m.selected) { var n = m.value; if (n || (n = m.attributes && m.attributes.value && !m.attributes.value.specified ? m.text : m.value), j) return n; h.push(n) } } return h } return a(b).val() }, a.fn.clearForm = function (b) { return this.each(function () { a("input,select,textarea", this).clearFields(b) }) }, a.fn.clearFields = a.fn.clearInputs = function (b) { var c = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; return this.each(function () { var d = this.type, e = this.tagName.toLowerCase(); c.test(d) || "textarea" == e ? this.value = "" : "checkbox" == d || "radio" == d ? this.checked = !1 : "select" == e ? this.selectedIndex = -1 : "file" == d ? /MSIE/.test(navigator.userAgent) ? a(this).replaceWith(a(this).clone(!0)) : a(this).val("") : b && (b === !0 && /hidden/.test(d) || "string" == typeof b && a(this).is(b)) && (this.value = "") }) }, a.fn.resetForm = function () { return this.each(function () { ("function" == typeof this.reset || "object" == typeof this.reset && !this.reset.nodeType) && this.reset() }) }, a.fn.enable = function (a) { return void 0 === a && (a = !0), this.each(function () { this.disabled = !a }) }, a.fn.selected = function (b) { return void 0 === b && (b = !0), this.each(function () { var c = this.type; if ("checkbox" == c || "radio" == c) this.checked = b; else if ("option" == this.tagName.toLowerCase()) { var d = a(this).parent("select"); b && d[0] && "select-one" == d[0].type && d.find("option").selected(!1), this.selected = b } }) }, a.fn.ajaxSubmit.debug = !1 });
