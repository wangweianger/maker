
__inline('config.js')   //引入 config.js 前端配置项

/*------------------------ start jquery 相关  ------------------------*/
if(window.$){
/*
	$.AJAX 参数说明
	{
		type:'',  类型默认get (可填)
		url:'',   api地址     (必填)
		data:{ name:'wangwei',sex:'男' }, data json参数  (可填)
		code:true,     对错误进行特殊处理   (可填)
		nohideloading:true,  不隐藏遮罩层   (可填)
		ajaxtimeout:5000,    接口超时时间 不传默认微config.ajaxtimeout   (可填)
		success:function(data){},  成功后执行的事情  默认直接弹出错误信息 若需特殊处理 请传参code  (必填)
		error:(data){},  错误后执行的相关事情 配合code：true参数使用  (可填)
		complete  请求完成后回调函数 (请求成功或失败之后均调用)  (可填)
	}
*/
	$.AJAX=function(json){
		var noError=true;
		$.ajax({
			type: json.type||"get",
			url: json.url,
			data: json.data||"",
			datatype:"json",
			success:function(data){
				if(!json.nohideloading){ win.hideLoading();};
				clearTimeout(timeout);
				if(typeof(data)=='string'){
					error(JSON.parse(data),json);
				}else{
					error(data,json);
				}
				
			},
			complete:function(XMLHttpRequest){
				if(!json.nohideloading){ win.hideLoading();};
				clearTimeout(timeout);
				if(json.complete){json.complete(XMLHttpRequest);}
			},
			error:function(XMLHttpRequest){
				win.hideLoading();
				clearTimeout(timeout);
				if(noError){
					_error(XMLHttpRequest,json);
				};	
			}
		});
		var timeout=setTimeout(function(){
			win.hideLoading();
			// 请求超时
			noError=false;
			Popup.alert({type:'msg',title:'请求超时，请刷新重试!'});
		}, json.timeout||config.ajaxtimeout);
	}
	$.FileAJAX=function(json){
		var noError=true;
		$.ajax({
			type: json.type||"post",
			url: json.url,
			xhrFields: {
			    withCredentials: true
			},
			crossDomain: true,
			data: json.data||"",
			datatype:"json", 
            cache: false, 
            contentType: false,  
            processData: false, 
			success:function(data){
				win.hideLoading();
				clearTimeout(time);
				error(data,json);
			},
			error:function(XMLHttpRequest){
				win.hideLoading();
				json.error();
				clearTimeout(time);
				if(noError){
					_error(XMLHttpRequest,json);
				};	
			}
		});
		var time=setTimeout(function(){
			win.hideLoading();
			// 请求超时
			noError=false;
			Popup.alert({type:'msg',title:'请求超时，请刷新重试!'});
		}, json.timeout||config.ajaxtimeout);
	}
	//error 根据code码的函数
	function error(data,json){
		//判断code 并处理
		var dataCode=parseInt(data.code);
		// switch (dataCode){
		// 	case 1000:
		// 		json.success(data);
		// 		break;
		// 	case !json.pageSet && dataCode==1004:
		// 		if(window.location.href.indexOf(config.loginUrl) == -1){ 
		// 			sessionStorage.setItem("weixin-url", window.location.href); //记录没有登陆前的访问页面
		// 			win.location.href=config.loginUrl;
		// 		}else{
		// 			Popup.alert({type:'msg',title:'用户未登陆,请登录!'});
		// 		}
		// 		break;	
		// 	case 6001:	
		// 		window.location.href="/trueme/ware/wareDetail.html?spuId=8";
		// 		break;
		// 	default:
		// 		if(json.code){
		// 			json.error(data);
		// 		}else{
		// 			//直接弹出错误信息
		// 			Popup.alert({type:'msg',title:data.desc});
		// 		}	
		// };

		if(dataCode==1000){
			json.success(data);
		}else if(!json.pageSet && dataCode==1004){
			if(window.location.href.indexOf(config.loginUrl) == -1){ 
				sessionStorage.setItem("weixin-url", window.location.href); //记录没有登陆前的访问页面
				win.location.href=config.loginUrl;
			}else{
				Popup.alert({type:'msg',title:'用户未登陆,请登录!'});
			}
		}else if(dataCode==6001){ //没有注册创客
			window.location.href="/trueme/ware/wareDetail.html?spuId="+config.spuId; 
		}else if(dataCode==6006){ //创客没有选择推荐人，请先选择推荐人
			window.location.href="/maker/invite/inviteVerifyOrder.html"; 
		}else{
			if(json.code){
				json.error(data);
			}else{
				//直接弹出错误信息
				Popup.alert({type:'msg',title:data.desc});
			}
		}
		
	}
	// _error函数
	function _error(XMLHttpRequest,json){
		win.hideLoading();
		if(json.code){
			json.error(JSON.parse(XMLHttpRequest.responseText));
		}else{
			switch(XMLHttpRequest.status){
				case 401:
					if(window.location.href.indexOf(config.loginUrl) == -1){ 
						sessionStorage.setItem("weixin-url", window.location.href); //记录没有登陆前的访问页面
						win.location.href=config.loginUrl;
					}else{
						Popup.alert({type:'msg',title:"用户鉴权失败,请重新登录"});
					}
					break;
				case 400:
					Popup.alert({type:'msg',title:"坏的请求！"});
					break;	
				case 404:
					Popup.alert({type:'msg',title:"接口地址不存在"});
					break;		
				case 500:case 502:
					Popup.alert({type:'msg',title:"服务器内部错误"});
					break;		
				default:
					Popup.alert({type:'msg',title:"未知错误"});	
			}
		}
	}
}	
/*------------------------ end jquery 相关  ------------------------*/

