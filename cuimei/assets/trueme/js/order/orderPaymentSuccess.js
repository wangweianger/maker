/*login.js*/
win.hideLoading();
window.onload=function(){
  setTimeout(function(){
    Popup.loading({"title":"订单支付中，请稍后"}); 
    },0)  
};

var vm = new Vue({
    el: '#orderSuccess',
    mixins: [mixin],
    data: {
        done: false,
        hotSaleList:[], //hut推荐
        totalFee: ''
    },
    ready: function () {
        var that=this;
        //请求后台接口获取下单时间
        var time = 0;
        var doingAjax = false;
        var timer = setInterval(function(){
            time += 1;
            if(time >= 5){
                clearInterval(timer);
                return false;
            }
            if(!doingAjax){
                getResult();
            }
        },2000);
        function getResult(){
            doingAjax = true;
            $.AJAX({
                type:'POST', 
                url:config.basePath+'order/svpay/queryorderpay',
                code : true,
                data:{
                    "payOrderNo": getQueryString('payOrderNo'),
                },
                success:function(o){
                    clearInterval(timer);
                    that.done = true;
                    that.totalFee = o.data.totalFee/100;
                    Popup.closeLoading();
                },
                error: function(o){
                    if(time >= 4){
                        Popup.closeLoading();
                        Popup.alert({type:'msg',title:'请求超时，请刷新重试!'});
                    }
                },
                complete: function(){
                    doingAjax = false;
                }
            });
        }
    },
    methods: {
        //完成后跳转
        toNewUrl:function(){
            window.location.href="myOrder.html";
        }
    }
});
vm.conflicting({callback:function(data){
    vm.hotSaleList=data;
}});






