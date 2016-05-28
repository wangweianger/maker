
//当前的订单状态tab
var wenanstatestab=getQueryString('wenanstates',true)+''?getQueryString('wenanstates',true):1;

//改变tab样式
$("#wenanTanNav li").eq(wenanstatestab).addClass("active").siblings().removeClass("active");

//vue begin
var vm = new Vue({
    el: '#container',
    data: {
      index:wenanstatestab,   //初始table索引
      datas:{}, //当前的列表数据
      empty: false,
      datasList:{
        data0:{data:{},startNum:0,isNull:false},
        data1:{data:{},startNum:0,isNull:false},
        data2:{data:{},startNum:0,isNull:false},
        data3:{data:{},startNum:0,isNull:false},
      },  //数据列表
    },
    ready: function () {
        var This=this;
        //tab切换
        $("#wenanTanNav li").click(function () {
            $(this).addClass('active').siblings().removeClass('active');

           //缓存数据
           config.scrollbegin=true;
           location.hash='#wenanstates='+$(this).index(); 
           This.index=$(this).index();
           //切换table数据
           if(This.datasList['data'+This.index]['isNull']){
            This.empty = true;
            This.datas = {};
           }else{
            This.empty = false;
            This.datas=This.datasList['data'+This.index]['data'];
           }
           //数据为空时加载数据
           if(jQuery.isEmptyObject(This.datasList['data'+This.index]['data']) && !This.datasList['data'+This.index]['isNull']){
            win.showLoading();
            //加载数据
            This.queryWenAnList(This.index);
           }
           //判断json是否为空 jQuery.isEmptyObject({})
        });

        //获取数据列表
        This.queryWenAnList(This.index); 
    },
    methods: {
      //查询我的订单列表
      queryWenAnList:function(orderStatus,isShouChang){
        var This=this;

        //请求收藏文案
        if(orderStatus==0){
          var apiUrl="content/svMakerContent/getUserCollectList";
        }else if(orderStatus==1){
        //请求热门文案  
          var apiUrl="content/svMakerContent/getHotMakerContentList";
        }else if(orderStatus==2){
        //我分享的文案  
          var apiUrl="content/svMakerContent/getUserShareList";
        }

        //ajax  
        $.AJAX({
          type:'post', 
          url:config.basePath+apiUrl,
          data:{
              startNum:0,
          },
          success:function(data){
            if(data.data.contentList.length == 0){
                This.empty = true;
                This.datasList['data'+orderStatus]['isNull'] = true;
                This.datasList['data'+orderStatus]['data']=data.data;
                This.datasList['data'+orderStatus]['startNum']=data.data.startNum||1;
                if(orderStatus==0&&isShouChang&&This.index==0){
                  This.datas=data.data;
                }
              }else{
                This.empty = false;
                if(orderStatus==0&&isShouChang){
                  This.datas=data.data;
                }else if(!isShouChang){
                   This.datas=data.data;
                };
                This.datasList['data'+orderStatus]['isNull'] = false;
                This.datasList['data'+orderStatus]['data']=data.data;
                This.datasList['data'+orderStatus]['startNum']=data.data.startNum||1;
                //滚动拉去更多数据
                This.scollGetMoreData();
              }
              setTimeout(function(){
                $('#container').removeClass('hide');
              },config.containerShowTime);
          }
       });
      },

     //滚动获得更多数据
     scollGetMoreData:function(){
      var This=this;
      //滚动时执行
      trueme.w.scrollGetData({  
          lastObj:$('#bottomscolltop'),
          bottomTop:700,
          callback:function(){
            //请求收藏文案
            if(This.index==0){
              var apiUrl="content/svMakerContent/getUserCollectList";
            }else if(This.index==1){
            //请求热门文案  
              var apiUrl="content/svMakerContent/getHotMakerContentList";
            }else if(This.index==2){
            //我分享的文案  
              var apiUrl="content/svMakerContent/getUserShareList";
            }

            $.AJAX({
                type:'post',
                url:config.basePath+apiUrl,
                data:{
                  "startNum":This.datasList['data'+This.index]['startNum'],
                },
                success:function(data){
                  //判断是否还需要滚动获取数据 向数组里push数据
                  if(data.data.contentList.length>0){
                    config.scrollbegin=true; //可以再次滚动
                    This.datasList['data'+This.index]['data'].contentList=(This.datasList['data'+This.index]['data'].contentList).concat(data.data.contentList);
                    This.datas=This.datasList['data'+This.index]['data'];
                  }
                  This.datasList['data'+This.index]['startNum']=data.data.startNum;
                },
           });  
          },
      });
     }, //end

     //收藏文案
     collectionwenan:function($index,contentId){
        maker.collectionWenAn({
          contentId:contentId,
          success:function(data){
            vm.datasList['data'+vm.index]['data'].contentList[$index].collect=data.data.collect;
            vm.datas=vm.datasList['data'+vm.index]['data'];
            vm.queryWenAnList(0,true);
            if(vm.index==0){
              vm.queryWenAnList(1,true);
            };
          },
        });
     },

     //点赞
     likeElectricity:function($index,contentId){
        maker.likeElectricityWenAn({
          contentId:contentId,
          success:function(data){
            Popup.miss({title:'点赞成功！'});
            vm.datasList['data'+vm.index]['data'].contentList[$index].likeCount+=1;
            vm.datas=vm.datasList['data'+vm.index]['data'];
          },
        });
     },

     //获得分享的shareId
     getShareIdWenAnDetails:function(contentId,isShare){
        //根据contentId获得分享shareId
        maker.shareContentSetback({
          contentId:contentId,
          success:function(data){
              //调用页面查看次数接口
              if(isShare){
                sessionStorage.setItem("maker-share", true);
                window.location.href='wenAnDetails.html?contentId='+contentId+'&shareId='+data.data.shareId+'&isShare=1'; 
              }else{
                window.location.href='wenAnDetails.html?contentId='+contentId+'&shareId='+data.data.shareId; 
              };
          },
        });
     },


       
    },
});
