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
       BOOLAEN_CLASS = '[object Boolean]',
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

    function isFunction(object) {
        return Object.prototype.toString.call(object) === FUNCTION_CLASS;
    }

    function isDate(object) {
        return Object.prototype.toString.call(object) === DATE_CLASS;
    }

    function isNumber(object) {
        return Object.prototype.toString.call(object) === NUMBER_CLASS;
    }

    function isString(object) {
        return _slice.call(object) === STRING_CLASS;
    }

   extend(Object, {
       values: values,
       extend: extend,
       clone: extend,
       deepClone: deepClone,
       isEmpty: isEmpty,
       isUndefined: isUndefined,
       isFunction: isFunction,
       isDate: isDate,
       isNumber: isNumber,
       isString: isString
   })
})()