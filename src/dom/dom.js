(function () {
   // 参考 prototype 和 javascript dom 高级程序设计的 ads 库吧
    var ELEMENT_TYPE = 1;

    function isElement(object) {
        return !!(object && object.nodeType == ELEMENT_TYPE)
    }

    function $(element) {
        if (arguments.length > 1) {
            for (var i=0, elements = [], length=arguments.length; i<length; i++) {
                elements.push($(element[i]))
            }
            return elements;
        }

        if (Object.isString(element)) {
            element = document.querySelector(element);
        }
        return element;
    }
})()