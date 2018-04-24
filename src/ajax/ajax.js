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
            this.setRequestHeaders();
            this.transport.onreadystatechange = this.onStateChange.bind(this);
            this.body = this.method == 'post' ? (this.options.postBody || params) : null;
            this.transport.send(this.body);
        } catch (e) {
            console.log(e)
        }
    },
    setRequestHeaders: function(){
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