/*------------------------ start 布局写入  ------------------------*/
window==window.top && document.write('<div id="loading"></div>');
/*------------------------ end 布局写入  ------------------------*/

/*-----------------------检测登陆与跳转--------------------------*/ 
/*去除不需要记录的页面 记录当前页面 用于登陆之后跳转回来*/
;(function(){
	var notRecordUrl=[
		"login.html", //登录页面
		"phoneBinding.html", //手机号绑定
		"phoneBindingOver.html", //手机号绑定成功
		"wx-code.html", //获取微信code页面
	];
	if(!isInArray(notRecordUrl,window.location.href)){
		sessionStorage.setItem("weixin-url",window.location.href);
	}
})();

//首页底部导航增加active样式
$(function(){
	var linkArr = ['index.html','javascript:voind(0)','cart_new.html','myHome.html'];
    for(var i=0; i<linkArr.length; i++){
        if(location.href.indexOf(linkArr[i]) > -1){
            $('.fixed-bar li').removeClass('active');
            $('.fixed-bar li').eq(i).addClass('active');
            $('.fixed-bar li').eq(i).on('click', function(){
                return false;
            })
        }
    }
});

/*------------------------ start 原生扩展  ------------------------*/
var win=window.top;
var UA=navigator.userAgent;
var isPC=UA.indexOf('Windows NT')>-1;
var isAndroid=UA.indexOf('Android')>-1;
var isIos=UA.indexOf('Mac OS X')>-1;
var isIphone=UA.indexOf('iPhone;')>-1;
var isIpad=UA.indexOf('iPad;')>-1;
var isIE7=UA.indexOf('MSIE 7.0;')>-1;
var isIE8=UA.indexOf('MSIE 8.0;')>-1;
var isIE9=UA.indexOf('MSIE 9.0;')>-1;
var isIE10=UA.indexOf('MSIE 10.0;')>-1;
var isIE11=UA.indexOf('Trident')>-1;
var isFirefox=UA.indexOf('Firefox')>-1;
var IsWeiXin=UA.indexOf('MicroMessenger')>-1;
var iFadeInterval=260;
var iSlideInterval=200;
var isLoading=false;
var baseURL='';

