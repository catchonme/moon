/** 依赖函数 */
var type = function (object) {
    var classType = Object.prototype.toString.call(object), type;
    switch (classType) {
        case '[object Null]': type = 'null';break;
        case '[object Undefined]': type = 'undefined';break;
        case '[object Number]': type = 'number';break;
        case '[object String]': type = 'string';break;
        case '[object Boolean]': type = 'boolean';break;
        case '[object Array]': type = 'array';break;
        case '[object Object]': type = 'object';break;
        case '[object Function]': type = 'function';break;
    }
    return type;
}

Function.prototype.overloadSetter = function(){
    var self = this;
    return function(a, b){
        if (a == null) return this;
        if (typeof a != 'string'){
            for (var k in a) self.call(this, k, a[k]);
        } else {
            self.call(this, a, b);
        }
        return this;
    };
};

Function.prototype.extend = function(key, value) {
    this[key] = value;
}.overloadSetter();

Function.prototype.implement = function(key, value) {
    this.prototype[key] = value;
}.overloadSetter();

Function.implement({
    hide: function() {
        this.$hidden = true;
        return this;
    },
    protect: function(){
        this.$protected = true;
        return this;
    }
});

var cloneOf = function(item) {
    switch(type(item)) {
        case 'array' : return item.clone();
        case 'object' : return Object.clone(item);
        default: return item;
    }
};

Array.implement('clone', function(){
    var i = this.length, clone = new Array(i);
    while(i--) clone[i] = cloneOf(this[i]);
    return clone;
});

var mergeOne = function(source, key, current) {
    switch (type(current)) {
        case 'object' :
            if (type(source[key]) == 'object') Object.merge(source[key], current);
            else source[key] = Object.clone(current);
            break;
        case 'array' :
            source[key] = current.clone();
            break;
        default : source[key] = current;
    }
    return source;
};

var extend = function(name, method) {
    if (method && method.$hidden) return;
    var previous = this[name];
    if (previous == null || !previous.$protected) this[name] = method;
};

Object.extend = extend.overloadSetter();
Object.extend({
    merge: function(source, k, v) {
        if (type(k) == 'string') return mergeOne(source, k, v);
        for (var i = 1, l = arguments.length; i < l; i++) {
            var object = arguments[i];
            for (var key in object) {
                mergeOne(source, key, object[key]);
            }
        }
        return source;
    },

    clone: function(object) {
        var clone = {};
        for (var key in object) clone[key] = cloneOf(object[key]);
        return clone;
    }
})

/** Class 主体 */
var Class = function(params) {
    var newClass = function () {
        reset(this);
        this.$caller = null;
        var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
        this.$caller = null;
        return value;
    }.extend(this).implement(params);
    
    newClass.prototype.parent = parent;
    
    return newClass;
};

var reset = function(object) {
    for (var key in object) {
        var value = object[key];
        switch (type(value)) {
            case 'object' :
                var F = function(){};
                F.prototype = value;
                object[key] = reset(new F);
                break;
            case 'array' :
                object[key] = value.clone();
                break;
        }
    }
    return object;
}

var implement = function (key, value, retain) {
    if (Class.Mutators.hasOwnProperty(key)) {
        value = Class.Mutators[key].call(this, value);
        if (value == null) return this;
    }

    if (type(value) == 'function') {
        this.prototype[key] = (retain) ? value : wrap(this, key, value);
    } else {
        Object.merge(this.prototype, key, value)
    }

    return this;
}

var parent = function() {
    if (!this.$caller) throw new Error('The method "parent" cannot be called');
    
    var name = this.$caller.$name,
        parent = this.$caller.$owner.parent,
        previous = (parent) ? parent.prototype[name] : null;
    
    if (!previous) throw new Error('The method "' + name + '" has no parent.');
    
    return previous.apply(this, arguments);
};

var wrap = function (self, key, method) {
    if (method.$origin) method = method.$origin;
    
    var wrapper = function () {
        if (method.$protected && this.$caller == null) throw new Error('The method "' + key + '" cannot be called.');
        
        var current = this.$caller;
        this.$caller = wrapper;
        var result = method.apply(this, arguments);
        this.$caller = current;
        
        return result;
    }.extend({$owner: self, $origin: method, $name: key});
    
    return wrapper;
}

var getInstance = function(klass) {
    var proto = new klass;
    return proto;
}

Class.implement('implement', implement.overloadSetter());

Class.Mutators = {
    Extends: function (parent) {
        this.parent = parent;
        this.prototype = getInstance(parent);
    },
    Implements: function (items) {
        var afterItems = [items];
        afterItems.forEach(function (item) {
            var instance = new item;
            for (var key in instance) {
                implement.call(this, key, instance[key], true)
            }
        }, this)
    }
};
