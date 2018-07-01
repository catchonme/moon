/**
 * Document ready by DOMContentLoaded
 */
if (document.readyState !== 'loading') {
    eventHandler();
} else {
    document.addEventListener('DOMContentLoaded', eventHandler);
}

/**
 * 检测传入的参数是不是 JavaScript 函数对象
 */
function isFunction(item) {
    if (typeof item === 'function') {
        return true;
    }
    // toString 后面不是要加 call 吗
    var type = Object.prototype.toString(item);
    return type === '[object Function]' || type === '[object GeneratorFunction]';
}

/**
 * 检测是不是扁平对象（使用 "{}" 或 "new Object" 创建)
 */
function isPlainObject(obj) {
    if (typeof (obj) !== 'object' || obj.nodeType || obj !== null && obj !== undefined && obj === obj.window) {
        return false;
    }

    if (obj.constructor &&
        !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
        return false;
    }

    return true;
}