(function () {

    var Class = this.Class = function (params) {
        if (params instanceof Function) params = {initialize: params};

        var newClass = function () {
            reset(this);
        }
    }

    var reset = function (object) {
        for (var key in object) {
            var value = object[key];
            switch (typeof(value)) {
                case 'object':
                    var F = function () {};
                    F.prototype = value;
                    object[key] = reset(new F);
                    break;
                case 'array': object[key] = value.clone(); break;
            }
        }
    }

    Function.prototype.overloadSetter = function (usePlural) {
        var self = this;
        return function (a, b) {
            if (a == null) return this;
            if (usePlural || typeof a != 'string') {
                for (var k in a) self.call(this, k, a[k]);
            } else {
                self.call(this, a, b);
            }
            return this;
        }
    }

    Function.prototype.extend = function (key, value) {
        this[key] = value;
    }.overloadSetter();

    Function.prototype.implement = function (key, value) {
        this.prototype[key] = value;
    }.overloadSetter();


})