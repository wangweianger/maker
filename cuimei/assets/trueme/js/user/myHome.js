/*login.js*/
win.hideLoading();


var vm = new Vue({
    el: '#container',
    data: {
        isLogin: false,
        userInfo: {}
    },
    ready: function () {
        $('.jumpCheck').on('click', function(){
            location.href = $(this).data('link');
        });
        var that = this;
        $.AJAX({
            type: "POST",
            url: config.basePath + 'user/svIsLogined',
            code: true,
            pageSet: true,
            success: function(o){
                that.isLogin = true;
                $('.user-box').removeClass('logout');
                $.AJAX({
                    type: "POST",
                    url: config.basePath + 'user/svuser/getusercenterinfo',
                    success: function(o){
                        that.userInfo = o.data.userCenterInfo;
                        $('#container').show();
                    }
                });
            },
            error: function(){
                that.isLogin = false;
                $('#container').show();
            }
        })
        // if($.cookie('cuserid') && ($.cookie('cuserid') != "")){
        //     that.isLogin = true;
        //     $('.user-box').removeClass('logout');
        //     $.AJAX({
        //         type: "POST",
        //         url: config.basePath + 'user/svuser/getusercenterinfo',
        //         success: function(o){
        //             // debugger;
        //             that.userInfo = o.data.userCenterInfo;
        //             $('#container').show();
        //     	}
        //     });
        // }else{
        //     that.isLogin = false;
        //     $('#container').show();
        // }
    },
    methods: {
        login: function(){
            trueme.w.getWeiXinCode();
        },
        
        showService: function(){
            Popup.customHtml({
                header:'弹出页面',
                style:'width:80%',
                maskHide:true,
                closeBut:false,
                html:'<div class="pop-header g-border-b">萃美客服电话</div>\
                  <div class="pop-tel">0755-2691-0969</div>\
                  <div class="pop-btn"><input type=button style=height:30px value=确定 onclick=closeThisPopup(this) /></div>'
            });
        }
        // jumpPage: function(e){
        //     var jumpLink = $(e.target).data('link');
        //     if($.cookie('cuserid') && ($.cookie('cuserid') != "")){
        //         location.href = jumpLink;
        //     }else{
        //         trueme.w.getWeiXinCode();
        //     }
        // }
    }
});

