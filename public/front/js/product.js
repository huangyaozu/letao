// Created by huangyaozu on 2019/10/28
$(function () {
    // 功能1：获取地址栏的id,发送ajax请求, 进行商品渲染
    var productId = getSearch("productId");

    $.ajax({
        type:"get",
        url:"/product/queryProductDetail",
        data:{
            id:productId
        },
        dataType:"json",
        success:function (info) {
            console.log(info);
            var htmlStr = template("productTpl", info);
            $('.lt-main .mui-scroll').html(htmlStr);

            // 手动进行轮播初始化(动态生成的轮播图需要手动初始化)
            // 获得slider插件对象
           var gallery =  mui('.mui-slider');
            gallery.slider({
                interval:5000 //自动轮播周期，若为0则不自动播放，默认为0；
            });

            // 数字输入框初始化
            mui(".mui-numbox").numbox()
        }
        
    })

})