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
    
    // 功能2:让尺码可以选中（通过事件委托注册）
    $('.lt-main').on("click", '.lt-size span', function () {
        $(this).addClass("current").siblings().removeClass("current");
    });

    // 功能3: 加入购物车功能
    // (1) 添加点击事件
    // (2) 收集尺码, 数量, 产品id, 发送 ajax请求
    $("#addCart").click(function () {
        // 获取尺码
        var size = $(".lt-size span.current").text();
        //获取数量
        var num = $('.mui-numbox-input').val();
        if(!size){
            mui.toast("请选择尺码");
            return;
        }

        // 发送ajax请求
        $.ajax({
            type:"post",
            url:"/cart/addCart",
            data: {
                productId: productId,
                num: num,
                size: size
            },
            dataType:"json",
            success:function (info) {
                console.log(info);
                // 加入购物车操作需要登陆

                // (1) 未登录的情况
                if(info.error === 400){
                    // 跳转到登录页面
                    location.href =  "login.html?retUrl=" + location.href;
                }
                // (2) 登录成功，提示用户
                if(info.success){
                    mui.confirm("添加成功", "温馨提示",["去购物车","继续浏览"] ,function (e) {
                        if(e.index === 0){
                            // 去购物车
                            location.href = "cart.html";
                        }
                    });
                }
            }
        })

    })
// 清空浏览器退出登录状态: 清空了cookie中的数据, 就相当于清空了浏览器端的 sessionId
})