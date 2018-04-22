(function () {
    var _arrayProto = Array.prototype,
        _slice = _arrayProto.slice;

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

    /**
     * 数组去重，方法很多
     * 使用 ES6 filter 方法更简便
     * var res = arr.filter(function(value, index, arr) {
     *              return arr.indexOf(value) === index;
     *          }
     *          
     * @param arr
     * @returns {Array}
     */
    function unique(arr) {
        var result = [];
        for (var i=0, length=arr.length; i<length; i++) {
            if (result.indexOf(arr[i]) === -1) {
                result.push(arr[i])
            }
        }
        return result;
    }
    
    function largest(arr) {
        return Math.max.apply(Math, arr);
    }

    function smallest(arr) {
        return Math.min.apply(Math, arr);
    }

    Object.extend(_arrayProto, {
        toArray: toArray,
        clone: clone,
        clear: clear,
        flatten: flatten,
        unique: unique,
        largest: largest,
        smallest: smallest
    })
})()