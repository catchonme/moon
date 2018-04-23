(function(){

    /* 样式的设置与获取 */
    function setStyle(element, styles) {
        element = $(element);
        for (var property in styles) {
            if (element.style.setProperty) {
                // DOM2 Style method
                element.style.setProperty(
                    String.uncamelize(property,'-'), styles[property], null
                )
            } else {
                // alternative method
                element.style[camelize(property)] = styles[property];
            }
        }
    }

    /**
     * 也能够获取 opacity
     * @param element
     * @param name
     * @returns {*}
     */
    function getStyle(element, name) {
        element = $(element);
        // 直接在元素上使用 style 的样式
        if (element.style[name]) {
            return element.style[name];
            // 使用 IE 的方法
        } else if (element.currentStyle) {
            return element.currentStyle[name];
            // 使用 W3C 的方法
        } else if (document.defaultView && document.defaultView.getComputedStyle) {
            var style = document.defaultView.getComputedStyle(element, "");
            return style && style.getPropertyValue(name);
        } else {
            return null;
        }
    }

    function getClass(element) {
        element = $(element);
        return element.className.replace(/\s+/, ' ').split(' ');
    }

    function hasClass(element, className) {
        var classes = getClass(element);
        for (var i=0, length=classes.length; i<length; i++) {
            if (classes[i] === className) {
                return true;
            }
        }
        return false;
    }

    function addClass(element, className) {
        element.className += (element.className ? ' ' : '') + className;
        return true;
    }

    function removeClass(element, className) {
        var classes = getClass(element);
        for (var i=0, length=classes.length; i<length; i++) {
            if (classes[i] === className) {
                delete(classes[i]);
            }
        }
        element.className = classes.join(' ');
        return (length === classes.length ? false : true);
    }

    /* 元素的位置 */
    function getDimensions(element) {
        element = $(element);
        var display = getStyle(element, 'display');

        if (display && display !== 'none') {
            return { width: element.offsetWidth, height: element.offsetHeight };
        }

        // All *Width and *Height properties give 0 on elements with
        // `display: none`, so show the element temporarily.
        var style = element.style;
        var originalStyles = {
            visibility: style.visibility,
            position: style.position,
            display: style.display
        };

        var newStyles = {
            visibility: 'hidden',
            display: 'block'
        };

        // Switching `fixed` to `absolute` causes issues in Safari.
        if (originalStyles.position !== 'fixed') {
            newStyles.position = 'absolute';
        }

        setStyle(element, newStyles);

        var dimensions = {
            width: element.offsetWidth,
            height: element.offsetHeight
        };

        setStyle(element, originalStyles);

        return dimensions;
    }

    function getWidth(element) {
        return getDimensions(element).width;
    }

    function getHeight(element) {
        return getDimensions(element).height;
    }
})();

(function() {

    /**
     * document.viewport
     * 来源 prototype\dom\layout
     */
    var ROOT = null;
    function getRootElement() {
        if (ROOT) return ROOT;
        ROOT = document.documentElement;
        return ROOT;
    }

    function getDimensions() {
        return { width: this.getWidth(), height: this.getHeight() };
    }

    function getWidth() {
        return getRootElement().clientWidth;
    }

    function getHeight() {
        return getRootElement().clientHeight;
    }

    /**
     *   document.viewport.getScrollOffsets();
     *   //-> { left: 0, top: 0 }
     *
     *   window.scrollTo(0, 120);
     *   document.viewport.getScrollOffsets();
     *   //-> { left: 0, top: 120 }
     */
    function getScrollOffsets() {
        var x = window.pageXOffset || document.documentElement.scrollLeft ||
            document.body.scrollLeft;
        var y = window.pageYOffset || document.documentElement.scrollTop ||
            document.body.scrollTop;
        return { x: x, y: y };
    }

    document.viewport = {
        getDimensions : getDimensions,
        getWidth: getWidth,
        getHeight: getHeight,
        getScrollOffsets: getScrollOffsets
    };
})()