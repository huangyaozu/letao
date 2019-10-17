/**
 * Created by Jepson on 2018/8/13.
 */

$(function() {

  // 登录思路:
  // 1. 给登陆添加点击事件
  // 2. 获取用户名和密码
  // 3. 发送 ajax 进行登录验证
  //    登录成功, (1) 如果传了地址过来, 跳转到传过来的地址页面
  //              (2) 如果没有传地址, 直接跳转个人中心
  //    登录失败, 提示用户登陆失败

  $('#loginBtn').click(function() {
    // 获取用户名和密码
    var username = $('#username').val();
    var password = $('#password').val();

    if ( username.trim() === "" ) {
      mui.toast("请输入用户名");
      return;
    }
    if ( password.trim() === "" ) {
      mui.toast("请输入密码");
      return;
    }

    // 发送ajax请求, 进行登录
    $.ajax({
      type: "post",
      url: "/user/login",
      data: {
        username: username,
        password: password
      },
      dataType: "json",
      success: function( info ) {
        console.log( info );
        // 用户名或者密码错误
        if ( info.error ) {
          mui.toast("用户名或者密码错误");
          return;
        }
        // 登录成功
        if ( info.success ) {
          if ( location.search.indexOf("retUrl") > -1 ) {
            // (1) 传了地址, 就跳转到对应页面
            var retUrl = location.search.replace("?retUrl=", "");
            location.href = retUrl;
          }
          else {
            // (2) 没传地址, 跳转到个人中心页
            location.href = "user.html";
          }
        }
      }
    })


  })


})
