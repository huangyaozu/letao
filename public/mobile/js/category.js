/**
 * Created by Jepson on 2018/8/10.
 */

$(function() {

  // 1. 一进入页面, 发送请求, 获取左侧一级分类数据进行渲染
  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    dataType: "json",
    success: function( info ) {
      console.log( info );
      var htmlStr = template( "leftTpl", info );
      $('.lt_category_left ul').html( htmlStr );

      // 一进入页面, 渲染第一个一级分类, 对应的二级分类数据
      renderSecondById( info.rows[0].id );
    }
  });


  // 2. 通过事件委托, 给所有的左侧 a 绑定点击事件, 点击 a 切换显示二级分类
  $('.lt_category_left').on("click", "a", function() {
    // 给自己添加 current, 让其他所有的 a 移除 current
    $(this).addClass("current").parent().siblings().find("a").removeClass("current");

    // 获取 id, 根据 id, 渲染二级分类
    var id = $(this).data("id");
    renderSecondById(id);
  });


  // 通过 一级分类的 id, 进行右侧二级分类的重新渲染
  function renderSecondById( id ) {

    // 发送ajax请求
    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      data: {
        id: id
      },
      dataType: "json",
      success: function( info ) {
        console.log( info )
        var htmlStr = template("rightTpl", info);
        $('.lt_category_right ul').html( htmlStr );
      }
    })
  }

});
