(function () {
    var DATE_CLASS = '[object Date]';

    function isDate(object) {
        return Object.prototype.toString.call(object) === DATE_CLASS;
    }
})