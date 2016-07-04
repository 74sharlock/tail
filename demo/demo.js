R(function () {

    var _log = console.log.bind(console);

    window.testObj = {
        state: false
    };

    testObj.__defineSetter__('state', function (val) {
        tail(val, {resolve: document}).then(function () {
            console.log(this);
        }).fail(function () {
            console.log(this);
        });
    }); //去控制台设置testObj.state的值 查看输出结果 
    
    
    
    
    
    

    var url1 = '/tail/demo/data/1.json', url2 = '/tail/demo/data/2.json';
    
    tail.ajax(url1).query().then(function (data) {
        _log('来自单个请求的数据:');
        _log(data);
    });

    tail.when([url1, url2]).done(function (dataList) {
        _log('来自多个请求的数据:');
        _log(dataList);
    });//查看控制台输出的数据

});