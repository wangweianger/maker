/*体现*/
Vue.filter('stateFilter', function (value) {
    var text="";
    switch (value){
        case 'FINISH':
            text='订单完成';
            break;
        case 'UNPAY':
            text='未支付';
            break;
        case 'PAID':
            text='已支付';
            break;
        case 'CANCEL':
            text='取消订单';
            break;            
    }
    return text;
});

Vue.filter('makerOrderStateFilter', function (value) {
    var text="";
    switch (value){
        case 'FINISH':
            text='已入账';
            break;
        case 'UNPAY':
            text='';
            break;
        case 'PAID':
            text='未入账';
            break;
        case 'CANCEL':
            text='取消订单';
            break;            
    }
    return text;
});

Vue.filter('orderTypeFilter', function (value) {
    var text="";
    switch (value){
        case 1:
            text='普通';
            break;
        case 2:
            text='分销';
            break;
        case 3:
            text='拉新';
            break;         
    }
    return text;
});

$(document).ready(function(){
    var vm = new Vue({
        el: '#container',
        data: {
            totayPage:0,   //今日StartNum
            historyPage:0,  //历史StartNum
            scrollbegintop:true, //top是否滚动
            scrollbeginbottom:true, //bottom是否滚动
            todayDatas:[], //todayDatas
            historyDatas:[], //historyDatas
        },
        ready: function(){
            var This = this;

            //查看今日团队收入
            $.AJAX({
                type:'post',
                url: config.basePath+"maker/svMaker/getMakerTeamIncomeList",
                data:{
                    page:1,    //是   int 第几页，从1开始
                    pageSize:5,    //否   int 每页个数，默认5个
                    isToday:1,    //int 默认1，当为1时表示今天，当为0时表示更早的
                },
                success: function(data){
                   This.todayDatas=data.data.orders;
                   This.totayPage=data.data.page;
                   setTimeout(function(){
                        $('#record1').removeClass('hide'); 
                    }, config.containerShowTime);
                },
            });

            //滚动获得今日更多团队收入
            $("#record1").scroll(function() {
                if($('#recordtop').offset().top-$('#scrollTop').offset().top<50){
                    if(This.scrollbegintop){
                        win.showLoading();
                        //执行ajax 获得申请提现页面所需数据
                        $.AJAX({
                            url: config.basePath+"maker/svMaker/getMakerTeamIncomeList",
                            data:{
                                page:This.totayPage,    //是   int 第几页，从1开始
                                pageSize:5,            //否   int 每页个数，默认5个
                                isToday:1,            //int 默认1，当为1时表示今天，当为0时表示更早的
                            },
                            success: function(data){
                                //向数组里push数据
                                if(data.data.orders.length>0){
                                  This.todayDatas.orders = This.todayDatas.orders.concat(data.data.orders);
                                  config.scrollbegin=true; //可以再次滚动
                                }
                                This.totayPage=data.data.page;
                            },
                        });
                        This.scrollbegintop=false;
                    }
                };
            });

    
            //查看历史团队收入
            $.AJAX({
                type:'post',
                url: config.basePath+"maker/svMaker/getMakerTeamIncomeList",
                data:{
                    page:1,    //是   int 第几页，从1开始
                    pageSize:5,    //否   int 每页个数，默认5个
                    isToday:0,    //int 默认1，当为1时表示今天，当为0时表示更早的
                },
                success: function(data){
                   This.historyDatas=data.data.orders;
                   This.historyPage=data.data.page;
                   setTimeout(function(){
                        $('#record2').removeClass('hide'); 
                    }, config.containerShowTime);
                },
            });
            //滚动获得更多历史团队收入
            $("#record2").scroll(function() {
                if($('#recordbottom').offset().top-$('#scrollbottom').offset().top<50){
                    if(This.scrollbeginbottom){
                        win.showLoading();
                        //执行ajax 获得申请提现页面所需数据
                        $.AJAX({
                            type:'post',
                            url: config.basePath+"maker/svMaker/getMakerTeamIncomeList",
                            data:{
                                page:This.historyDatas,    //是   int 第几页，从1开始
                                pageSize:5,            //否   int 每页个数，默认5个
                                isToday:0,            //int 默认1，当为1时表示今天，当为0时表示更早的
                            },
                            success: function(data){
                               //向数组里push数据
                                if(data.data.orders.length>0){
                                  This.historyPage.orders = This.historyPage.orders.concat(data.data.orders);
                                  config.scrollbegin=true; //可以再次滚动
                                }
                                This.historyDatas=data.data.page;
                            },
                        });
                        This.scrollbeginbottom=false;
                    }
                };
            });


        },
        methods: {
            
        }
    });

});



