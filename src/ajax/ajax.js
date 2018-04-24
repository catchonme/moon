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

        if (!['get', 'post'].includes(this.method)) {
            params += (params ? '&' : '') + "_method=" + this.method;
            this.method = 'post';
        }

        if (params && this.method === 'get') {
            this.url += (this.url.includes('?') ? '&' : '?') + params;
        }

        this.parameters = Object.toQueryParams(params);

        try {
            // var response = this.response();
            this.getTransport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);

            // if (this.options.asynchronous)

            this.transport.onreadystatechange = this.onStateChange.bind(this);
            this.setRequestHeader(this.body);

            this.body = this.method == 'post' ? (this.options.postBody || params) : null;
            this.transport.send(this.body);

        } catch (e) {

        }
    },
    onStateChange: function() {
        var readyState = this.transport.readyState;
        if (readyState > 1 && !((readyState == 4) )) {
            this.respondToReadyState(this.transport.readyState);
        }
    },
    setRequestHeaders: function() {
      var headers = {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
      };

      if (this.method == 'post') {
          headers['Content-type'] = this.options.contentType +
              (this.options.encoding ? '; charset=' + this.options.encoding : '');
      }

      // user-defined headers
        if (typeof this.options.requestHeader == 'object') {
          var extras = this.options.requestHeaders;

          if (Object.isFunction(extras.push)) {
              for (var i = 0, length = extras.length; i < length; i += 2) {
                  headers[extras[i]] = extras[i+1];
              }
          } else {
              Object.keys(extras).forEach(function (item) {
                  headers[item.key] = item.value;
              })
          }
        }

        // skip null or undefined vlaues
        for (var name in headers) {
          if (headers[name] != null) {
              this.transport.setRequestHeader(name, headers[name])
          }
        }
    },
    response: function() {

    },
    success: function() {
        var status = this.getStatus();
        return !status || (status >= 200 && status < 300) || status == 304;
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
    respondToReadyState: function(readyState) {
        var state = this.events[readyState]/*, response = this.response()*/;

        if (state == 'Complete') {
            try {
                console.log('123');
                // this._complete = true;
               /* (this.options['on' + response.status]
                    || this.options['on' + (this.success() ? 'Success' : 'Failure')]
                    || Function.emptyFunction)(response, response.headerJSON);*/
            } catch (e) {
                // this.dispatchEvent(e)
                console.log(e);
            }
        }
    },

    isSameOrigin: function() {
        var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
        return !m || (m[0] == '#{protocol}//#{domain}#{port}'.interpolate({
            protocol: location.protocol,
            domain: document.domain,
            port: location.port ? ':' + location.port : ''
        }))
    },

    getHeader: function(name) {
        try {
            return this.transport.getResponseHeader(name) || null;
        } catch (e) {
            return null;
        }
    },

    evalResponse: function() {
        try {
            return eval((this.transport.responseText || '').unfilterJSON());
        } catch (e) {
            this.dispatchException(e);
        }
    },

    dispatchException: function(exception) {
        (this.options.onException || Function.emptyFunction)(this, exception);
        this.responders.dispatch('onException', this, exception);
    }
};

// 这里需要的函数完善下，测试 Ajax ，能不能走通流程