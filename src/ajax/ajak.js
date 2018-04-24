/**
 *  测试 AJAX 专用
 * @param str
 * @returns {string}
 */

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
        this.options.method = this.options.method.toLowerCase();
    },
    getTransport: function() {
        return new XMLHttpRequest();
    },
    request: function(url, options) {
        this.initialize(url, options);
        this.url = url;
        this.method = this.options.method;
        var params = Object.isString(this.options.parameters) ?
            this.options.parameters :
            Object.toQueryString(this.options.parameters);

        console.log(params);
        if (!['get', 'post'].includes(this.method)) {
            params += (params ? '&' : '') + "_method=" + this.method;
            this.method = 'post';
        }

        if (params && this.method === 'get') {
            this.url += (this.url.includes('?') ? '&' : '?') + params;
        }

        console.log(this.url)
        this.parameters = Object.toQueryParams(params);
        this.transport = this.getTransport();
        try {
            console.log('try request')
            // var response = this.response();
            this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);

            // if (this.options.asynchronous)

            // this.transport.onreadystatechange = this.onStateChange();
            // this.setRequestHeader(this.body);

            this.body = this.method == 'post' ? (this.options.postBody || params) : null;
            this.transport.send(this.body);
            /*this.transport.onload = function() {
                console.log(this.responseText);
            }*/
        } catch (e) {
            console.log(e)
        }
    },
    response: function() {
        console.log('response')
        var readyState = this.transport.readyState, transport = this.getTransport();
        console.log(readyState)
        if (readyState == 2 || readyState == 4) {
            this.status = this.getStatus();
            this.statusText = this.getStatusText();
            this.responseText = transport.responseText;
            console.log(this.responseText)
            return {
                status: this.status,
                statusText: this.statusText,
                responseText: this.responseText
            }
        }
    },
    onStateChange: function() {
        var readyState = this.transport.readyState;
        if (readyState > 1 && !((readyState == 4) )) {
            this.respondToReadyState(this.transport.readyState);
        }
    },
    getStatusText: function(){
      try {
          return this.transport.statusText || '';
      }  catch (e) {
          return '';
      }
    },
    success: function() {
        var status = this.getStatus();
        return !status || (status >= 200 && status < 300) || status == 304;
    },
    respondToReadyState: function(readyState) {
        var state = this.events[readyState], response = this.response();
        console.log('readyState')
        if (state == 'Complete') {
            try {
                this.options['on' + (this.success() ? 'Success' : 'Failure')](response)
                /* (this.options['on' + response.status]
                     || this.options['on' + (this.success() ? 'Success' : 'Failure')]
                     || Function.emptyFunction)(response, response.headerJSON);*/
            } catch (e) {
                // this.dispatchEvent(e)
                console.log(e);
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
};

// 这里需要的函数完善下，测试 Ajax ，能不能走通流程