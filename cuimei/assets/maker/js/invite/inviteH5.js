
/*创客邀请*/
var vm = new Vue({
    el: '#container',
    data: {
        masterCode:getQueryString('masterCode'), //masterCode码
    },
    ready: function(){
        var This = this;
        win.hideLoading();
    },
    methods: {
        //购买礼包 t_maker_ref 增加一条记录
        buyAGift:function(){
            var This = this;
            $.AJAX({
                type:'post',
                url: config.basePath+"maker/svMaker/lockRefMaster",
                data:{
                   masterCode:This.masterCode, 
                },
                success: function(data){
                   window.location.href="/trueme/ware/wareDetail.html?spuId="+config.spuId; 
                },
            });

        },

    }
});

    