(function () {

    function getKeyPressed(event) {
        event = getEvent(event);
        var code = event.keyCode;
        var value = String.fromCharCode(code);
        return {'code':code,'value':value}
    }

    function getEvent(W3CEvent) {
        return W3CEvent || window.event;
    }

    function getTarget(event) {
        event = getEvent(event);
        var target = event.target || event.srcElement;
        return target;
    }

    function stopPropagation(event) {
        event = getEvent(event);
        if (event.stopPropagation) {
            event.stopPropagation()
        } else {
            event.cancelBubble = true;
        }
    }

    function preventDefault(event) {
        event = getEvent(event);
        if (event.preventDefault) {
            event.preventDefault()
        } else {
            event.returnValue = false;
        }
    }

    function stop(event) {
        stopPropagation(event);
        preventDefault(event);
    }

    function addEvent(node, type, handler) {
        if (node.addEventListener) {
            node.addEventListener(type, handler, false);
            return true;
        } else if (node.attachEvent) {
            node.attachEvent('on'+type, handler)
        } else {
            node["on" + type] = handler;
        }
    }

    function removeEvent(node, type, handler) {
        if (node.removeEventListener) {
            node.removeEventListener(type, handler, false);
        } else if (node.detach) {
            node.detachEvent("on"+type, handler)
        }
    }

    // 用户自定义事件绑定
})()