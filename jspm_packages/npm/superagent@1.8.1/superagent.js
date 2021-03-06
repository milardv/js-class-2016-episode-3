/* */ 
"format cjs";
(function(Buffer) {
  !function(e) {
    if ("object" == typeof exports && "undefined" != typeof module)
      module.exports = e();
    else if ("function" == typeof define && define.amd)
      define([], e);
    else {
      var f;
      "undefined" != typeof window ? f = window : "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self), f.superagent = e();
    }
  }(function() {
    var define,
        module,
        exports;
    return (function e(t, n, r) {
      function s(o, u) {
        if (!n[o]) {
          if (!t[o]) {
            var a = typeof require == "function" && require;
            if (!u && a)
              return a(o, !0);
            if (i)
              return i(o, !0);
            var f = new Error("Cannot find module '" + o + "'");
            throw f.code = "MODULE_NOT_FOUND", f;
          }
          var l = n[o] = {exports: {}};
          t[o][0].call(l.exports, function(e) {
            var n = t[o][1][e];
            return s(n ? n : e);
          }, l, l.exports, e, t, n, r);
        }
        return n[o].exports;
      }
      var i = typeof require == "function" && require;
      for (var o = 0; o < r.length; o++)
        s(r[o]);
      return s;
    })({
      1: [function(require, module, exports) {
        function isObject(obj) {
          return null != obj && 'object' == typeof obj;
        }
        module.exports = isObject;
      }, {}],
      2: [function(require, module, exports) {
        var isObject = require('./is-object');
        exports.clearTimeout = function _clearTimeout() {
          this._timeout = 0;
          clearTimeout(this._timer);
          return this;
        };
        exports.parse = function parse(fn) {
          this._parser = fn;
          return this;
        };
        exports.timeout = function timeout(ms) {
          this._timeout = ms;
          return this;
        };
        exports.then = function then(fulfill, reject) {
          return this.end(function(err, res) {
            err ? reject(err) : fulfill(res);
          });
        };
        exports.use = function use(fn) {
          fn(this);
          return this;
        };
        exports.get = function(field) {
          return this._header[field.toLowerCase()];
        };
        exports.getHeader = exports.get;
        exports.set = function(field, val) {
          if (isObject(field)) {
            for (var key in field) {
              this.set(key, field[key]);
            }
            return this;
          }
          this._header[field.toLowerCase()] = val;
          this.header[field] = val;
          return this;
        };
        exports.unset = function(field) {
          delete this._header[field.toLowerCase()];
          delete this.header[field];
          return this;
        };
        exports.field = function(name, val) {
          if (!this._formData) {
            var FormData = require('form-data');
            this._formData = new FormData();
          }
          this._formData.append(name, val);
          return this;
        };
      }, {
        "./is-object": 1,
        "form-data": 5
      }],
      3: [function(require, module, exports) {
        function request(RequestConstructor, method, url) {
          if ('function' == typeof url) {
            return new RequestConstructor('GET', method).end(url);
          }
          if (2 == arguments.length) {
            return new RequestConstructor('GET', method);
          }
          return new RequestConstructor(method, url);
        }
        module.exports = request;
      }, {}],
      4: [function(require, module, exports) {
        module.exports = Emitter;
        function Emitter(obj) {
          if (obj)
            return mixin(obj);
        }
        ;
        function mixin(obj) {
          for (var key in Emitter.prototype) {
            obj[key] = Emitter.prototype[key];
          }
          return obj;
        }
        Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
          this._callbacks = this._callbacks || {};
          (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
          return this;
        };
        Emitter.prototype.once = function(event, fn) {
          function on() {
            this.off(event, on);
            fn.apply(this, arguments);
          }
          on.fn = fn;
          this.on(event, on);
          return this;
        };
        Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
          this._callbacks = this._callbacks || {};
          if (0 == arguments.length) {
            this._callbacks = {};
            return this;
          }
          var callbacks = this._callbacks['$' + event];
          if (!callbacks)
            return this;
          if (1 == arguments.length) {
            delete this._callbacks['$' + event];
            return this;
          }
          var cb;
          for (var i = 0; i < callbacks.length; i++) {
            cb = callbacks[i];
            if (cb === fn || cb.fn === fn) {
              callbacks.splice(i, 1);
              break;
            }
          }
          return this;
        };
        Emitter.prototype.emit = function(event) {
          this._callbacks = this._callbacks || {};
          var args = [].slice.call(arguments, 1),
              callbacks = this._callbacks['$' + event];
          if (callbacks) {
            callbacks = callbacks.slice(0);
            for (var i = 0,
                len = callbacks.length; i < len; ++i) {
              callbacks[i].apply(this, args);
            }
          }
          return this;
        };
        Emitter.prototype.listeners = function(event) {
          this._callbacks = this._callbacks || {};
          return this._callbacks['$' + event] || [];
        };
        Emitter.prototype.hasListeners = function(event) {
          return !!this.listeners(event).length;
        };
      }, {}],
      5: [function(require, module, exports) {
        module.exports = FormData;
      }, {}],
      6: [function(require, module, exports) {
        module.exports = function(arr, fn, initial) {
          var idx = 0;
          var len = arr.length;
          var curr = arguments.length == 3 ? initial : arr[idx++];
          while (idx < len) {
            curr = fn.call(null, curr, arr[idx], ++idx, arr);
          }
          return curr;
        };
      }, {}],
      7: [function(require, module, exports) {
        var Emitter = require('component-emitter');
        var reduce = require('reduce-component');
        var requestBase = require('./request-base');
        var isObject = require('./is-object');
        var root;
        if (typeof window !== 'undefined') {
          root = window;
        } else if (typeof self !== 'undefined') {
          root = self;
        } else {
          root = this;
        }
        function noop() {}
        ;
        function isHost(obj) {
          var str = {}.toString.call(obj);
          switch (str) {
            case '[object File]':
            case '[object Blob]':
            case '[object FormData]':
              return true;
            default:
              return false;
          }
        }
        var request = module.exports = require('./request').bind(null, Request);
        request.getXHR = function() {
          if (root.XMLHttpRequest && (!root.location || 'file:' != root.location.protocol || !root.ActiveXObject)) {
            return new XMLHttpRequest;
          } else {
            try {
              return new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) {}
            try {
              return new ActiveXObject('Msxml2.XMLHTTP.6.0');
            } catch (e) {}
            try {
              return new ActiveXObject('Msxml2.XMLHTTP.3.0');
            } catch (e) {}
            try {
              return new ActiveXObject('Msxml2.XMLHTTP');
            } catch (e) {}
          }
          return false;
        };
        var trim = ''.trim ? function(s) {
          return s.trim();
        } : function(s) {
          return s.replace(/(^\s*|\s*$)/g, '');
        };
        function serialize(obj) {
          if (!isObject(obj))
            return obj;
          var pairs = [];
          for (var key in obj) {
            if (null != obj[key]) {
              pushEncodedKeyValuePair(pairs, key, obj[key]);
            }
          }
          return pairs.join('&');
        }
        function pushEncodedKeyValuePair(pairs, key, val) {
          if (Array.isArray(val)) {
            return val.forEach(function(v) {
              pushEncodedKeyValuePair(pairs, key, v);
            });
          }
          pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
        }
        request.serializeObject = serialize;
        function parseString(str) {
          var obj = {};
          var pairs = str.split('&');
          var parts;
          var pair;
          for (var i = 0,
              len = pairs.length; i < len; ++i) {
            pair = pairs[i];
            parts = pair.split('=');
            obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
          }
          return obj;
        }
        request.parseString = parseString;
        request.types = {
          html: 'text/html',
          json: 'application/json',
          xml: 'application/xml',
          urlencoded: 'application/x-www-form-urlencoded',
          'form': 'application/x-www-form-urlencoded',
          'form-data': 'application/x-www-form-urlencoded'
        };
        request.serialize = {
          'application/x-www-form-urlencoded': serialize,
          'application/json': JSON.stringify
        };
        request.parse = {
          'application/x-www-form-urlencoded': parseString,
          'application/json': JSON.parse
        };
        function parseHeader(str) {
          var lines = str.split(/\r?\n/);
          var fields = {};
          var index;
          var line;
          var field;
          var val;
          lines.pop();
          for (var i = 0,
              len = lines.length; i < len; ++i) {
            line = lines[i];
            index = line.indexOf(':');
            field = line.slice(0, index).toLowerCase();
            val = trim(line.slice(index + 1));
            fields[field] = val;
          }
          return fields;
        }
        function isJSON(mime) {
          return /[\/+]json\b/.test(mime);
        }
        function type(str) {
          return str.split(/ *; */).shift();
        }
        ;
        function params(str) {
          return reduce(str.split(/ *; */), function(obj, str) {
            var parts = str.split(/ *= */),
                key = parts.shift(),
                val = parts.shift();
            if (key && val)
              obj[key] = val;
            return obj;
          }, {});
        }
        ;
        function Response(req, options) {
          options = options || {};
          this.req = req;
          this.xhr = this.req.xhr;
          this.text = ((this.req.method != 'HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined') ? this.xhr.responseText : null;
          this.statusText = this.req.xhr.statusText;
          this.setStatusProperties(this.xhr.status);
          this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
          this.header['content-type'] = this.xhr.getResponseHeader('content-type');
          this.setHeaderProperties(this.header);
          this.body = this.req.method != 'HEAD' ? this.parseBody(this.text ? this.text : this.xhr.response) : null;
        }
        Response.prototype.get = function(field) {
          return this.header[field.toLowerCase()];
        };
        Response.prototype.setHeaderProperties = function(header) {
          var ct = this.header['content-type'] || '';
          this.type = type(ct);
          var obj = params(ct);
          for (var key in obj)
            this[key] = obj[key];
        };
        Response.prototype.parseBody = function(str) {
          var parse = request.parse[this.type];
          return parse && str && (str.length || str instanceof Object) ? parse(str) : null;
        };
        Response.prototype.setStatusProperties = function(status) {
          if (status === 1223) {
            status = 204;
          }
          var type = status / 100 | 0;
          this.status = this.statusCode = status;
          this.statusType = type;
          this.info = 1 == type;
          this.ok = 2 == type;
          this.clientError = 4 == type;
          this.serverError = 5 == type;
          this.error = (4 == type || 5 == type) ? this.toError() : false;
          this.accepted = 202 == status;
          this.noContent = 204 == status;
          this.badRequest = 400 == status;
          this.unauthorized = 401 == status;
          this.notAcceptable = 406 == status;
          this.notFound = 404 == status;
          this.forbidden = 403 == status;
        };
        Response.prototype.toError = function() {
          var req = this.req;
          var method = req.method;
          var url = req.url;
          var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
          var err = new Error(msg);
          err.status = this.status;
          err.method = method;
          err.url = url;
          return err;
        };
        request.Response = Response;
        function Request(method, url) {
          var self = this;
          this._query = this._query || [];
          this.method = method;
          this.url = url;
          this.header = {};
          this._header = {};
          this.on('end', function() {
            var err = null;
            var res = null;
            try {
              res = new Response(self);
            } catch (e) {
              err = new Error('Parser is unable to parse the response');
              err.parse = true;
              err.original = e;
              err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
              err.statusCode = self.xhr && self.xhr.status ? self.xhr.status : null;
              return self.callback(err);
            }
            self.emit('response', res);
            if (err) {
              return self.callback(err, res);
            }
            if (res.status >= 200 && res.status < 300) {
              return self.callback(err, res);
            }
            var new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
            new_err.original = err;
            new_err.response = res;
            new_err.status = res.status;
            self.callback(new_err, res);
          });
        }
        Emitter(Request.prototype);
        for (var key in requestBase) {
          Request.prototype[key] = requestBase[key];
        }
        Request.prototype.abort = function() {
          if (this.aborted)
            return;
          this.aborted = true;
          this.xhr.abort();
          this.clearTimeout();
          this.emit('abort');
          return this;
        };
        Request.prototype.type = function(type) {
          this.set('Content-Type', request.types[type] || type);
          return this;
        };
        Request.prototype.responseType = function(val) {
          this._responseType = val;
          return this;
        };
        Request.prototype.accept = function(type) {
          this.set('Accept', request.types[type] || type);
          return this;
        };
        Request.prototype.auth = function(user, pass, options) {
          if (!options) {
            options = {type: 'basic'};
          }
          switch (options.type) {
            case 'basic':
              var str = btoa(user + ':' + pass);
              this.set('Authorization', 'Basic ' + str);
              break;
            case 'auto':
              this.username = user;
              this.password = pass;
              break;
          }
          return this;
        };
        Request.prototype.query = function(val) {
          if ('string' != typeof val)
            val = serialize(val);
          if (val)
            this._query.push(val);
          return this;
        };
        Request.prototype.attach = function(field, file, filename) {
          if (!this._formData)
            this._formData = new root.FormData();
          this._formData.append(field, file, filename || file.name);
          return this;
        };
        Request.prototype.send = function(data) {
          var obj = isObject(data);
          var type = this._header['content-type'];
          if (obj && isObject(this._data)) {
            for (var key in data) {
              this._data[key] = data[key];
            }
          } else if ('string' == typeof data) {
            if (!type)
              this.type('form');
            type = this._header['content-type'];
            if ('application/x-www-form-urlencoded' == type) {
              this._data = this._data ? this._data + '&' + data : data;
            } else {
              this._data = (this._data || '') + data;
            }
          } else {
            this._data = data;
          }
          if (!obj || isHost(data))
            return this;
          if (!type)
            this.type('json');
          return this;
        };
        Request.prototype.callback = function(err, res) {
          var fn = this._callback;
          this.clearTimeout();
          fn(err, res);
        };
        Request.prototype.crossDomainError = function() {
          var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
          err.crossDomain = true;
          err.status = this.status;
          err.method = this.method;
          err.url = this.url;
          this.callback(err);
        };
        Request.prototype.timeoutError = function() {
          var timeout = this._timeout;
          var err = new Error('timeout of ' + timeout + 'ms exceeded');
          err.timeout = timeout;
          this.callback(err);
        };
        Request.prototype.withCredentials = function() {
          this._withCredentials = true;
          return this;
        };
        Request.prototype.end = function(fn) {
          var self = this;
          var xhr = this.xhr = request.getXHR();
          var query = this._query.join('&');
          var timeout = this._timeout;
          var data = this._formData || this._data;
          this._callback = fn || noop;
          xhr.onreadystatechange = function() {
            if (4 != xhr.readyState)
              return;
            var status;
            try {
              status = xhr.status;
            } catch (e) {
              status = 0;
            }
            if (0 == status) {
              if (self.timedout)
                return self.timeoutError();
              if (self.aborted)
                return;
              return self.crossDomainError();
            }
            self.emit('end');
          };
          var handleProgress = function(e) {
            if (e.total > 0) {
              e.percent = e.loaded / e.total * 100;
            }
            e.direction = 'download';
            self.emit('progress', e);
          };
          if (this.hasListeners('progress')) {
            xhr.onprogress = handleProgress;
          }
          try {
            if (xhr.upload && this.hasListeners('progress')) {
              xhr.upload.onprogress = handleProgress;
            }
          } catch (e) {}
          if (timeout && !this._timer) {
            this._timer = setTimeout(function() {
              self.timedout = true;
              self.abort();
            }, timeout);
          }
          if (query) {
            query = request.serializeObject(query);
            this.url += ~this.url.indexOf('?') ? '&' + query : '?' + query;
          }
          if (this.username && this.password) {
            xhr.open(this.method, this.url, true, this.username, this.password);
          } else {
            xhr.open(this.method, this.url, true);
          }
          if (this._withCredentials)
            xhr.withCredentials = true;
          if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
            var contentType = this._header['content-type'];
            var serialize = this._parser || request.serialize[contentType ? contentType.split(';')[0] : ''];
            if (!serialize && isJSON(contentType))
              serialize = request.serialize['application/json'];
            if (serialize)
              data = serialize(data);
          }
          for (var field in this.header) {
            if (null == this.header[field])
              continue;
            xhr.setRequestHeader(field, this.header[field]);
          }
          if (this._responseType) {
            xhr.responseType = this._responseType;
          }
          this.emit('request', this);
          xhr.send(typeof data !== 'undefined' ? data : null);
          return this;
        };
        request.Request = Request;
        request.get = function(url, data, fn) {
          var req = request('GET', url);
          if ('function' == typeof data)
            fn = data, data = null;
          if (data)
            req.query(data);
          if (fn)
            req.end(fn);
          return req;
        };
        request.head = function(url, data, fn) {
          var req = request('HEAD', url);
          if ('function' == typeof data)
            fn = data, data = null;
          if (data)
            req.send(data);
          if (fn)
            req.end(fn);
          return req;
        };
        function del(url, fn) {
          var req = request('DELETE', url);
          if (fn)
            req.end(fn);
          return req;
        }
        ;
        request['del'] = del;
        request['delete'] = del;
        request.patch = function(url, data, fn) {
          var req = request('PATCH', url);
          if ('function' == typeof data)
            fn = data, data = null;
          if (data)
            req.send(data);
          if (fn)
            req.end(fn);
          return req;
        };
        request.post = function(url, data, fn) {
          var req = request('POST', url);
          if ('function' == typeof data)
            fn = data, data = null;
          if (data)
            req.send(data);
          if (fn)
            req.end(fn);
          return req;
        };
        request.put = function(url, data, fn) {
          var req = request('PUT', url);
          if ('function' == typeof data)
            fn = data, data = null;
          if (data)
            req.send(data);
          if (fn)
            req.end(fn);
          return req;
        };
      }, {
        "./is-object": 1,
        "./request": 3,
        "./request-base": 2,
        "emitter": 4,
        "reduce": 6
      }]
    }, {}, [7])(7);
  });
})(require('buffer').Buffer);
