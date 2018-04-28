/**
 * 来源 mootools
 */

/* 依赖函数 */
Function.prototype.overloadSetter = function(usePlural){
    var self = this;
    return function(a, b){
        if (a == null) return this;
        if (usePlural || typeof a != 'string'){
            for (var k in a) self.call(this, k, a[k]);
        } else {
            self.call(this, a, b);
        }
        return this;
    };
};

Function.prototype.extend = function(key, value){
    this[key] = value;
}.overloadSetter();

Function.prototype.implement = function(key, value){
    this.prototype[key] = value;
}.overloadSetter();

Function.implement({

    hide: function(){
        this.$hidden = true;
        return this;
    },

    protect: function(){
        this.$protected = true;
        return this;
    }

});

var cloneOf = function(item){
    switch (typeof(item)){
        case 'array': return item.clone();
        case 'object': return Object.clone(item);
        default: return item;
    }
};

Array.implement('clone', function(){
    var i = this.length, clone = new Array(i);
    while (i--) clone[i] = cloneOf(this[i]);
    return clone;
});

var mergeOne = function(source, key, current){
    switch (typeof(current)){
        case 'object':
            if (typeof(source[key]) == 'object') Object.merge(source[key], current);
            else source[key] = Object.clone(current);
            break;
        case 'array': source[key] = current.clone(); break;
        default: source[key] = current;
    }
    return source;
};

var extend = function(name, method){
    if (method && method.$hidden) return;
    var previous = this[name];
    if (previous == null || !previous.$protected) this[name] = method;
};
Object.extend = extend.overloadSetter();
Object.extend({
    merge: function (source, k, v) {
        if (typeof(k) == 'string') return mergeOne(source, k, v);
        for (var i = 1, l = arguments.length; i < l; i++) {
            var object = arguments[i];
            for (var key in object) mergeOne(source, key, object[key]);
        }
        return source;
    },

    clone: function(object){
        var clone = {};
        for (var key in object) clone[key] = cloneOf(object[key]);
        return clone;
    },
})

/* class 主体 */
// 新建一个 Class 的类
var Class = function(params){

    var newClass = function(){
        // 解除属性里对其他对象的引用
        reset(this);

        this.$caller = null;
        // 有初始化函数的话，就传入参数到该初始化函数并执行，没有就返回自身
        var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;

        this.$caller = null;
        return value;
        // 新生成的函数 newClass 与 this 绑定，
        // implement(params) 把 params 的所有方法都添加到当前类中
    }.extend(this).implement(params);

    // 给当前类增加一个原型方法 parent ，这样在当前类的函数中，可以使用 this.parent(args) 来调用父类的方法
    newClass.prototype.parent = parent;

    return newClass;
};

/*
	在子类拥有和父类同名方法时，使用 this.parent(args) 方法来调用父类的该方法
 */
var parent = function(){

    // this.$caller 在 wrap 函数中被赋值，如果没有 this.$caller ，也就是没有经过 wrap 函数
    // 这个检测抛错，其实也是为了防止下面的 this.$caller.$name 抛出错误
    if (!this.$caller) throw new Error('The method "parent" cannot be called.');

    // console.log(this.$caller) // wrap 里面的 wrapper 函数
    // 当前函数被调用的名字 function person(age) { this.age = age }，则 age 被调用的就是 person 函数，就是得到 person 这个名字
    // console.log(this.$caller.$name); // 会打印出子类的名称
    var name = this.$caller.$name,
        // $owner 当前类对象, 得到当前类对象的父类对象
        parent = this.$caller.$owner.parent,
        // 得到父类相同名字的方法
        previous = (parent) ? parent.prototype[name] : null;
    // console.log(name)
    // 子类在函数中使用 this.parent(args) ，但是父类没有这个函数的同名函数
    if (!previous) throw new Error('The method "' + name + '" has no parent.');
    // 父类函数使用apply绑定在子类的上下文中，并执行
    // 什么时候会执行当前函数呢，在子类的函数中，如果父类有同名函数，使用 this.parent(args)
    // 因为在 var Class 的函数中，就已经指定了 当前函数为 Class.prototype.parent
    return previous.apply(this, arguments);
};

// 解除属性里对其他对象的引用
// 这个解除的例子，可以看 http://hmking.blog.51cto.com/3135992/675856
var reset = function(object){
    for (var key in object){
        var value = object[key];
        switch (typeof(value)){
            case 'object':
                var F = function(){};
                F.prototype = value;
                object[key] = reset(new F);
                break;
            case 'array': object[key] = value.clone(); break;
        }
    }
    return object;
};

