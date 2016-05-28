
/*体现*/
$(document).ready(function(){
    $("#focus").focus();
    var vm = new Vue({
        el: '#container',
        data: {
            withCashNeedDadas: {}, //获得申请提现页面所需数据
            money:'', //体现金额
        },
        ready: function(){
            var This = this;
            //获得申请提现页面所需数据
            $.AJAX({
                url: config.basePath+"maker/svWithdraw/getMakerHomeInfo",
                success: function(data){
                    This.withCashNeedDadas=data.data;
                    setTimeout(function(){
                        $('#container').removeClass('hide'); 
                    }, config.containerShowTime);
                },
            });
        },
        methods: {
            //立即体现
            submitWithDrawCash:function(){
                if(!regCombination('money').test(vm.money)&&!regCombination('*').test(vm.money)){
                    Popup.alert({type:'msg',title:'请输入正确的提现金额!'});return false;
                };
                if(vm.money<100){
                    Popup.alert({type:'msg',title:'提现最低金额为100元!'});return false;
                };
                if(vm.money>vm.withCashNeedDadas.usableMoney){
                    Popup.alert({type:'msg',title:'可提现余额不足!'});return false;
                };
                $.AJAX({
                    type:'post',
                    url: config.basePath+"maker/svWithdraw/beWithdraw",
                    data:{
                        withdrawMoney:vm.money,
                    },
                    success: function(data){
                       //清空体现金额
                       vm.money="";
                       Popup.alert({type:'msg',title:'申请提现成功!'});
                    },
                });
            },
        }
    });

});



    