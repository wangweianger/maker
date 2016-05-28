
/*spacial.js*/
var vm = new Vue({
    el: '#container',
    data: {
       datas:'', //返回专题列表数据
       startNum:'', 
    },
    ready: function () {
        var This=this;
       //请求后台接口获取下单时间
       $.AJAX({
            type:'post', 
            url:config.basePath+'content/svItemHome/getShowCaseDetail?showCaseId=' + getQueryString('showCaseId'),
            // data:{
            //     showCaseId:,  //是 int 专题spuId
            //     topTypeId:getQueryString('topTypeId'),  //是 int 专题所在首页分类ID
            // },
            success:function(data){
              This.datas=data.data;
              This.startNum=data.data.startNum;
              //滚动拉去更多数据
              This.scollGetMoreData();
            }
       });
    },
    methods: {
       //滚动获得更多数据
       scollGetMoreData:function(){
        var This=this;
        trueme.w.scrollGetData({  
            lastObj:$('#bottomscolltop'),
            callback:function(){ 
              $.AJAX({
                  type:'post',
                  url:config.basePath+'content/svItemHome/getItemHomeSpuSkuList',
                  data:{
                      showCaseId:getQueryString('showCaseId'),  //是 int 专题spuId
                      startNum:This.startNum,  //是 int 专题所在首页分类ID
                  },
                  success:function(data){
                    //向数组里push数据
                    if(data.data.spuList.length>0){
                      This.datas.spuList = This.datas.spuList.concat(data.data.spuList);
                    }
                    This.startNum=data.data.startNum;
                    //判断是否还需要滚动获取数据
                    if(data.data.spuList.length>0){
                        config.scrollbegin=true; //可以再次滚动
                    }
                  }
             });  
            }
        });
       }, //end 
       
    }
});








