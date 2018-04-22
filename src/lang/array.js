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

    /**
     * 使用 ES6的reduce方法更便捷
     * const flatten = arr => arr.reduce((a,b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
     * @param arr
     * @returns {Array}
     */
    function flatten(arr) {
        var result = [];
        function flattenRecursive(array) {
            for (var i=0, length=array.length; i< length; i++) {
                if (Array.isArray(array[i])) {
                    flattenRecursive(array[i])
                } else {
                    result.push(array[i]);
                }
            }
        }
        flattenRecursive(arr);
        return result;
    }

})()