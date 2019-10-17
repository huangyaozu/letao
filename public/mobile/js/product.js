/**
 * Created by Jepson on 2018/8/13.
 */

$(function() {

  // 1. 从地址栏获取传递过来的productId, 根据产品id发送ajax请求, 进行渲染
  var productId = getSearch("productId");

  // 发送 ajax 请求
  $.ajax({
    type: "get",
    url: "/product/queryProductDetail",
    data: {
      id: productId
    },
    dataType: "json",
    success: function( info ) {
      console.log( info );
      var htmlStr = template( "productTpl", info );
      $('.lt_main .mui-scroll').html( htmlStr );


      // 手动初始化轮播图
      // 获得slider插件对象
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
      });


      // 手动初始化 数字框
      mui('.mui-numbox').numbox();
    }
  });

  // 给尺码添加选中功能
  $('.lt_main').on("click", ".lt_size span", function() {
    // 给自己加上 current 类, 移除其他元素的 current类
    $(this).addClass("current").siblings().removeClass("current");
  });


  // 2. 加入购物车功能
  // (1) 给加入购物车按钮添加点击事件
  // (2) 获取用户选中的尺码和数量
  // (3) 发送 ajax 请求, 进行加入购物车操作
  $('#addCart').click(function() {
    // 获取尺码和数量
    var size = $('.lt_size span.current').text();  // 尺码
    var num = $('.mui-numbox-input').val(); // 数量

    if ( !size ) {
      mui.toast("请选择尺码");
      return;
    }

    // 发送 ajax 请求, 进行加入购物车
    $.ajax({
      type: "post",
      url: "/cart/addCart",
      data: {
        productId: productId,
        num: num,
        size: size
      },
      dataType: "json",
      success: function( info ) {
        console.log( info )
        if ( info.success ) {
          // 添加成功, 弹出一个确认框
          mui.confirm( "添加成功", "温馨提示", ["去购物车", "继续浏览"], function( e ) {
            if ( e.index === 0 ) {
              // 去购物车
              location.href = "cart.html";
            }
          })
        }

        // 用户没登陆
        if ( info.error === 400 ) {
          // 跳转到登录页, 将来登录成功, 需要跳回来
          // 可以将当前页面的地址传递给登录页, 将来登录成功后, 获取传递过来的地址, 跳回来
          location.href = "login.html?retUrl=" + location.href;
        }
      }
    })


  })



})
