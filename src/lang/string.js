(function () {
    // 暂时参考 prototype
    function camelize(str) {
        return str.replace(/-(\w)/g, function (strMatch, p1) {
            return p1.toUpperCase();
        })
    }

    function uncamelize(str, sep) {
        sep = sep || '-';
        return str.replace(/([a-z])([A-Z])/g, function (strMatch, p1, p2) {
            return p1 + sep + p2.toLowerCase();
        })
    }
})()