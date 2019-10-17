/**
 * Created by Jepson on 2018/8/13.
 */

$(function() {

  // 1. 一进入页面, 发送请求, 渲染用户信息
  $.ajax({
    type: "get",
    url: "/user/queryUserMessage",
    dataType: "json",
    success: function( info ) {
      console.log( info );
      if ( info.error === 400 ) {
        // 未登录
        location.href = "login.html";
        return;
      }

      // 已登录, 通过模板引擎渲染
      var htmlStr = template("tpl", info);
      $('#userInfo').html( htmlStr );
    }
  })


  // 退出的两种方案
  // 1. 用户端清空浏览器缓存 (就是将cookie中的sessionId清除)
  // 2. 调用后台提供的退出接口, 让后台销毁当前用户 session存储空间, 清空用户信息



  // 2. 点击退出按钮, 实现用户退出功能
  $('#logout').click(function() {
    // 发送 ajax
    $.ajax({
      type: "get",
      url: "/user/logout",
      dataType: "json",
      success: function( info ) {
        console.log( info );
        if ( info.success ) {
          // 退出成功, 跳转到登录页
          location.href = "login.html";
        }
      }
    })
  })



})
