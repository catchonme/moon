(function () {
   // 参考 prototype 和 javascript dom 高级程序设计的 ads 库吧
    var ELEMENT_NODE = 1,
        ATTRIBUTE_NODE = 2,
        TEXT_NODE = 3,
        CDATA_SECTION_NODE = 4,
        WNTITY_REFERENCE_NODE = 5,
        ENTITY_NODE = 6,
        PROCESSING_INSTRUCTION_NODE = 7,
        COMMENT_NODE = 8,
        DOCUMENT_NODE = 9,
        DOCUMENT_TYPE_NODE = 10,
        DOCUMENT_FRAGMENT_NODE = 11,
        NOTAION_NODE = 12;

    function isElement(object) {
        return !!(object && object.nodeType == ELEMENT_NODE)
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

    /**
     * DOM 有 after 方法，直接使用 node.after(newNode) 可插入元素
     * 其他类似的DOM方法 before/remove/replaceWith
     */
    function insertAfter(node, referenceNode) {
        return referenceNode.parentNode.insertBefore(node, referenceNode.nextSibling);
    }

    function removeChild(parent) {
        while(parent.firstChild) {
            parent.firstChild.parentNode.removeChild(parent.firstChild)
        }
        return parent;
    }

    /**
     * Insert a new node as the first child
     * @param parent
     * @param newChild
     * @returns {*}
     */
    function prependChild(parent, newChild) {
        if (parent.firstChild) {
            parent.insertBefore(newChild, parent.firstChild);
        } else {
            parent.appendChild(newChild);
        }
        return parent;
    }

    /**
     * 处理 Node 下的每一个子节点
     * @param node
     * @param func
     */
    function walkTheDom(node, func) {
        func(node);
        node = node.firstChild;
        while (node) {
            walkTheDom(node, func);
            node = node.nextSibling;
        }
    }
})()