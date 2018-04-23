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

    function capitalize(str) {
        return str.replace(/\b[a-z]/g, function(strMatch) {
            return match.toUpperCase();
        })
    }

    Object.extend(String, {
        camelize: camelize,
        uncamelize: uncamelize
    })
})()