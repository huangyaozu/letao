/**
 * Created by Jepson on 2018/8/13.
 */
$(function() {


  // 1. 进入页面, 发送ajax请求, 获取购物车列表, 进行渲染
  function render() {
    setTimeout(function() {
      $.ajax({
        type: "get",
        url: "/cart/queryCart",
        dataType: "json",
        success: function( info ) {
          console.log( info );
          if ( info.error === 400 ) {
            // 用户没登陆, 跳转到登录页, 在跳转时, 将页面地址拼接
            location.href = "login.html?retUrl=" + location.href;
            return;
          }

          // 用户已登录, 通过模板引擎渲染  (需要的是对象, 要将数组包装)
          var htmlStr = template( "cartTpl" , { arr: info } );
          $('.lt_main .mui-table-view').html( htmlStr );

          // 关闭下拉刷新
          mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
        }
      });
    }, 500);
  }

  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识
      down : {
        auto: true, // 加载自动下拉刷新一次
        callback: function() {
          console.log( "发送ajax请求, 进行页面刷新" );
          render();
        }
      }
    }
  });


  // 2. 删除功能
  //    (1) 点击事件绑定要通过事件委托绑定, 且要绑定 tap 事件
  //    (2) 获取当前购物车 id
  //    (3) 发送 ajax 请求进行删除
  //    (4) 页面重新渲染
  $('.lt_main').on("tap", ".btn_delete", function() {
    // 获取 id
    var id = $(this).data("id");

    // 发送 ajax 请求
    $.ajax({
      type: "get",
      url: "/cart/deleteCart",
      // 注意: 后台要求传递的数组, 虽然这里只删一个, 但是格式还是数组
      data: {
        id: [ id ]
      },
      dataType: "json",
      success: function( info ) {
        console.log( info );
        if ( info.success ) {
          // 页面重新渲染, 触发一次下拉刷新即可
          mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
        }
      }
    })

  });


  // 3. 编辑功能
  //    点击编辑按钮, 显示确认框
  $('.lt_main').on("tap", ".btn_edit", function() {

    // 自定义属性 dataset, dom对象的属性
    var obj = this.dataset;
    // 从自定义属性中获取 id
    var id = obj.id;

    console.log( obj )

    var htmlStr = template( "editTpl", obj );
    // 换行 \n, mui 会将所有 \n 解析成 br 标签进行换行
    // 我们需要在传递给 确认框前, 将所有的 \n 去掉
    htmlStr = htmlStr.replace( /\n/g, "" );

    // 显示确认框
    mui.confirm( htmlStr, "编辑商品", ["确认", "取消"], function( e ) {

      if ( e.index === 0 ) {
        // 确认编辑
        // 获取尺码和数量, 进行提交
        var size = $('.lt_size span.current').text();
        var num = $('.mui-numbox-input').val();

        $.ajax({
          type: "post",
          url: "/cart/updateCart",
          data: {
            id: id,
            size: size,
            num: num
          },
          dataType: "json",
          success: function( info ) {
            console.log( info );
            if ( info.success ) {
              // 编辑成功, 页面重新, 下拉刷新一次即可
              mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
            }
          }
        })


      }
    });

    // 手动初始化数字框
    mui(".mui-numbox").numbox();

  })


  // 给编辑模态框的尺码添加选中功能
  $('body').on("click", ".lt_size span", function() {
    $(this).addClass("current").siblings().removeClass("current");
  });

});