var implement = function(key, value, retain){

    // 使用 Extends 继承时, 调用 Mutators 中的 Extends 的方法
    // 这时候设定当前类的父类，并将父类的prototype继承到当前类中
    // 但是，我感觉这种调用方式好吗？
    if (Class.Mutators.hasOwnProperty(key)){
        // console.log(key) // Extends
        // console.log(value) // newClass 函数
        value = Class.Mutators[key].call(this, value);
        if (value == null) {
            return this;
        }
    }

    // console.log('implement params ' + key)
    // console.log('implement params value ' + value)
    // this.prototype[key] = (retain) ? value : wrap(this, key, value);
    // console.log('retain is ' + retain || 'retain is undefined') // undefined

    /*
     Extends 继承的时候，retain 是 false ,所以 wrap 函数
        因为继承需要将父类的函数重新绑定上下文到子类中，所以需要 wrap
     Implements 的时候，该函数为新函数的 prototype
     */
    this.prototype[key] = (retain) ? value : wrap(this, key, value);

    return this;
};

// 这个函数在新建 Class 处理内部的函数
// 在使用 Extends 的时候，需要改变子类的 $owner
var wrap = function(self, key, method){
    // console.log(key)
    if (method.$origin) method = method.$origin;
    var wrapper = function(){
        // 如果方法是是被保护的，或者这个方法没有 $caller ，就不能被调用
        if (method.$protected && this.$caller == null) throw new Error('The method "' + key + '" cannot be called.');

        // 使用 Extends 继承后，在子类的函数中使用 this.parent(args)的时候，才会有 this.$caller
        var current = this.$caller;
        if (current) {
            console.log('this.$caller.$name is ' + current || 'no name');
        }

        this.$caller = wrapper; // method 的 $caller
        // 这里的 this.$caller 是每个 class 中都有的，当用一个方法就有一个
        // 当新建一个 Class 的时候，因为 initialize 函数是实例化类的时候就会执行
        // 所以就不用像 myAnimal.setName 这种调用方法来执行了
        // console.log(this.$caller.$name) // 这样就能够输出当前调用的方法名称了
        // 为什么在新建 Class 中就有 this.$caller 呢，是因为在 var Class  中有 implement(params)

        // 将 method 绑定到当前 wrapper 对象中
        // 其实是为了设定 method 的 $caller 是 wrapper
        var result = method.apply(this, arguments);

        this.$caller = current; // wrapper 的 $caller
        return result;
        // 通过extend ,$owner, $origin, $name 加到 wrapper 函数的属性中去
        // 这里其实修改了原有的 method , 所以使用 $origin 来保存原有的 method
        // 这样在 Extends 的时候，子类其实还是需要调用父类的 method 的，这时候通过 apply 改变执行环境的上下文
        // $name 保存 method 的 key 是用来在继承的父类中查找相同名字的函数
        // $owner 保存子类的 this 是他来找到子类的 parent -> (this.$caller.$owner.parent)
        // 这样就能在 parent 中使用 this.$caller.$name，this.$caller.$owner.parent 中是使用了
    }.extend({$owner: self, $origin: method, $name: key});
    // console.log(wrapper.$owner)
    return wrapper;
};

// 为了将父类的的属性继承到子类，会使用中间变量，将父类传递给中间变量，再通过中间变量传递给子类
var getInstance = function(klass){
    // 获取父类在 initialize 中的属性和函数
    var proto = new klass;
    console.log(proto.setFri)
    return proto;
};

// Extends 是继承，有父类， Implements 称作伪父类吧

// 这里有 overloadSetter ，所以，可能是 Class.implement 方法，来给类额外添加函数的
// 给 Class 增加 implement 方法，就是上面的 var implement，同时 implement 增加 overloadSetter
// 也就是使用 Implements 时，是通过这里的 implement 把伪父类的prototype 赋给当前类的prototype中
// 同时 overloadSetter 又可以把当前类的函数覆盖掉伪父类的函数

// Class 是一个 function, Class.implement 中的 implement 是 Function.prototype.implement 这个方法
//('implement', implement.overloadSetter()) 是给 Class 在增加一个 implement 方法，该方法的主体是 上面定义的 var implement
Class.implement('implement', implement.overloadSetter());

Class.Mutators = {

    // 传给 extends 的参数是 parent
    Extends: function(parent){
        // 指向当前类的父类是 parent 参数
        this.parent = parent;
        // 使用 getInstance 得到父类的属性（initialize内部的）和函数
        console.log(getInstance(parent))
        this.prototype = getInstance(parent);
    },
    // 既然 Implements 只是把伪父类的 prototype 给当前类的 prototype，
    // 不用 getInstance(items)，是因为伪父类的函数需要绑定到当前对象中（这里使用call函数）
    // for (var key in instance) 会遍历伪父类的属性和函数
    Implements: function(items){

        var afterItems = [items];
        afterItems.forEach(function(item){
            var instance = new item;
            for (var key in instance) {
                console.log(key + '-------')
                implement.call(this, key, instance[key], true);
            }
        }, this);
    }
};

/*
 Extends 其实是分两部分，使用 Extends 的时候，通过 getInstance 把父类中initialize中的属性来附加到当前类中,并指定子类的 parent ,
 然后子类的方法中，可以使用 this.parent(args) 方法，找到父类的同名方法，并执行

 Implements 将伪父类的方法，赋给伪子类的prototype中
 */