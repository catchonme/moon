(function () {

    var FUNCTION_CLASS = '[object Function]';

    function isFunction(object) {
        return Object.prototype.toString.call(object) === FUNCTION_CLASS;
    }
})