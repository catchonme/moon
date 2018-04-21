(function () {
    var NUMBER_CLASS = '[object Number]';

    /**
     * 因为 typeof new Number(123) === 'object'
     * 所以不能使用 typeof object === 'number' 的方法
     * @param object
     * @returns {boolean}
     */
    function isNumber(object) {
        return Object.prototype.toString.call(object) === NUMBER_CLASS;
    }

    /**
     * 取个什么名字好呢？感觉这个名字不太合适
     * @param object
     * @returns {boolean}
     */
    function beNaN(object) {
        return typeof object === 'number' && (object !== object);
    }
})