/**
 *  测试 AJAX 专用
 * @param str
 * @returns {string}
 */
/* 依赖函数 */
String.prototype.interpret = function(str) {
    return str == null ? '' : String(str);
}

String.prototype.strip = function(str) {
    return str.replace(/^\s+|\s+$/, '');
}

Object.prototype.extend = function (destination, source) {
    for (var property in source)
        destination[property] = source[property]
    return destination;
}

Object.prototype.isString = function (object) {
    return Object.prototype.toString.call(object) == '[object String]';
}

Object.prototype.toQueryParams = function (params) {
    var match = params.trim().match(/([^?#]*)(#.*)?$/);
    if (!match) return { };

    var result = {};
    match[1].split('&').forEach(function (item) {
        var param = item.split('=');
        var key = decodeURIComponent(param[0]),
            value = decodeURIComponent(param[1]);

        if (value != undefined) {
            value = value.replace('+', ' ');
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

Object.prototype.toQueryString = function (object) {
    console.log(object)
    var result = [];
    Object.keys(object).forEach(function (value, key) {
        key = encodeURIComponent(value), values = object[value];

        if (values && typeof values == 'object') {
            if (Array.isArray(values)) {
                var queryValues = [];
                for (var i = 0, length = value.length; i < length; i++) {
                    value = values[i];
                    queryValues.push(Object.toQueryPair(key, value));
                }
                result.push(queryValues)
            }
        } else {
            result.push(Object.toQueryPair(key, values));
        }
    })
    return result.join('&');
}

Object.prototype.toQueryPair = function(key, value) {
    if (Object.isUndefined(value)) return key;

    value = String(value);

    value = encodeURIComponent(value);
    // Likewise, according to the spec, spaces should be '+' rather than '%20'.
    value = value.replace(/%20/, '+');
    return key + '=' + value;
}

Object.prototype.isUndefined = function(object) {
    return typeof object == 'undefined';
}

/* Ajax 主体 */
var Ajax = {
    initialize: function (url, options) {
        this.options = {
            method: 'post',
            asynchronous: true,
            contentType: 'application/x-www-form-urlencoded',
            encoding: 'UTF-8',
            parameters: '',
            evalJSON: true,
            evalJS: true
        };
        Object.extend(this.options, options || {});
        this.events = ['Uninitialized', 'loading', 'Loaded', 'Interactive', 'Complete'];
        this.url = url;
        this.method = this.options.method = this.options.method.toLowerCase();
        this.transport = this.getTransport();
    },
    getTransport: function() {
        return new XMLHttpRequest();
    },
    request: function(url, options) {
        this.initialize(url, options);
        var params = Object.isString(this.options.parameters) ?
            this.options.parameters :
            Object.toQueryString(this.options.parameters);

        if (!['get', 'post'].includes(this.method)) {
            params += (params ? '&' : '') + "_method=" + this.method;
            this.method = 'post';
        }

        if (params && this.method === 'get') {
            this.url += (this.url.includes('?') ? '&' : '?') + params;
        }

        this.parameters = Object.toQueryParams(params);

        try {
            this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);
            this.body = this.method == 'post' ? (this.options.postBody || params) : null;
            this.transport.send(this.body);
            this.transport.onreadystatechange = this.onStateChange.bind(this);
        } catch (e) {
            console.log(e)
        }
    },
    onStateChange: function() {
        var readyState = this.transport.readyState;
        if (readyState > 1) {
            this.respondToReadyState(this.transport.readyState);
        }
    },
    respondToReadyState: function(readyState) {
        var state = this.events[readyState], response = this.response();
        if (state == 'Complete') {
            try {
                this.options['on' + (this.success() ? 'Success' : 'Failure')](response)
            } catch (e) {
                console.log(e);
            }
        }
    },
    response: function() {
        var readyState = this.transport.readyState;
        if (readyState == 4) {
            this.status = this.getStatus();
            this.statusText = this.getStatusText();
            this.responseText = this.getResponseText();
            return {
                status: this.status,
                statusText: this.statusText,
                responseText: this.responseText
            }
        }
    },
    getStatus: function() {
        try {
            // IE sometimes returns 1223 for a 204 response
            if (this.transport.status === 1223) return 204;
            return this.transport.status || 0;
        } catch (e) {
            return 0;
        }
    },
    getStatusText: function(){
      try {
          return this.transport.statusText || '';
      }  catch (e) {
          return '';
      }
    },
    getResponseText() {
        return this.transport.responseText;
    },
    success: function() {
        var status = this.getStatus();
        return !status || (status >= 200 && status < 300) || status == 304;
    },
};

// 这里需要的函数完善下，测试 Ajax ，能不能走通流程