// 深拷贝
function dClone(o){
	return JSON.parse(JSON.stringify(o));
}
// 创建svg元素
function createTag(tagName, attr){
	attr=attr || {};
	var ele=document.createElementNS('http://www.w3.org/2000/svg', tagName);
	for(var key in attr){
		ele.setAttribute(key, attr[key]);
	}
	return ele;
}
// 角度转弧度
function d2a(deg){
	return deg*Math.PI/180;
}
// 弧度转角度
function a2d(angle){
	return angule/Math.PI*180;
}
// 随机整数
function rand(m,n){
	return Math.round(Math.random()*(n-m)+m);
}
// 获取当前时间毫秒
function time(){
	return new Date().getTime();
}
/*js trim函数*/
String.prototype.trim=function(){
　 return this.replace(/(^\s*)|(\s*$)/g, "");
}
// 随机颜色
function randColor(){
	var arr=[];
	for(var i=0; i<3; i++){
		arr.push(fillLen(rand(0,255).toString(16)));
	}
	return '#'+arr.join('');
}
/*
	'#oaf' => 'rgba(0,170,255,1)'
	'#00aaff' => 'rgba(0,170,255,1)'
*/
function color2rgba(color, opacity){
	opacity=opacity || 1;
	color=color.replace('#', '');
	color.length==3 && (color=color.replace(/\w/g, function(str){
		return str+str;
	}));
	var arr=[];
	color.replace(/\w{2}/g, function(str){
		arr.push(Number('0x'+str));
	});
	return 'rgba('+arr+','+opacity+')';
}
// 'rgba(0,170,255)' => '#00aaff'
function rgb2color(rgb){
	var arr=rgb.match(/\d+/g);
	arr.length=3;
	var str='#';
	arr.forEach(function(item){
		str+=fillLen(parseInt(item).toString(16));
	});
	return str;
}
/*
	字符串转化为数字
	'123' => 123
	'60%' => 0.6
	'123.55abc456' => 123.55
*/
function toNum(str){
	if(typeof str=='number'){
		return str;
	}else if(/^\d+%$/.test(str)){
		return str.replace('%', '')/100;
	}else{
		return parseFloat(str);
	}
}

function showLoading(){
	isLoading=true;
	$('#loading').stop().fadeIn(iFadeInterval);
};
function hideLoading(){
	isLoading=false;
	$('#loading').stop().fadeOut(iFadeInterval);
};

// 数字前面补零
function fillLen(n, len){
	n=''+n;
	len=len || 2;
	while(n.length<len){
		n='0'+n;
	}
	return n;
}
/*new Date().date('y-m-d h:i:s'); => 2015-11-02 17:11:55*/
Date.prototype.date=function(format){
	var 
	year=this.getFullYear(),
	month=fillLen(this.getMonth()+1),
	day=fillLen(this.getDate()),
	hour=fillLen(this.getHours()),
	minute=fillLen(this.getMinutes()),
	second=fillLen(this.getSeconds()),
	json={
		'y': year,
		'm': month,
		'd': day,
		'h': hour,
		'i': minute,
		's': second
	};
	return !format?year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second:format.replace(/y|m|d|h|i|s/g, function(str){
		return json[str];
	});
}

