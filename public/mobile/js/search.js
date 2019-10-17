/**
 * Created by Jepson on 2018/8/12.
 */

$(function() {

  // 要渲染历史记录, 要先读取历史记录, 下面都是进行历史记录存取操作
  // 我们需要约定一个键名, search_list

  // 将来下面三句话, 可以放在控制台执行, 进行假数据初始化
  // var arr = [ "耐克", "李宁", "新百伦", "耐克王", "阿迪王" ];
  // var jsonStr = JSON.stringify( arr );
  // localStorage.setItem( "search_list", jsonStr );


  // 功能1: 历史记录渲染功能
  // (1) 读取本地历史, 得到 jsonStr
  // (2) 将 jsonStr 转换成 数组
  // (3) 通过数组, 进行页面渲染(模板引擎)
  render();

  // 封装一个方法, 用于读取历史记录数组, 返回一个数组
  function getHistory() {
    // 如果读取不出来数据, 默认初始化为 '[]'
    var history = localStorage.getItem("search_list") || '[]'; // 得到历史
    var arr = JSON.parse( history );  // 转成数组
    return arr;
  }
  // 专门用于读取本地历史记录, 进行渲染
  function render() {
    var arr = getHistory();
    // template( 模板id, 数据对象 ); 第二个要求必须是对象
    var htmlStr = template( "historyTpl", { arr: arr } );
    $('.lt_history').html( htmlStr );
  }



  // 功能2: 清空历史记录功能
  // (1) 通过事件委托给清空记录绑定点击事件
  // (2) 清空, 将本地的 search_list 移除, removeItem(key);
  // (3) 重新渲染页面
  $('.lt_history').on("click", ".btn_empty", function() {

    // mui确认框
    // 参数1: 提示文本
    // 参数2: 标题
    // 参数3: 提示框按钮按钮, 要求是一个数组
    // 参数4: 点击按钮后的回调函数
    mui.confirm( "你确定要清空历史记录嘛?", "温馨提示", ["取消", "确认"], function( e ) {
      console.log( e );
      if ( e.index === 1 ) {
        // 点击了确认
        // 移除本地历史
        localStorage.removeItem("search_list");
        // 重新渲染
        render();
      }
    })

  });


  // 功能3: 删除单条历史记录
  // (1) 事件委托绑定点击事件
  // (2) 将下标存在删除按钮中, 点击后获取下标
  // (3) 读取本地存储, 拿到数组
  // (4) 根据下标, 从数组中将该下标的项移除,  splice
  // (5) 将数组转换成 jsonStr
  // (6) 存到本地存储中
  // (7) 重新渲染
  $('.lt_history').on("click", ".btn_delete", function() {
    var that = this;

    mui.confirm("你确定要删除该条记录嘛", "温馨提示", ["取消", "确认"], function( e ) {

      if ( e.index === 1 ) {
        // 点击确认按钮

        // 获取下标
        var index = $(that).data("index");
        // 获取数组
        var arr = getHistory();
        // 根据下标删除某项
        // splice( 从哪开始, 删几个, 添加的项1, 添加的项2, ..... );
        arr.splice( index, 1 );

        // 转成 jsonStr 存入本地存储
        var jsonStr = JSON.stringify( arr );
        localStorage.setItem("search_list", jsonStr );

        // 重新渲染
        render();

      }

    })



  });



  // 功能4: 点击搜索按钮, 添加搜索记录
  // (1) 给 搜索按钮 注册点击事件
  // (2) 获取搜索框的内容
  // (3) 读取本地存储, 拿到数组
  // (4) 将搜索框的内容, unshift 到数组的最前面
  // (5) 将数组转成jsonStr, 存到本地存储中
  // (6) 重新渲染
  $('.search_btn').click(function() {
    var key = $('.search_input').val();  // 获取输入框的值
    if ( key.trim() === "" ) {
      // alert("请输入搜索关键字");
      // 默认值: 2000
      mui.toast("请输入搜索关键字", {
        duration: 2500
      });
      return;
    }


    var arr = getHistory();  // 获取数组

    // 需求:
    // 1. 不要有重复项, 如果有, 移除之前的, 将最新的添加到数组最前面
    var index = arr.indexOf( key );
    if ( index > -1 ) {
      // 说明在数组中 key 已存在
      arr.splice( index, 1 );
    }

    // 2. 数组长度控制在 10 以内
    if ( arr.length >= 10 ) {
      // 移除最后一个
      arr.pop();
    }


    arr.unshift( key ); // 往最前面追加
    // 转成 jsonStr, 存到本地存储中
    localStorage.setItem("search_list", JSON.stringify( arr ) );
    // 重新渲染
    render();
    // 清空搜索框内容
    $('.search_input').val("");


    // 搜索完成, 跳转到搜索列表, 并将搜索关键字传递过去
    location.href = "searchList.html?key=" + key;
  })


});
