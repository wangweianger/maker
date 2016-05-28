
/*创客team.js*/
//REF是拉人；SYS时系统推荐
Vue.filter('refType', function (value) {
    var text="";
    switch(value){
        case 'REF':
            text='拉人';
            break;
        case 'SYS':
            text='系统推荐';
            break;             
    }
    return text;
});

var vm = new Vue({
    el: '#container',
    data: {
        page:1, //分页起始页
        datas:[], //团队成员列表
    },
    ready: function(){
        var This = this;
        //获取团队成员列表
        $.AJAX({
            url: config.basePath+"maker/svMaker/getTeamMember",
            data:{
                level:0,   //int 当值为1时，查询其下一级的用户列表；当值为0时，查询其所有下级的用户列表
                page:1,   //int 页数，从1开始，默认1
                pageSize:15,   //int 每页个数，默认10个
            },
            success: function(data){
               This.datas=data.data;
               This.page=data.page;
               setTimeout(function(){
                $('.team-users').removeClass('hide');
               },config.containerShowTime);
            },
        });

    },
    methods: {
        //滚动获得更多数据
       scollGetMoreData:function(){
        var This=this;
        trueme.w.scrollGetData({
            lastObj:$('#bottomscolltop'),
            bottomTop:700,
            callback:function(){ 
              $.AJAX({
                  url:config.basePath+"maker/svMaker/getTeamMember",
                  data:{
                    startNum:This.startNum,
                    level:0,   //int 当值为1时，查询其下一级的用户列表；当值为0时，查询其所有下级的用户列表
                    page:This.page,   //int 页数，从1开始，默认1
                    pageSize:15,   //int 每页个数，默认10个
                  },
                  success:function(data){
                    //向数组里push数据
                    if(data.data.length>0){
                      This.datas = This.datas.concat(data.data);
                    }
                    This.page=data.page;
                    //判断是否还需要滚动获取数据
                    if(data.data.length>0){
                        config.scrollbegin=true; //可以再次滚动
                    }
                  }
             });  
            }
        });
       }, //end 
    }
});

    