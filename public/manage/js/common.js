/**
 * Created by Jepson on 2018/4/6.
 */

// 配置禁用小圆环
NProgress.configure({ showSpinner: false });

//// 开启进度条
//NProgress.start();
//
//setTimeout(function() {
//  // 关闭进度条
//  NProgress.done();
//}, 500)


// ajaxStart 所有的 ajax 开始调用
$(document).ajaxStart(function() {
  NProgress.start();
});


// ajaxStop 所有的 ajax 结束调用
$(document).ajaxStop(function() {
  // 模拟网络延迟
  setTimeout(function() {
    NProgress.done();
  }, 500)
});


// 在一进入页面进行登录状态获取
// 如果后端响应头中设置了 Content-Type: application/json
// jquery 会自动识别, 将返回数据类型, 当成json字符串解析成对象

if ( location.href.indexOf("login.html") === -1 ) {
  $.ajax({
    url: "/employee/checkRootLogin",
    type: "get",
    success: function( info ) {
      console.log( info )
      if ( info.success ) {
        console.log( "登陆了" );
        // 啥也不用干
      }

      if ( info.error === 400 ) {
        // 进行拦截, 拦截到登录页
        location.href = "login.html";
      }
    }
  })
}



$(function() {
  // 1. 二级分类切换功能
  $('.category').click(function() {
    $(this).next().stop().slideToggle();
  });


  // 2. 顶部菜单栏切换显示功能
  $('.icon_menu').click(function() {
    $('.lt_aside').toggleClass("hidemenu");
    $('.lt_main').toggleClass("hidemenu");
    $('.lt_topbar').toggleClass("hidemenu");
  });

  // 3. 点击退出图标显示退出模态框
  $('.icon_logout').click(function() {
    // 让模态框显示
    $('#logoutModal').modal("show");
  })

  // 4. 在外面注册 logoutBtn 退出按钮, 点击事件
  $('#logoutBtn').click(function() {
    console.log("hehe");

    // 访问退出接口, 进行退出
     $.ajax({
       url: "/employee/employeeLogout",
       type: "GET",
       dataType: "json",
       success: function( info ) {

         if ( info.success ) {
           location.href = "login.html"
         }
       }
     })
  })
})
