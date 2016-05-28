
/*index.js*/


var vm = new Vue({
    el: '#container',
    data: {
        doingAjax: false,
        hotSkuStartNum: 0,
        nowTabId: 0,
        nav: [],
        items: {}
    },
    ready: function(){
        // alert(window.window.devicePixelRatio);
        var that = this;
        $('#container').show();
        $.AJAX({
            url: config.basePath+"content/svItemHome/getItemHomeList",
            success: function(o){
                that.nav = o.data.itemHomeTypeList;
                that.nowTabId = that.nav[0].topTypeId;
                that.items = {};
                var arr = {};
                for(var i=0; i< that.nav.length; i++){
                    arr[that.nav[i].topTypeId] = {
                        firstLoaded: false,
                        lastPage: false,
                        hotSkuStartNum: 0,
                        banner: {},
                        topicList: {},
                        hotList: {}
                    };
                }
                that.items = arr;
                that.items[that.nav[0].topTypeId].banner = o.data.itemHomeBannerList;
                that.items[that.nav[0].topTypeId].topicList = o.data.showCaseList;
                that.items[that.nav[0].topTypeId].hotList = o.data.itemHomeHotSkuList;
                that.items[that.nav[0].topTypeId].hotSkuStartNum = o.data.hotSkuStartNum;
                // debugger;
                // that.banner = o.data.itemHomeBannerList;
                // that.topicList = o.data.itemHomeSpuList;
                // that.hotList = o.data.itemHomeHotSkuList;
                // that.hotSkuStartNum = o.data.hotSkuStartNum;
                setTimeout(function(){
                    $('.swiper-nav').eq(0).find('.nav-menu').addClass('active');
                    initNav();
                },0)
                function initNav(){
                    var navLen = $('.nav-item').length;
                    var navWidth = 0;
                    for(var i=0; i<navLen; i++){
                        navWidth += $('.nav-item')[i].offsetWidth;
                        $('.nav-item').eq(i).parents('.swiper-slide').width(Math.ceil($('.nav-item')[i].offsetWidth));
                    }
                    if(navWidth > $('.nav-wrap').width()){
                        $('.nav-wrap .swiper-wrapper').css({
                            'width': '100%',
                            'display': '-webkit-box',
                            'display': '-moz-box',
                            'display': '-ms-box',
                            'display': '-webkit-flex',
                            'display': 'flex'
                        });
                        var haha = new Swiper('.nav-wrap',{
                            slidesPerView: 'auto'
                        });
                    }
                }
                setTimeout(function(){
                    var $container = $('.content-list li[data-id="'+ that.nowTabId +'"]').find('.banner-slide');
                    return new Swiper($container, {
                        autoplay: 2000,
                        autoplayDisableOnInteraction : false,
                        visibilityFullFit: true,
                        loop: true,
                        pagination: '.swiper-pagination'
                    });
                },0);
                setTimeout(function(){
                    return new Swiper('.activity_pro_wrap', {
                        slidesPerView: 'auto',
                        freeMode: true,
                    });
                },0);
                that.items[that.nav[0].topTypeId].firstLoaded = true;
            }
        }); 
        
        $(window).on('scroll', function(){
            if($(window).scrollTop() + $(window).height() + 200 > document.body.offsetHeight){
                if(!that.items[that.nowTabId].firstLoaded || that.doingAjax || that.items[that.nowTabId].lastPage){
                    return false;
                }
                that.doingAjax = true;
                win.showLoading();
                var url = config.basePath+'content/svItemHome/getHotSkuInfo?topTypeId=' + that.nowTabId + '&hotSkuStartNum=' + that.items[that.nowTabId].hotSkuStartNum;
                //请求数据
                $.AJAX({
                    url: url,
                    success: function(o){
                        that.items[that.nowTabId].hotList = that.items[that.nowTabId].hotList.concat(o.data.itemHomeHotSkuList);
                        that.items[that.nowTabId].hotSkuStartNum = o.data.hotSkuStartNum;
                        if(o.data.itemHomeHotSkuList.length == 0){
                            that.items[that.nowTabId].lastPage = true;
                        }
                    },
                    complete: function(){
                        that.doingAjax = false;
                    }
                });
            }
        });
    },
    methods: {
        praise: function(e){
            var that = this;
            var praiseSpu = $(e.target).data('spu-id');
            var $targetIcon = $(e.target).find('.praise_icon');
            $.AJAX({
                type:'post',
                url:config.basePath+'user/svUserProductCollect?spuId=' + praiseSpu,
                success:function(data){
                    if(data.data.flag ==2){
                        $targetIcon.addClass('praised');
                        $(e.target).find('.praise_num').text(parseInt($(e.target).find('.praise_num').text()) + 1);
                        Popup.miss({title:'收藏成功！'});
                    }else{
                        $targetIcon.removeClass('praised');
                        $(e.target).find('.praise_num').text(parseInt($(e.target).find('.praise_num').text()) - 1);
                        Popup.miss({title:'取消收藏成功！'});
                    }
                },
            });
        },
        getNavData: function(e){
            var that = this;
            that.doingAjax = true;
            var navId = '';
            var $nav = null;
            if(e.target.tagName.toUpperCase() == 'SPAN'){
                $('.nav-menu').removeClass('active');
                $(e.target).addClass('active');
                $nav = e.target.parentNode;
            }else{
                $('.nav-menu').removeClass('active');
                $(e.target).find('.nav-menu').addClass('active');
                $nav = e.target;
            }
            navId = $nav.getAttribute('data-id');
            that.nowTabId = parseInt(navId);
            if(that.items[that.nowTabId].firstLoaded){
                Vue.nextTick(function () {
                    that.doingAjax = false;
                    return false;
                })
            }else{
                win.showLoading();
                $.AJAX({
                    url: config.basePath+"content/svItemHome/getItemHomeList?topTypeId=" + that.nowTabId,
                    success: function(o){
                        that.items[that.nowTabId].banner = o.data.itemHomeBannerList;
                        that.items[that.nowTabId].topicList = o.data.itemHomeSpuList;
                        that.items[that.nowTabId].hotList = o.data.itemHomeHotSkuList;
                        that.items[that.nowTabId].hotSkuStartNum = o.data.hotSkuStartNum;
                        setTimeout(function(){
                            var $container = $('.content-list li[data-id="'+ that.nowTabId +'"]').find('.banner-slide');
                            return new Swiper($container, {
                                autoplay: 2000,
                                autoplayDisableOnInteraction : false,
                                visibilityFullFit: true,
                                loop: true,
                                pagination: '.swiper-pagination'
                            });
                        },0);
                        setTimeout(function(){
                            return new Swiper('.activity_pro_wrap', {
                                slidesPerView: 'auto',
                                freeMode: true,
                            });
                        },0);
                    },
                    complete: function(){
                        that.doingAjax = false;
                        that.items[that.nowTabId].firstLoaded = true;
                    }
                });
            }//end
        }
    }
});

//导航轮播

//banner轮播


//活动商品轮播
    