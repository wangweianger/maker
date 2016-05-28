/*login.js*/
win.hideLoading();

 $(function () {
    $("#password").on("focus",function () {
        $(this).next("span").addClass("focus");
    });
    $("#password").blur(function () {
        $(this).next("span").removeClass("focus");
    });

    //body高度为全屏
    $('#back-img').css({
        height:$(window).height()+'px',
    });

});
var vm = new Vue({
    el: '#container',
    data: {},
    ready: function () {
 
    },
    methods: {
        //获得微信code
        getWxCode: function(id){
            //跳转获得微信code
            trueme.w.getWeiXinCode();
        }
    }
});






