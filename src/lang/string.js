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

    function interpret(str) {
        return str == null ? '' : String(str);
    }

    function gsub(pattern, replacement) {
        var result = '', source = this, match;
        replacement = prepareReplacement(replacement);

        if (Object.isString(pattern)) {
            pattern = RegExp.escape(pattern);
        }

        if (!(pattern.length || isNonEmptyRegExp(pattern))) {
            replacement = replacement('');
            return replacement + source.split('').join(replacement) + replacement;
        }

        while(source.length > 0) {
            match = source.match(pattern)
            if (match && match[0].length > 0) {
                result += source.slice(0, match.index);
                result += String.interpret(replacement(match));
                source = source.slice(match.index + match[0].length);
            } else {
                result += source, source = '';
            }
        }
        return result;
    }

    function prepareReplacement(replacement) {
        if (Object.isFunction(replacement)) {
            return replacement;
        }

        return function(match) {
            return new Template(replacement, match);
        }
    }

    // In some versions of Chrome, an empty RegExp has "(?:)" as a `source`
    // property instead of an empty string.
    function isNonEmptyRegExp(regexp) {
        return regexp.source && regexp.source !== '(?:)';
    }

    Object.extend(String, {
        camelize: camelize,
        uncamelize: uncamelize,
        capitalize: capitalize,
        interpret: interpret,
        gsub: gsub,
    })
})()