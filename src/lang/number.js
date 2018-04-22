(function () {

    /**
     * 取个什么名字好呢？感觉这个名字不太合适
     * @param object
     * @returns {boolean}
     */
    function beNaN(object) {
        return typeof object === 'number' && (object !== object);
    }
})()