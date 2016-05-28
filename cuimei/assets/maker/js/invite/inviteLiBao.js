
/*创客邀请*/
var vm = new Vue({
    el: '#container',
    data: {
        masterCode: '', //masterCode码
    },
    ready: function(){
        var This = this;

        //获得masterCode码
        $.AJAX({
            type:'post',
            url: config.basePath+"maker/svMaker/suggestList",
            success: function(data){
                console.log(data)
            },
        });


    },
    methods: {
        
    }
});

    