/*根据参数生成常用的正则表达式
*string    type 生成的正则表达式类型
*array     numArr 生成正则的条件数组 例如:[6,16] 也可省略
*/
function regCombination(type,numArr){
	var reg="";
	switch(type){
		case "*":     //"*":"不能为空！"   
			if(numArr){
				reg=new RegExp("^[\\w\\W]{"+numArr[0]+","+numArr[1]+"}$"); 
			}else {
				reg=new RegExp("^[\\w\\W]+$"); 
			}  
			break;
		case "n":    //"number":"请填写数字！
			if(numArr){
				reg=new RegExp("^\\d{"+numArr[0]+","+numArr[1]+"}$");
			}else{
				reg=new RegExp("^\\d+$");
			}
			break;
		case "s":  //"s":"不能输入特殊字符！"   
			if(numArr){
				reg=new RegExp("^[\\u4E00-\\u9FA5\\uf900-\\ufa2d\\w\\.\\s]{"+numArr[0]+","+numArr[1]+"}$");
			}else{
				reg=new RegExp("^[\\u4E00-\\u9FA5\\uf900-\\ufa2d\\w\\.\\s]+$");
			}
			break; 
		case "c":  //"z":"中文验证" 
			reg=new RegExp("^[\\u4E00-\\u9FA5\\uf900-\\ufa2d]{"+numArr[0]+","+numArr[1]+"}$");
			break;	
		case "p":    //"p":"邮政编码！
			reg=new RegExp("^[0-9]{6}$");
			break;	
		case "m":    //"m":"写手机号码！"
			reg=new RegExp("^13[0-9]{9}$|14[0-9]{9}$|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$");
			break;	
		case "e":   //"e":"邮箱地址格式
			reg=new RegExp("^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$");
			break;
		case "id":   //"id":验证身份证
			reg=new RegExp("^\\d{17}[\\dXx]$");
			break;
		case "money": //钱
			reg=new RegExp("^[\\d\\.]+$");	
			break;	
		case "url":   //"url":"网址"
			reg=new RegExp("^(\\w+:\\/\\/)?\\w+(\\.\\w+)+.*$");
			break;	
	}
	return reg;
}
/*获取随机数数组 参数类型json 
案例:   {
			min:1，           最小范围
			max:50,           最大范围
			num:10,           随机数个数
			sort:"<",         排序方式
			isRepeat:true     是否有重复数字
		} 
*array 返回类型为数组 
*/
function getArrNum(option){
    var min = option.min || 0; //随机数最小值  默认为0
    var num = option.num;//随机数个数
    var max = option.max;//随机数最大值
    var sort = option.sort;//是否排序  '>'：从大到小排序   '<'：从小到大排序  不传则不排序
    var arr = []; //[10,20]
    var json = {}; //{'10':1,'20':1}   10
    while( arr.length < num ){
        var iNum =  Math.round( Math.random()*max );
        if(option.isRepeat){
			if( iNum > min ){
	            arr.push( iNum );
	        }
        }else{
			if( !json[iNum] && iNum > min ){
	            arr.push( iNum );
	            json[iNum] = 1;
	        }
        }
    }
    if(sort=='>'){
        arr.sort( function(a,b){ return b - a; } );
        return arr;
    }else if(sort=='<'){
        arr.sort( function(a,b){ return a - b; } );
        return arr;
    }else{
        return arr;
    }
}
/*手机号码等字符中间用 * 号替换
obj 即需要替换的对象
start 开始位置
number 需要替换几位字符
*/
function asterisk(obj,start,number){
	var strxh="";
	for(var i=0;i<number;i++){
		strxh+='*';
	}	
	return obj.replace(obj.substr(start,number),strxh);
}
/*获取复选框值 返回值类型 array*/
function getCheckboxVal(name){
  var group=document.getElementsByName(name); 
  var chkValue =[];
  for(var i=0,len=group.length;i<len;i++){
  	if(group[i].checked){
  		chkValue.push(group[i].value); 
  	}
  }
  return chkValue;
}

/*获取url hash*/
function getQueryString(name,hash) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    if(hash){
    	if(!window.location.hash){
    		return false;
    	};
    	var r = decodeURIComponent(window.location.hash).substr(1).match(reg);
    }else{
    	var r = decodeURIComponent(window.location.search).substr(1).match(reg);
    }
    if (r != null) {
        return r[2];
    }
    return null;
}

/*数组去重*/
function uniqueArr(arr){
	var json={};
	var result=[];
	for(var i=0; i<arr.length; i++){
		if(!json[arr[i]]){
			result.push(arr[i]);
			json[arr[i]]=true;
		}
	}
	return result;
};

/*给元素添加属性*/
function addAttr(obj,json){
	for(var attr in json){
		obj.setAttribute(attr, json[attr]);
	}
}

