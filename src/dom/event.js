(function () {

    function getEvent(W3CEvent) {
        return W3CEvent || window.event;
    }

    function getTarget(event) {
        event = getEvent(event);
        var target = event.target || event.srcElement;
        return target;
    }

    function getKeyPressed(event) {
        event = getEvent(event);
        var code = event.keyCode;
        var value = String.fromCharCode(code);
        return {'code':code,'value':value}
    }
})()