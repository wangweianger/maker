/*** Created by HZH on 2016/5/19.*/
var stateOrder=0;  
//用户userId
var truemeUserId=$.cookie('cuserid'); 

//物流过滤器
Vue.filter('wuLiuFilter', function (value,index) {
  var className="";
  if(value==3&&index==0){
    className="yes";
  }else if(value==2&&index==0){
    className="no";
  }
  return className;
});

//vue begin
var vm = new Vue({
    el: '#container',
    data: {
       orderWuLiu:{},  //物流信息
    },
    ready: function () {
      var This=this;
      //获取物流信息
      $.AJAX({
        type:'post',
        url:config.basePath+'order/svqueryorder/ordertrans',
        data:{
          "tid": "fcdf6c8a85cd34faa24eb58c1c06ffb5",
          "time": time(),
          "orderId": getQueryString('orderId')||'22132',
        },
        success:function(data){
          This.orderWuLiu=data.data;
        },
      });
      
    },
    methods: {}
});
