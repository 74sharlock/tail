(function() {
    var toString;

    window.Q = document.querySelector.bind(document);

    window.D = document.getElementById.bind(document);

    window.QA = document.querySelectorAll.bind(document);

    window.CE = document.createElement.bind(document);

    window.R = function(fn) {
        return document.addEventListener('DOMContentLoaded', fn, false);
    };

    toString = Object.prototype.toString;

    window.getType = function(everything) {
        return toString.call(everything).replace('[object ', '').replace(']', '').toLowerCase();
    };

    window.isFunction = function(fn) {
        return getType(fn) === 'function';
    };

    window.isArray = function(arr) {
        return getType(arr) === 'array';
    };

    window.isString = function(string) {
        return getType(string) === 'string';
    };

    window.isBoolean = function(bl) {
        return getType(bl) === 'boolean';
    };

    Element.prototype.on = function(event, callback, capte) {
        return this.addEventListener(event, callback, isBoolean(capte) ? capte : false);
    };

    Element.prototype.off = function(event, callback, capte) {
        return this.removeEventListener(event, callback, isBoolean(capte) ? capte : false);
    };

    Element.prototype.gas = Element.prototype.getAttribute;

    Element.prototype.Q = function(selector) {
        return this.querySelector(selector);
    };

    Element.prototype.QA = function(selector) {
        return this.querySelectorAll(selector);
    };

    if (!Element.prototype.contains) {
        Element.prototype.contains = function(node) {
            return this.compareDocumentPosition(node) > 19;
        };
    }

    Element.prototype.removeClass = function(className) {
        this.classList.remove(className);
        return this;
    };

    Element.prototype.stopAnimation = function() {
        if (this.isAnimating === true) {
            this.isAnimating = false;
            this.removeClass('animated');
            this.removeClass(this.animationName);
            this.animationName = null;
        }
        return this;
    };

    Element.prototype.addClass = function(className) {
        this.classList.add(className);
        return this;
    };

    Element.prototype.toggleClass = function(className) {
        this.classList.toggle(className);
        return this;
    };

    Element.prototype.hasClass = function(selector) {
        return this.classList.contains(selector);
    };

    Element.prototype.index = function() {
        var i, item, j, len, nodeName, ref;
        nodeName = this.nodeName.toLowerCase();
        ref = this.parentNode.querySelectorAll(nodeName);
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
            item = ref[i];
            if (this === item) {
                return i;
            }
        }
    };

    Element.prototype.data = function(name) {
        return this.gas('data-' + name);
    };

    Element.prototype.animation = function(opts) {
        var count, delay, direction, duration, h;
        h = function() {
            this.removeClass('animated');
            this.removeClass(opts.name);
            this.isAnimating = false;
            this.animationName = null;
            if (isFunction(opts.fn)) {
                opts.fn.call(this);
            }
            this.off('webkitAnimationEnd', h, false);
            return this.off('animationend', h, false);
        };
        this.on('webkitAnimationEnd', h, false);
        this.on('animationend', h, false);
        this.animationName = opts.name;
        if (getType(this.animationName) === 'string') {
            duration = opts.duration || 1;
            delay = getType(opts.delay) !== 'number' ? Number(opts.delay) : opts.delay;
            count = opts.count || 1;
            direction = opts.direction;
            if (!(getType(this.isAnimating) === 'boolean')) {
                this.isAnimating = false;
            }
            if (!this.isAnimating) {
                this.isAnimating = true;
                if (duration) {
                    duration = duration + 's';
                    this.style.animationDuration = duration;
                    this.style.webkitAnimationDuration = duration;
                }
                if (delay) {
                    delay = delay + 's';
                    this.style.animationDelay = delay;
                    this.style.webkitAnimationDelay = delay;
                }
                if (direction) {
                    this.style.animationDirection = direction;
                    this.style.webkitAnimationDirection = direction;
                }
                if (count) {
                    this.style.animationIterationCount = count;
                    this.style.webkitAnimationIterationCount = count;
                }
                this.addClass('animated');
                return this.addClass(opts.name);
            }
        }
    };

    NodeList.prototype.on = function(event, calback, capte) {
        var elem, j, len;
        for (j = 0, len = this.length; j < len; j++) {
            elem = this[j];
            elem.on(event, calback, isBoolean(capte) ? capte : false);
        }
        return this;
    };

    window.queryData = function(url, data, method, callback, needJson) {
        var dataString, key, val, xhr;
        dataString = '';
        if (toString.call(method) === '[object Function]') {
            needJson = isBoolean(callback) ? callback : true;
            callback = method;
            method = 'post';
        }
        xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (toString.call(callback) === '[object Function]') {
                return callback((isString(xhr.responseText) && needJson === true ? JSON.parse(xhr.responseText) : xhr.responseText));
            }
        };
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
        for (key in data) {
            val = data[key];
            dataString += String(key) + '=' + String(val) + '&';
        }
        return xhr.send(dataString);
    };

    window.isPhone = (function() {
        var agents, flag, l, userAgent;
        userAgent = navigator.userAgent;
        agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        flag = false;
        l = agents.length;
        while (l--) {
            if (userAgent.indexOf(agents[l]) > 0) {
                flag = true;
                break;
            }
        }
        return flag;
    })();

    window.click = isPhone ? 'touchend' : 'click';

}).call(this);