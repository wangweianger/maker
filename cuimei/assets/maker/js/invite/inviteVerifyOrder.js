
/*创客邀请*/
var vm = new Vue({
    el: '#inviteReferrer',
    data: {
        sugList: [], //当前客户推荐masterId列表
        masterCode:'',
    },
    ready: function(){
        var This = this;

        //获得为当前客户推荐masterId列表
        $.AJAX({
            type:'post',
            url: config.basePath+"maker/svMaker/suggestList",
            success: function(data){
               This.sugList=data.data.sugList;
               This.masterCode=data.data.sugList[0].masterCode;
            },
        });

    },
    methods: {
        //选择推荐人选项
        checkMaster:function($event,masterCode){
            if($event.target.nodeName=='LI'){
                $($event.target).addClass('active').siblings().removeClass('active');
            }else{
               $($event.target).parent().addClass('active').siblings().removeClass('active'); 
            }
            vm.masterCode=masterCode;
        },

        //确定提交推荐人
        lockMaster:function(){
            $.AJAX({
                type:'post',
                url: config.basePath+"maker/svMaker/lockMaster",
                data:{
                    masterCode:vm.masterCode,
                },
                success: function(data){
                   window.location.href="/maker/index/index.html";
                },
            });
        },

    }
});

    