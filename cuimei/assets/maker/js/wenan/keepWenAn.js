
/*hotwenan.html*/
win.hideLoading()
/*spacial.js*/
var vm = new Vue({
    el: '#container',
    data: {
       startNum:0, //分页起始页
       datas:{}, //页面数据 
    },
    ready: function () {
        var This=this;
       //请求后台接口获取下单时间
       $.AJAX({
            type:'post', 
            url:config.basePath+'content/svMakerContent/getUserCollectList',
            data:{
                startNum:This.startNum,
            },
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
            bottomTop:700,
            callback:function(){ 
              $.AJAX({
                  type:'post',
                  url:config.basePath+'content/svMakerContent/getUserCollectList',
                  data:{
                      startNum:This.startNum,
                  },
                  success:function(data){
                    //向数组里push数据
                    if(data.data.contentList.length>0){
                      This.datas.contentList = This.datas.contentList.concat(data.data.contentList);
                    }
                    This.startNum=data.data.startNum;
                    //判断是否还需要滚动获取数据
                    if(data.data.contentList.length>0){
                        config.scrollbegin=true; //可以再次滚动
                    }
                  }
             });  
            }
        });
       }, //end 

       //收藏文案
       collectionwenan:function(contentId){
          maker.collectionWenAn({
            contentId:contentId,
          });
       },
       
       //点赞
       likeElectricity:function(contentId){
          maker.likeElectricityWenAn({
            contentId:contentId,
          });
       },

       //获得分享的shareId
       getShareIdWenAnDetails:function(contentId){
          //根据contentId获得分享shareId
          maker.shareContentSetback({
            contentId:contentId,
            success:function(data){
                //调用页面查看次数接口
                if(isShare){
                  window.location.href='wenAnDetails.html?contentId='+contentId+'&shareId='+data.data.shareId+'&isShare=1'; 
                }else{
                  window.location.href='wenAnDetails.html?contentId='+contentId+'&shareId='+data.data.shareId; 
                };
            },
          });
       },
       
    }
});









