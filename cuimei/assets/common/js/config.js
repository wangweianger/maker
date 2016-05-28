/*-------------------------------------------后台配置------------------------------------------------*/ 
window.config={
	//登陆页面 
	loginUrl:"/trueme/user/login.html", 

	//登陆成功后需要跳转到的页面                                                       
	homeUrl: "/index.html",    

	//开发服务器 接口						
	basePath:'http://dev.truemeee.com/',
	//basePath:'http://192.168.0.101:8080/',

	//container div显示的时间                                            
	containerShowTime:10,  

	//ajax 超时配置                                              
	ajaxtimeout:8000,  

	//发送短信的时间间隔
	msgTime:60,

    //商户公众号id
    appId:'wx3c8059fedebed664',

    //前端动画的时间
    alimTime:200,

    //滚动加载更多数据底部距离
    bottomTop:600,
    //初始时候可加载更多数据
    scrollbegin:true,

    //微信信任回调页面    
    redirect_uri:'http://'+window.location.host+'/trueme/wx-code/wx-code.html',     

    //登录或者绑定手机等成功后 跳转到上一页面或者首页
    prevUrl:getNextUrl(),     

    //购买创客商品的spuId
    spuId:8,                                        
                                                
};
