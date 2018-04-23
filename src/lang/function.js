(function () {
    // bind, 参考 prototype 吧

    function emptyFunction() {

    }

    Object.extend(Function, {
        emptyFunction: emptyFunction
    })
})()