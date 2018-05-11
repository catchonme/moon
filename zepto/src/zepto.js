(function (global, factory) {
    if (typeof define === 'function' && define.amd)
        define(function(){ return factory(global) })
    else
        factory(global)
}(this, function(window) {

    var Zepto = (function() {
        var $, zepto = {},
        fragmentRE = /^\s*<(\w+|!)[^>]*>/;

        function Z(dom, selector) {
            var i, len = dom ? dom.length : 0;
            for (i = 0; i < len; i++) this[i] = dom[i]
            this.length = len;
            this.selector = selector || '';
        }

        zepto.Z = function(dom, selector) {
            return new Z(dom, selector)
        }

        zepto.init = function(selector, context) {
            var dom
            // If nothing given, return an empty Zepto collection
            if (!selector) return zepto.Z()
            // Optimize for string selectors
            else if (typeof selector == 'string') {
                selector = selector.trim()
                // If it's a html fragment, create nodes from it
                // Note: In both Chrome 21 and Firefox 15, DOM error 12
                // is thrown if the fragment doesn't begin with <
                if (selector[0] == '<' && fragmentRE.test(selector))
                    dom = zepto.fragment(selector, RegExp.$1, context), selector = null
                // If there's a context, create a collection on that context first, and select
                // nodes from there
                else if (context !== undefined) return $(context).find(selector)
                // If it's a CSS selector, use it to select nodes.
                else dom = zepto.qsa(document, selector)
            }
            // If a function is given, call it when the DOM is ready
            else if (isFunction(selector)) return $(document).ready(selector)
            // If a Zepto collection is given, just return it
            else if (zepto.isZ(selector)) return selector
            else {
                // normalize array if an array of nodes is given
                if (isArray(selector)) dom = compact(selector)
                // Wrap DOM nodes.
                else if (isObject(selector))
                    dom = [selector], selector = null
                // If it's a html fragment, create nodes from it
                else if (fragmentRE.test(selector))
                    dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
                // If there's a context, create a collection on that context first, and select
                // nodes from there
                else if (context !== undefined) return $(context).find(selector)
                // And last but no least, if it's a CSS selector, use it to select nodes.
                else dom = zepto.qsa(document, selector)
            }
            // create a new Zepto collection from the nodes found
            return zepto.Z(dom, selector)
        }

        $ = function (selector, context) {
            return zepto.init(selector, context);
        }


        /**
         * 依赖函数
         */
        // region
        var isArray = Array.isArray ||
            function(object){ return object instanceof Array }
        var singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
        var emptyArray = [], filter = emptyArray.filter, slice = emptyArray.slice;

        function isFunction(value) { return type(value) == "function" }
        function isObject(obj)     { return type(obj) == "object" }
        function isWindow(obj)     { return obj != null && obj == obj.window }
        function isPlainObject(obj) {
            return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
        }
        function compact(array) { return filter.call(array, function(item){ return item != null }) }

        zepto.fragment = function(html, name, properties) {
            var dom, nodes, container

            // A special case optimization for a single tag
            if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

            if (!dom) {
                if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
                if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
                if (!(name in containers)) name = '*'

                container = containers[name]
                container.innerHTML = '' + html
                dom = $.each(slice.call(container.childNodes), function(){
                    container.removeChild(this)
                })
            }

            if (isPlainObject(properties)) {
                nodes = $(dom)
                $.each(properties, function(key, value) {
                    if (methodAttributes.indexOf(key) > -1) nodes[key](value)
                    else nodes.attr(key, value)
                })
            }

            return dom
        }
        var simpleSelectorRE = /^[\w-]*$/;
        zepto.qsa = function(element, selector){
            var found,
                maybeID = selector[0] == '#',
                maybeClass = !maybeID && selector[0] == '.',
                nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
                isSimple = simpleSelectorRE.test(nameOnly)
            return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
                ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
                (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
                    slice.call(
                        isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
                            maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
                                element.getElementsByTagName(selector) : // Or a tag
                            element.querySelectorAll(selector) // Or it's not simple, and we need to query all
                    )
        }
        zepto.isZ = function(object) {
            return object instanceof zepto.Z
        }

        var readyRE = /complete|loaded|interactive/;
        function likeArray(obj) {
            var length = !!obj && 'length' in obj && obj.length,
                type = $.type(obj)

            return 'function' != type && !isWindow(obj) && (
                'array' == type || length === 0 ||
                (typeof length == 'number' && length > 0 && (length - 1) in obj)
            )
        }
        $.fn = {
            ready: function(callback){
                // need to check if document.body exists for IE as that browser reports
                // document ready when it hasn't yet created the body element
                if (readyRE.test(document.readyState) && document.body) callback($)
                else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
                return this
            },
        }
        $.each = function(elements, callback){
            var i, key
            if (likeArray(elements)) {
                for (i = 0; i < elements.length; i++)
                    if (callback.call(elements[i], i, elements[i]) === false) return elements
            } else {
                for (key in elements)
                    if (callback.call(elements[key], key, elements[key]) === false) return elements
            }

            return elements
        }

        /** 依赖函数结束 endregion */

        zepto.Z.prototype = Z.prototype = $.fn;
        $.zepto = zepto;

        return $;
    })()

    window.Zepto = Zepto;
    window.$ === undefined && (window.$ = Zepto)
}))

/**
 $ 是一个对外输出的函数，调用 zepto.init 函数
 zepto.init 函数中 返回 zepto.Z 函数
 zepto.Z 函数实例化 Z 函数
 这样，开发者使用 $ ，就是直接在调用函数，可以使用 $.each 也就是使用实例原型上的方法来处理数据了
 */