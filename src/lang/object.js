(function () {
   var _toString = Object.prototype.toString,
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

   function extend(destination, source) {
       for (var property in source)
           destination[property] = source[property]
       return destination;
   }

   function values(object) {
       var result = [];
       for (var property in object)
           result.push(object[property]);
       return result;
   }

   function isUndefined(object) {
       return typeof object === UNDEFINED_TYPE;
   }

   extend(Object, {
       values: values,
       isUndefined: isUndefined
   })
})()