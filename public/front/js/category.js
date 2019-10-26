// Created by huangyaozu 2019/10/16
// 分类页面左侧栏一级分类渲染
$(function () {
    // 左侧一级分类渲染
    $.ajax({
        type:'get',
        url:'/category/queryTopCategory',
        dataType:'json',
        success:function (info) {
            console.log(info);
            var htmlStr = template("leftTpl", info);
            $('.lt-category-left ul').html(htmlStr);
            // 一进入页面, 渲染第一个一级分类所对应的二级分类
            renderSecondById(info.rows[0].id);
        }
    });

  // 2.右侧二级分类列表渲染
  //   点击左侧菜单栏一级分类按钮右侧显示相应二级分类内容
    $('.lt-category-left').on("tap", "a", function () {
        var categoryId = $(this).data("id");
        $(this).addClass("current").parent().siblings().find("a").removeClass("current");
        renderSecondById(categoryId );
        });
    // 实现一个方法: 专门用于根据一级分类 id 去渲染 二级分类
    function renderSecondById( id ) {
        // 发送 ajax 请求
        $.ajax({
            type: "get",
            url: "/category/querySecondCategory",
            data: {
                id: id
            },
            dataType: "json",
            success: function( info ) {
                console.log( info );
                var htmlStr = template("rightTpl", info);
                $('.lt-category-right ul').html( htmlStr );
            }
        })

    }


})