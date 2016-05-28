/*wenAndetails.js*/
$(function () {
  $(".share").click(function () {
      $(this).hide();
  });
  //是否需要提示弹出分享层
  if(sessionStorage.getItem('maker-share')=='true'){
    $('#weixinShare').removeClass('hide').addClass('show');
  }
  $('#isShare').click(function(){
    $('#weixinShare').removeClass('hide').addClass('show');
  });
  //点击隐藏弹出层
  $('#weixinShare').click(function(){
    $(this).removeClass('show').addClass('hide');
    sessionStorage.setItem("maker-share", '');
  });
  //vue  
  var vm = new Vue({
      el: '#container',
      data: {
          contentId: getQueryString('contentId') || 1, //文字的contentId
          shareId: getQueryString('shareId') || 1, //分享页的ID
          datas: {},  //页面数据
          isDianZhan:true,  
          isShouCang:true,
      },
      ready: function () {
        var This = this;

        //调用页面查看次数接口
        maker.addReadCountCallback({
            shareId: This.shareId,
        });

       //请求文案详情内容信息
       $.AJAX({
            type:'post', 
            url:config.basePath+'content/svMakerContent/getContentDetail',
            data:{
                contentId:This.contentId,
                contentUrl:encodeURIComponent(window.location.href.split('#')[0]),
            },
            success:function(data){
              This.datas=data.data;
              $('.wenantitle').text(data.data.title.substring(0,10));
              //显示content主题内容
              setTimeout(function(){
                $('#container').removeClass('hide');
                //执行swiper
                var swiper = new Swiper('.swiper-container', {
                  pagination: '.swiper-pagination',
                  slidesPerView: 'auto',
                  paginationClickable: true,
                  spaceBetween: 0,
                  freeMode: true
                });
              },config.containerShowTime);

              //调用微信分享相关功能
              WeiXinShare({
                debug:false,
                request:true,
                appId :data.data.appId,
                timestamp:data.data.timestamp,
                nonceStr: data.data.nonceStr,
                signature :data.data.signature,
                title :data.data.title,
                desc :data.data.title,       
                link :'http://'+window.location.host+'/maker/wenan/wenAnDetails.html?contentId='+This.contentId+'&shareId='+This.shareId,       
                mainUrl:data.data.mainUrl,   
                success:function(){
                    $('#weixinShare').removeClass('show').addClass('hide');
                    sessionStorage.setItem("maker-share", true);
                    This.shareSuccess();
                },     
                cancel:function(){
                  $('#weixinShare').removeClass('show').addClass('hide');
                  sessionStorage.setItem("maker-share", true);
                },
              });
            },
       });
      },
      methods: {
        //加入购物车
        joinShoppingCart: function (skuId, skuTitle) {
            $.AJAX({
                type: 'post',
                url: config.basePath + 'product/svProduct/addShopCart',
                data: {
                    skuId: skuId,
                    skuNum: 1,
                    skuTitle: skuTitle,
                    shareId:vm.shareId,
                },
                success: function (data) {
                    Popup.miss({title: '加入购物车成功！'});
                },
            });
        },

        //点赞
        likeElectricityWenAn: function ($event) {
          if(vm.isDianZhan){
            maker.likeElectricityWenAn({
                contentId: vm.contentId,
                success: function (data) {
                    Popup.miss({title:'点赞成功！'});
                    vm.isDianZhan=false;
                    $($event.target).parent('li').addClass('active');
                },
            });
          };
        },

        //收藏
        collectionWenAn: function ($event) {
           if(vm.isShouCang){
            maker.collectionWenAn({
                contentId: vm.contentId,
                success: function (data) {
                    console.log(data)
                    vm.isShouCang=false;
                     $($event.target).parent('li').addClass('active');
                },
            });
          };  
        },

        //用户分享成功后回调分享成功
        shareSuccess:function(){
           $.AJAX({
                type: 'post',
                url: config.basePath + 'content/svMakerContent/pushShare',
                data: {
                    shareId:vm.shareId,
                },
                success: function (data) {
                    Popup.miss({title: '分享成功！'});
                    $('#weixinShare').removeClass('hide').addClass('show');
                },
            });
        },


      }
  });
  
  

});