/*json 转换成get url传参方式*/
function jsonToGetUrl(json){
	var str="";
	for(var i in json){
		str+=i+'='+json[i]+'&';
	}
	return str.slice(0,-1);
}

/*拼json的key值*/
function jsonKeyStr(json){
	var str="";
	for(var i in window.buttonPer){
		str+=i+',';
	}
	return str.slice(0,-1);
}

/*生成随机字符串*/
function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}

/*检查输入的是否是数字*/
function IsNum(e) {
    var k = window.event ? e.keyCode : e.which;
    if (((k >= 48) && (k <= 57)) || k == 8 || k == 0) {
    } else {
        if (window.event) {
            window.event.returnValue = false;
        }
        else {
            e.preventDefault(); //for firefox 
        }
    }
} 

 //秒数换算成时间函数
function formatSeconds(value) {
    var second = parseInt(value);// 秒
    var minute = 0;// 分
    var hour = 0;// 小时
    if(second > 60) {
            minute = parseInt(second/60);
            second = parseInt(second%60);
        if(minute > 60) {
            hour = parseInt(minute/60);
            minute = parseInt(minute%60);
        }
    }
    var result = getZero(minute)+':'+getZero(parseInt(second));
    if(minute > 0) {
        result =getZero(parseInt(minute))+":"+getZero(parseInt(second));
    }
    if(hour > 0) {
        result =getZero(parseInt(hour))+':'+getZero(parseInt(minute))+":"+getZero(parseInt(second));
    }
    return result;
}

/*判断时间前面是否加0*/
function getZero(num){
    if(num<10){
            return '0'+num;
    }else{
            return num;
    }
}

/*浏览器返回上一步*/
function goBack(url){
	if(url){
		window.location.href="http://"+window.location.host+'/'+url;
	}else{
		 window.history.go(-1);
	}
}

/*检测是不是数组里面的值*/
function checkIn(arr,value){
	var result=false
	for(var i=0,len=arr.length;i<len;i++){
		if(arr[i]==value){
			result=true;
		}
	}
	return result;
}

/*检测某值在数组中是否存在*/
function isInArray(arr,value){
	var result=false;
	for(var i=0,len=arr.length;i<len;i++){
		if(value.indexOf(arr[i]) != -1){
			result=true;
		};
	};
	return result;
}

/*删除json 中含有的某个key值*/
function deleteJson(json,key){
	var newJson={};
	for(var i in json){
		if(i!=key){
			newJson[i]=json[i];
		}
	}
	return newJson;
}

/*根据某个val值删除当前数组的值*/
function deleteArrItem(arr,val){
	var newArr=[];
	for(var i=0,len=arr.length;i<len;i++){
		for(var j in arr[i]){
			if(arr[i][j]==val){
				arr.splice(i,1);
				newArr=arr;
				return newArr;
			}
		}
	}
}

/*检测json 中是否有某个key值*/
function haveKeyInJson(json,key){
	var haveKey=false;
	for(var i in json){
		if(i==key){
			haveKey=true;
		}
	}
	return haveKey;
}

/*根据某个key值得到数据集合*/
function getKeyArrFromData(datas,key){
	var newArr=[];
	for(var i=0,len=datas.length;i<len;i++){
		newArr.push(datas[i][key]);
	}
	return newArr;
}

/*保留两个数组相同的值*/
function commonArrData(arr1,arr2){
	var newArr=[];
	for(var i=0,len=arr1.length;i<len;i++){
		for(var j=0,lenj=arr2.length;j<lenj;j++){
			if(arr2[j]==arr1[i]){
				newArr.push(arr2[j]);
			}
		}
	}
	return newArr;
}

/*extent json函数*/
function extend(json1,json2){
	var newJson=json1;
	for(i in json1){
		for( j in json2){
			newJson[j]=json2[j];
		}
	}
	return newJson;
}

