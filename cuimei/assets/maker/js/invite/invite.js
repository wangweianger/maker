
//显示分享图标
$('#shareChuangKe').click(function(){
  $('#weixinShare').addClass('show').removeClass('hide');
});
//点击遮罩隐藏
$('#weixinShare').click(function(){
  $(this).addClass('hide').removeClass('show');
});


/*创客邀请*/
var vm = new Vue({
    el: '#container',
    data: {
        masterCode: '', //masterCode码
        datas:{}, //微信相关
        shareUrl:'',
    },
    ready: function(){
        var This = this;

        //获得masterCode码
        $.AJAX({
            type:'get',
            url: config.basePath+"maker/svMaker/getMasterCode",
            success: function(data){
               This.masterCode=data.data.masterCode;
               This.shareUrl='http://'+window.location.host+'/maker/invite/inviteH5.html?masterCode='+data.data.masterCode;
               setTimeout(function(){
                    $('#container').removeClass('hide');
                    //生成二维码
                    $('#output').qrcode({
                        text:   This.shareUrl,
                        render       : "canvas",//设置渲染方式  
                        width        : 200,     //设置宽度  
                        height       : 200,     //设置高度    
                        background   : "#fff",//背景颜色  
                        foreground   : "#000" //前景颜色  
                    });

                    setTimeout(function(){
                         dropDownLoadImg($('canvas')[0], 'share_lili_xc_campus');
                    },100);
               },100)
                
                /*将canvas 转换为base64 的图片*/
                function dropDownLoadImg(canvasElem, filename, imageType) {
                    var imageData, defalutImageType;
                    defalutImageType = 'png';//定义默认图片类型
                    imageData = canvasElem.toDataURL(imageType || defalutImageType);//将canvas元素转化为image data
                    $('#canvas-img').attr('src',imageData);
                };

                //------调用微信分享相关功能-----
                WeiXinShare({
                  debug:false,
                  title :'创客分享邀请',
                  desc :'这是一个创客分享的邀请连接！',       
                  link : This.shareUrl,       
                  mainUrl: '',   
                  success:function(){
                     $('#weixinShare').addClass('hide').removeClass('show');
                  },     
                  cancel:function(){
                    $('#weixinShare').addClass('hide').removeClass('show');
                  },
                });

            },
        });

        
    },
    methods: {
        
    }
});

    