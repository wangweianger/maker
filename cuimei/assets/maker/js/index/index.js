$(function () {
    $("#grade").click(function () {
        $(".grade-box").show();
    });
    $(".grade-box .grade-bg").click(function () {
        $(".grade-box").hide();
    })
    //界面百分比
    $('#index-main').css({height:$(window).height()-$('footer.g-border-t').height()-6+'px'});
});

var vm = new Vue({
    el: '#container',
    data: {
        datas: {}, //首页数据
    },
    ready: function(){
        var This = this;
        $.AJAX({
            type:'post',
            url: config.basePath+"maker/svMaker/getMakerHomeInfo",
            success: function(data){
               This.datas=data.data;
               setTimeout(function(){
                    $('#container').removeClass('hide');
               },config.containerShowTime);
            },
        });
    },
    methods: {
        
    }
});

    