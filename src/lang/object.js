(function () {
   var _toString = Object.prototype.toString,
       _slice = Object.prototype.slice,
       NULL_TYPE = 'null',
       UNDEFINED_TYPE = 'undefined',
       BOOLEAN_TYPE = 'boolean',
       NUMBER_TYPE = 'number',
       STRING_TYPE = 'string',
       OBJECT_TYPE = 'object',
       FUNCTION_CLASS = '[object Function]',
       BOOLEAN_CLASS = '[object Boolean]',
       NUMBER_CLASS = '[object Number]',
       STRING_CLASS = '[object String]',
       ARRAY_CLASS = '[object Array]',
       OBJECT_CLASS = '[object Object]',
       DATE_CLASS = '[object Date]';

   function Type(o) {
       switch(o) {
           case null : return NULL_TYPE;
           case (void 0) : return UNDEFINED_TYPE;
       }
       var type = typeof o;
       switch (type) {
           case 'boolean' : return BOOLEAN_TYPE;
           case 'number' : return NUMBER_TYPE;
           case 'string' : return STRING_TYPE;
       }
       return OBJECT_TYPE;
   }

   function clone(object) {
       return extend({ }, object);
   }

    /**
     * 浅复制
     * @param destination
     * @param source
     * @returns {*}
     */
   function extend(destination, source) {
       for (var property in source)
           destination[property] = source[property]
       return destination;
   }

    /**
     * 深复制
     * @param destination
     * @param source
     * @returns {*}
     */
   function deepClone(destination, source) {
       for (var property in source) {
           if (_toString.call(source[property]) === ARRAY_CLASS || _toString.call(source[property]) === OBJECT_CLASS) {
               destination[property] = deepClone({}, source[property])
           } else {
               destination[property] = source[property]
           }
       }
       return destination;
   }

   function values(object) {
       var result = [];
       for (var property in object)
           result.push(object[property]);
       return result;
   }

   function isEmpty(object) {
       for (var property in object) {
           if (object[property])
               return false;
       }
       return true;
   }

   function isUndefined(object) {
       return typeof object === UNDEFINED_TYPE;
   }

   function isBoolean(object) {
       return _toString.call(object) === BOOLEAN_CLASS;
   }

   function isObject(object) {
       return _toString.call(object) === OBJECT_CLASS;
   }

    function isFunction(object) {
        return _toString.call(object) === FUNCTION_CLASS;
    }

    function isDate(object) {
        return _toString.call(object) === DATE_CLASS;
    }

    function isNumber(object) {
        return _toString.call(object) === NUMBER_CLASS;
    }

    function isString(object) {
        return _slice.call(object) === STRING_CLASS;
    }

    function toQueryString(object) {
       var result = [];
       Object.keys(object).forEach(function (value, key) {
           key = encodeURIComponent(key), values = value;

           if (values && typeof values == 'object') {
               if (Array.isArray(values)) {
                   var queryValues = [];
                   for (var i = 0, length = value.length; i < length; i++) {
                       value = values[i];
                       queryValues.push(toQueryPair(key, value));
                   }
                   result.push(queryValues)
               }
           } else {
               result.push(toQueryPair(key, values));
           }
       })
        return result.join('&');
    }

    function toQueryPair(key, value) {
       if (isUndefined(value)) return key;

       value = String.interpolate(value);

        // Normalize newlines as \r\n because the HTML spec says newlines should
        // be encoded as CRLFs.
       value = value.gsub(/(\r)?\n/, '\r\n');
       value = encodeURIComponent(value);
        // Likewise, according to the spec, spaces should be '+' rather than
        // '%20'.
       value = value.gsub(/%20/, '+');
       return key + '=' + value;
    }

    function toQueryParams(separator) {
        var match = String.strip().match(/([^?#]*)(#.*)?$/);
        if (!match) return { };

        var result = {};
        match[1].split(separator || '&').forEach(function (item) {
            var param = item.split('=');
            var key = decodeURIComponent(param[0]),
                value = decodeURIComponent(param[1]);

            if (value != undefined) {
                value = value.gsub('+', ' ');
                value = decodeURIComponent(value);
            }

            if (key in result) {
                if (!Array.isArray(result[key])) {
                    result[key] = [result[key]];
                    result[key].push(value);
                } else {
                    result[key] = value;
                }
            }
        });

        return result;
    }

   extend(Object, {
       values: values,
       extend: extend,
       clone: clone,
       deepClone: deepClone,
       toTemplateReplacements: clone, // template 中使用
       isEmpty: isEmpty,
       isUndefined: isUndefined,
       isBoolean: isBoolean,
       isObject: isObject,
       isFunction: isFunction,
       isDate: isDate,
       isNumber: isNumber,
       isString: isString,
       toQueryString: toQueryString,
       toQueryPair: toQueryPair,
       toQueryParams: toQueryParams
   })
})()