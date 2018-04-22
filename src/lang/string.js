(function () {
    var _slice = Object.prototype.slice,
        STRING_CLASS = '[object String]';

    /**
     * 因为 typeof new String('foo') === 'object'
     * 所以不能用 typeof object === 'string' 的方法
     * @param object
     * @returns {boolean}
     */
    function isString(object) {
        return _slice.call(object) === STRING_CLASS;
    }
})