//获得登录后可跳转的url
function getNextUrl(){
	//清除 weixin-next-url 
	if(sessionStorage.getItem('weixin-next-url')==window.location.href){
		sessionStorage.setItem('weixin-next-url','');
	};
	if(sessionStorage.getItem('weixin-next-url')){
		return sessionStorage.getItem('weixin-next-url');
	}else{
		return sessionStorage.getItem("weixin-url")||'http://'+window.location.host+'/index.html';
	}
}
/*------------------------ end 原生扩展  ------------------------*/


/*------------------------------------微信jsdk相关------------------------------*/
/*微信分享
debug       是否是调试默还是
request     是否需要请求 appId timestamp nonceStr signature
	appId       appId    (必填：request为false时不填)
	timestamp   时间戳  (必填：request为false时不填) 
	nonceStr    随机字符串  (必填：request为false时不填)
	signature   微信签名   (必填：request为false时不填) 
title       微信分享标题  (必填) 
desc        微信分享描述  (可填) 
link        微信分享URL  (必填)
mainUrl     微信分享图标 (可填)
success     分享成功后执行   (可填)
cancel       取消分享后执行   (可填) 
*/
function WeiXinShare(data) {
	var setting={
		debug:false,
		request:false,
		contentUrl:'',
		appId :config.appId,
		timestamp :time(),
		nonceStr: randomString(),
		signature :'',
		title :'',
		desc :'',       
		link :'',       
		mainUrl:'',   
		success:function(){},     
		cancel:function(){},    
	};
	var datas=extend(setting,data);
	console.log(data)
	if(!data.request){
		//请求微信分享需要的相关参数
		$.AJAX({
	        type:'post', 
	        url:config.basePath+'maker/svMaker/makerShare',
	        data:{
	            contentUrl:encodeURIComponent(window.location.href.split('#')[0]),                
	        },
	        success:function(data){
	          //调用微信相关操作
	          datas=extend(datas,data.data);
	          WeiXinInFo(datas); 
	        },
	    });
	}else{
		//掉起微信分享
    	WeiXinInFo(datas);	
	};	
};

//掉起微信分享
function WeiXinInFo(data){
	console.log(data)
    wx.config({
        debug: data.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature,// 必填，签名，见附录1
        jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone',
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    //wx.ready
    wx.ready(function () {
       // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
       //分享给朋友
       wx.onMenuShareAppMessage({
           title: data.title, // 分享标题
           desc: data.desc, // 分享描述
           link: data.link,
           imgUrl: data.mainUrl, // 分享图标
           success: function () { 
              // 用户确认分享后执行的回调函数
              data.success()
           },
           cancel: function () { 
               // 用户取消分享后执行的回调函数
               data.cancel()
           }
      });

      //分享给朋友圈
      wx.onMenuShareTimeline({
          title: data.title, // 分享标题
          link: data.link, // 分享链接
          imgUrl: data.mainUrl, // 分享图标
          success: function () {
              // 用户确认分享后执行的回调函数
              data.success()
          },
          cancel: function () {
              // 用户取消分享后执行的回调函数
              data.cancel()
          }
      });

      //分享到QQ
      wx.onMenuShareQQ({
        title:  data.title, // 分享标题
        desc: data.desc, // 分享描述
        link: data.link, // 分享链接
        imgUrl: data.mainUrl, // 分享图标
        success: function () { 
           // 用户确认分享后执行的回调函数
           data.success()
        },
        cancel: function () { 
           // 用户取消分享后执行的回调函数
           data.cancel()
        }
      });

      //分享到腾讯微博
      wx.onMenuShareWeibo({
        title: data.title, // 分享标题
        desc: data.desc, // 分享描述
        link: data.link, // 分享链接
        imgUrl: data.mainUrl, // 分享图标
        success: function () { 
           // 用户确认分享后执行的回调函数
           data.success()
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
            data.cancel()
        }
      });
      
      //分享到QQ空间
      wx.onMenuShareQZone({
        title: data.title, // 分享标题
        desc: data.desc, // 分享描述
        link: data.link, // 分享链接
        imgUrl: data.mainUrl, // 分享图标
        success: function () { 
           // 用户确认分享后执行的回调函数
           data.success()
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
            data.cancel()
        }
      });
    });
};



