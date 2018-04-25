/**
 *  测试 AJAX 专用
 * @param str
 * @returns {string}
 */
/* 依赖函数 */

function isString (object) {
    return Object.prototype.toString.bind(object) == '[object String]';
}

function toQueryString (object) {
    var result = [];
    Object.keys(object).forEach(function (value, key) {
        key = encodeURIComponent(value), values = object[value];

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

    value = String(value);

    value = encodeURIComponent(value);
    // Likewise, according to the spec, spaces should be '+' rather than '%20'.
    value = value.replace(/%20/, '+');
    return key + '=' + value;
}

function isUndefined(object) {
    return typeof object == 'undefined';
}

/* Ajax 主体 */

function getTransport() {
    return new XMLHttpRequest();
}

function Ajax(url, options) {

    /* initialize */
    this.options = {
        method: 'post',
        contentType: 'application/x-www-form-urlencoded',
        encoding: 'UTF-8',
        parameters: '',
    };
    Object.assign(this.options, options || {});
    this.events = ['Uninitialized', 'loading', 'Loaded', 'Interactive', 'Complete'];
    this.url = url;
    this.method = this.options.method = this.options.method.toLowerCase();
    this.transport = getTransport();

    /* request */
    var params = isString(this.options.parameters) ?
        this.options.parameters :
        toQueryString(this.options.parameters);

    if (!['get', 'post'].includes(this.method)) {
        params += (params ? '&' : '') + "_method=" + this.method;
        this.method = 'post';
    }

    if (params && this.method === 'get') {
        this.url += (this.url.includes('?') ? '&' : '?') + params;
    }

    try {
        this.transport.open(this.method.toUpperCase(), this.url);

        this.transport.onreadystatechange = onStateChange.bind(this);

        var headers = {
            'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
        };
        if (this.method == 'post') {
            headers['Content-type'] = this.options.contentType +
                (this.options.encoding ? '; charset=' + this.options.encoding : '');
        }
        for (var name in headers) {
            this.transport.setRequestHeader(name, headers[name]);
        }

        this.body = this.method == 'post' ? (params) : null;
        this.transport.send(this.body);
    } catch (e) {
        console.log(e)
    }
}

function onStateChange() {
    var transport = this.transport;
    var readyState = transport.readyState;
    if (readyState > 1) {
        var state = this.events[readyState];
        if (transport.readyState == 4) {
            this.status = (function(){
                try {
                    // IE sometimes returns 1223 for a 204 response
                    if (this.transport.status === 1223) return 204;
                    return this.transport.status || 0;
                } catch (e) {
                    return 0;
                }
            })();
            this.statusText = transport.statusText;
            this.responseText = transport.responseText;
        }
        this.response = {
            status: this.status,
            statusText: this.statusText,
            responseText: this.responseText
        }
        if (state == 'Complete') {
            try {
                this.success = !this.status || (this.status >= 200 && this.status < 300) || this.status == 304;
                this.options['on' + (this.success ? 'Success' : 'Failure')](this.response)
            } catch (e) {
                console.log(e);
            }
        }
    }
}


