(function () {
   var Template = function (template, object, pattern) {
       const defaultPattern = /(^|.|\r|\n)(#\{(.*?)\})/;
       this.template = template.toString();
       this.pattern = pattern || defaultPattern;

       if (object && Object.isObject(object))
           object = Object.toTemplateReplacements(object);

       return this.template.gsub(this.pattern, function (match) {
           if (object == null) return (match[1] + '');

           var before = match[1] || '';
           if (before == '\\') return match[2];

           var ctx = object, expr = match[3],
               pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;

           match = pattern.exec(expr);
           if (match == null) return before;

           while(match != null) {
               var comp = match[1].startsWith('[') ? match[2].replace(/\\\\]/g, ']') : match[1];
               ctx = ctx[comp];
               if (null == ctx || '' == match[3]) break;
               expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
               match = pattern.exec(expr);
           }

           return before + String.interpret(ctx);
       });
   }

   return {
       Template: Template
   }
})()