/*wareDetail.js*/
$(function () {
    //获取商品的spuId
   var shopSpuId=getQueryString('spuId')||1;

    //折叠
    $(".color-hd").click(function () {
        $(this).toggleClass("active");
        if ($(this).hasClass("active")) {
            $(this).next(".color-bd").slideDown();
        } else {
            $(this).next(".color-bd").slideUp();
        }
    });
   
    //弹入弹出
    $(".too-btn").click(function () {
        $(".shopCart-box").addClass("on");
    });
    $("#close_box,.masked").click(function () {
        $(".shopCart-box").removeClass("on");
    });

    //banner
    var vm = new Vue({
        el: '#container',
        mixins: [mixin],
        data: {
            banner: [],   //banner图
            hotSaleList:[], //hut推荐
            spuDetail:[],  //商品spu详情图
            spuDetailList:'', //获取SPU详情信息
            spuTotalList:[], //
            specifin:[], //商品规格
            skuNum:0,  //购买的商品数量
            skuTitle:'',  //购买商品的标题
            skuId:'',  //商品的skuId
            type:1,   //1为手机加入购物车 ，2为立即购买
            shopingNum:1, //购买商品数量
            getSkuStockInf:0,  //可购买的库存量
            goodsPrice:0,  //商品价格 
            hasCollected: false  //是否已收藏
        },
        ready: function(){
            $('#container').removeClass('hide');
            if(sessionStorage.getItem('confirmOrderSpu')){
                sessionStorage.removeItem('confirmOrderSpu');
            }
            $(window).on('scroll', function(){
                var scrollTop = document.body.scrollTop;
                var targetColor = 0.5 - scrollTop/(88*rem/100);
                var targetOpacity = (scrollTop/(88*rem/100) - 0.5)/0.5;
                if(scrollTop <= 44*rem/100){
                    $('.header-icon').css('backgroundImage','url("../../assets/trueme/images/ware/ware_detail_spirite.png")');
                    $('.header').css({
                        background: 'linear-gradient(rgba(0,0,0,'+ targetColor +'), rgba(0,0,0,0))'
                    });
                    $('.header').css({
                        background: '-webkit-linear-gradient(rgba(0,0,0,'+ targetColor +'), rgba(0,0,0,0))'
                    });
                    $('.header').css({
                        background: '-moz-linear-gradient(rgba(0,0,0,'+ targetColor +'), rgba(0,0,0,0))'
                    });
                    $('.header').css({
                        background: '-o-linear-gradient(rgba(0,0,0,'+ targetColor +'), rgba(0,0,0,0))'
                    });
                }else if(scrollTop <= 88*rem/100){
                    $('.header-icon').css('backgroundImage','url("../../assets/trueme/images/ware/ware_detail_spirite_black.png")');
                    $('.header').css({
                        background: 'linear-gradient(rgba(255,255,255,'+ targetOpacity +'), rgba(255,255,255,'+ targetOpacity +'))'
                    });
                    $('.header').css({
                        background: '-webkit-linear-gradient(rgba(255,255,255,'+ targetOpacity +'), rgba(255,255,255,' +targetOpacity+ '))'
                    });
                    $('.header').css({
                        background: '-moz-linear-gradient(rgba(0,0,0,'+ targetOpacity +'), rgba(0,0,0,0))'
                    });
                    $('.header').css({
                        background: '-o-linear-gradient(rgba(0,0,0,'+ targetOpacity +'), rgba(0,0,0,0))'
                    });
                }
            });
            var This=this;
            //加载banner图片
            $.AJAX({
                type:'get',
                url:config.basePath+'product/svSpuImg/getSpuMain',
                data:{
                    spuId:shopSpuId,
                },
                success:function(data){
                    //渲染banner
                    vm.banner=data.data.spuMainImgList;
                    This.$nextTick(function(){
                        setTimeout(function(){
                            var bannerSwiper = new Swiper('.banner', {
                                autoplay: 2000,
                                autoplayDisableOnInteraction : false,
                                visibilityFullFit: true,
                                loop: true,
                                pagination: '.swiper-pagination'
                            });
                        },0);
                    });
                },
            });

            //获取用户是否收藏该商品
            $.AJAX({
                type: "POST",
                code: true,
                pageSet: true,
                url: config.basePath + 'user/sviscollectforgoods?spuId=' + shopSpuId,
                error: function(o){
                    if(o.code == 1004){
                        return false;
                    }
                    if(o.code == 5300){
                        This.hasCollected = true;
                    }
                }
            });

            //加载商品详情图
            $.AJAX({
                type:'get',
                url:config.basePath+'product/svSpuImg/getSpuDetail',
                data:{
                    spuId:shopSpuId,
                },
                success:function(data){
                    $('.detail').removeClass('hide');
                    $('.too-bar').removeClass('hide');
                    This.spuDetail=data.data.spuDetailImgList;
                }
            });

            //获取SPU详情信息
            $.AJAX({
                type:'get',
                url:config.basePath+'product/svProduct/getSpuDetailInfo',
                data:{
                    spuId:shopSpuId,
                },
                success:function(data){
                    $('.good-main').removeClass('hide');
                    vm.getSkuStockInf=data.data.spuDetailInfo.totalStockNum; //可购买的商品库存
                    vm.spuDetailList=data.data.spuDetailInfo; //商品详情数据
                    vm.goodsPrice=data.data.spuDetailInfo.salePrice //商品价格
                },
            });

            //获取商品规格
            $.AJAX({
                type:'get',
                url:config.basePath+'product/svProduct/getSpuStandardList',
                data:{
                    spuId:shopSpuId,
                },
                success:function(data){
                    vm.specifin=data.data.getSpuStandardList;
                }
            });
        },
        methods:{
            //切换tab获得产品库存
            activeLi:function($event,skuId){
                $($event.target).addClass("checked").siblings().removeClass("checked");
                vm.skuId=skuId;
                //获取规格数量
                 $.AJAX({
                    url:config.basePath+'product/svProduct/getSkuStockInfo',
                    data:{ 
                        skuId:skuId,
                    },
                    success:function(data){
                        vm.getSkuStockInf=data.data.getSkuStockInfo.stockNum;
                        //获得产品规格和价格
                        $.AJAX({ 
                            url:config.basePath+'product/svProduct/getSkuPriceInfo',
                            data:{ 
                                skuId:skuId,
                            },
                            success:function(data){
                                vm.goodsPrice=data.data.getSkuStockInfo.salePrice;
                            },
                        });//end
                    },
                });
            },

            //加入购物车
            joinShoppingCart:function(){
                vm.type=1;
            },

            //设置为立即购买
            payOrderNow:function(){
                vm.type=2;
            },

            //减少商品
            reduceShopNum:function(){
                if(vm.shopingNum>1){
                    vm.shopingNum--;
                }else{
                    Popup.miss({title:'亲,商品数量最少为1件额！'});
                }
            },

            //增加商品
            addShopNum:function(){
                vm.shopingNum++;
            },

            //开始购买或者加入购物车
            submitShopNow:function(){
                if(vm.type==1){
                    //加入购物车
                    var data = {
                            skuId:vm.skuId||vm.specifin[0].skuId, 
                            skuNum:vm.shopingNum, 
                            skuTitle:vm.spuDetailList.title,
                        };
                    if(getQueryString('shareId')){
                        data.shareId = parseInt(getQueryString('shareId'));
                    }
                    $.AJAX({
                        type:'post',
                        url:config.basePath+'product/svProduct/addShopCart',
                        data:data,
                        success:function(data){
                            //取消弹出层
                            $(".shopCart-box").removeClass("on");
                            Popup.miss({title:'加入购物车成功！'}); 
                        },
                    });
                }else if(vm.type==2){
                    //立即购买 结算订单
                    var price=vm.goodsPrice*vm.shopingNum;
                    //var price=vm.spuDetailList.salePrice*vm.shopingNum;
                    var json={
                        totalPrice:price,
                        skuList:[{
                            skuId:vm.skuId||vm.specifin[0].skuId,
                            num:vm.shopingNum,
                            shareId: getQueryString('shareId') ? getQueryString('shareId') : '0'
                        }],
                    };
                    $.AJAX({
                        url:config.basePath+'product/svSettlement/settlement?param=' + JSON.stringify(json),
                        success: function(o){
                            sessionStorage.setItem('confirmOrderSpu', getQueryString('spuId'));
                            sessionStorage.setItem('data', JSON.stringify(o.data));
                            var href="http://"+window.location.host+"/trueme/order/confirmOrder.html";
                            location.href = href;
                            sessionStorage.setItem('weixin-next-url', href);
                        }
                    });
                }//end
            },

            //收藏商品
            collection:function(event){
                trueme.w.collection({
                   spuId:shopSpuId,
                   success: function(data){
                        if(data.data.flag ==2){
                            $('.store-icon').addClass('stored');
                            Popup.miss({title:'收藏成功！'});
                        }else{
                            $('.store-icon').removeClass('stored');
                            Popup.miss({title:'取消收藏成功！'});
                        }
                   }
                });
            },

        },
    });
    
    //获取hot推荐    
    vm.conflicting({callback:function(data){
        $('.see-more').removeClass('hide');
       vm.hotSaleList=data;
    }});
     
});



