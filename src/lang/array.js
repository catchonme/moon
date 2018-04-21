(function () {
    var _arrayProto = Array.prototype,
        _slice = _arrayProto.slice;


    function isArray(object) {
        return Array.isArray(object);
    }

    function toArray() {
        return _slice.call(arguments);
    }

    // 写成 _slice.call(arguments) 应该是一样的
    function clone() {
        return _slice.call(this, 0);
    }

    function clear() {
        this.length = 0;
        return this;
    }

    function first() {
        return this[0];
    }

    function last() {
        return this[this.length - 1];
    }

    function flatten() {
        return
    }
})()