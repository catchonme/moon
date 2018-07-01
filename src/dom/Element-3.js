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