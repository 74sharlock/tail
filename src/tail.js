//umd模块格式 适用于amd, cmd以及nodejs模块
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory());
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.tail = factory();
    }
}(this, function () {
    
    //变量类型检测
    var getType = function () {
        var l = arguments.length, arr = [];
        [].forEach.call(arguments, (arg)=>{
            arr.push(({}).toString.call(arg).replace(/\[object\s(.*)\]/,'$1').toLowerCase());
        });
        return l === 1 ? arr[0] : arr;
    };
    
    //空函数
    var noop = function () {};

    

    var tail = function (computedState, proxy) {
        var resolveCallback = noop, rejectCallback = noop, state;

        proxy = proxy || {};

        var methods = {
            then : function (fn) {
                resolveCallback = fn;
                return this;
            },
            fail : function (fn) {
                rejectCallback = fn;
                return this;
            }
        };

        switch (getType(computedState)){
            case 'function':
                state = computedState();
                break;
            case 'boolean':
                state = computedState;
                break;
            default:
                state = true;
        }

        if(state) {
            setTimeout(()=> {
                resolveCallback && resolveCallback.apply(proxy.resolve || null, arguments);
            }, 0);
        } else {
            setTimeout(()=> {
                rejectCallback && rejectCallback.apply(proxy.reject || null, arguments);
            }, 0);
        }

        return methods
    };
    
    

    //单个ajax方法
    tail.ajax = function (url) {

        var xhr = new XMLHttpRequest(), resolveCallback = noop, rejectCallback = noop;


        xhr.onload = function() {
            resolveCallback && resolveCallback.apply(xhr, [getType(xhr.responseText) === 'string' ? JSON.parse(xhr.responseText) : xhr.responseText]);
        };

        xhr.onerror = function () {
            rejectCallback && rejectCallback.apply(xhr);
        };

        var sendData = function (method, data, async) {
            var then = function (fn) {
                resolveCallback = fn;
            };

            var fail = function (fn) {
                rejectCallback = fn;
            };

            var dataString = '';

            xhr.open(method, url, getType(async) === 'boolean' ? async : true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
            if(data){
                for (var key in data) {
                    if(data.hasOwnProperty(key)){
                        var val = data[key];
                        dataString += String(key) + '=' + String(val) + '&';
                    }
                }
                xhr.send(dataString);
            } else {
                xhr.send();
            }

            return {
                then: then,
                fail: fail
            }
        };

        return {
            //todo: 这里还有put和delete请求类型, 自行添加
            query: function (async) {
                return sendData('get', async);
            },
            save: function (data, async) {
                return sendData('post', data, async);
            }
        };

    };

    //多个ajax合并请求
    tail.when = function (urls) {
        var count = 0, dataList = [], resolveCallback = noop, rejectCallback = noop;

        var done = function (fn) {
            resolveCallback = fn;
        };

        var fail = function (fn) {
            rejectCallback = fn;
        };

        urls.forEach((url, index) => {
            var method = 'get', xhr = new XMLHttpRequest(), sendData = null, path, async;
            if(getType(url) === 'object'){
                method = url.method;
                sendData = url.data;
                path = url.path;
                async = url.async;
            }

            xhr.onload = function() {
                count ++;
                dataList.push(getType(xhr.responseText) === 'string' ? JSON.parse(xhr.responseText) : xhr.responseText);
                count === urls.length && resolveCallback && resolveCallback.apply(xhr, [dataList]);
            };

            xhr.onerror = function () {
                rejectCallback && rejectCallback.apply(xhr, [url]);
            };

            xhr.open(method, path || url, getType(async) === 'boolean' ? async : true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");

            if(sendData){
                var dataString = '';
                for (var key in sendData) {
                    if(sendData.hasOwnProperty(key)){
                        var val = sendData[key];
                        dataString += String(key) + '=' + String(val) + '&';
                    }
                }
                xhr.send(dataString);
            } else {
                xhr.send();
            }
        });
        return {
            done: done,
            fail: fail
        };
    };
    
    return tail;

}));