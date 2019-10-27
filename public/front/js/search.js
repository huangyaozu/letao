/*Created by huangyaozu on 2019/10/26*/
$(function () {
    // 点击搜索按钮，将搜索框中的内容添加到历史记录中
    // 利用localStorage来进行存储
    // 注意: 要进行本地存储localStorage的操作, 进行历史记录管理,
    //       需要约定一个键名,  search_list
    //       将来通过 search_list 进行读取或者设置操作
    
    // 功能1: 列表渲染功能
    // (1) 从本地存储中读取历史记录, 读取的是 jsonStr
    // (2) 转换成数组
    // (3) 通过模板引擎动态渲染
    // render();
    // 从本地存储中读取历史记录, 以数组的形式返回
    render();
    function getHistory() {
        // 如果没有读取到数据, 默认初始化成一个空数组
        var history = localStorage.getItem("search_list") || '[]';
        var arr = JSON.parse(history);
        return arr;
    }
    // 读取数组，进行页面渲染
    function render(){
        var arr = getHistory();
        console.log(arr);
        var htmlStr = template("historyTpl", {arr:arr});
        $('.lt-history').html(htmlStr);
    }

    // 功能2:清空历史记录功能
    // （1）注册事件，通过事件委托
    // （2）清空记录，removeItem
    // （3）页面重新渲染
    $('.lt-history').on("click",".btn-empty",function () {
        // 添加 mui 确认框
        // 参数1: 对话框内容  message
        // 参数2: 对话框标题  title
        // 参数3: 按钮文本数组  btnArr
        // 参数4: 回调函数  callback
        mui.confirm("你确定要清空历史记录吗？","温馨提示",["取消", "确认"],function (e) {
            // e.index 可以获取所点击的按钮的索引
           if(e.index === 1 ){
               // 清空记录
               localStorage.removeItem("search_list");
               //重新渲染
               render();
           }
        });
    });

    // 功能3:删除单条历史记录
    // (1) 注册事件, 通过事件委托
    // (2) 将下标存在删除按钮上, 获取存储的下标
    // (3) 从本地存储中读取数组
    // (4) 通过 下标 从 数组中, 删除对应项   splice
    // (5) 将修改后的数组, 转成jsonStr, 存到本地存储中
    // (6) 页面重新渲染
    $('.lt-history').on("click",".btn-del",function () {
        var that = this;
        // 添加确认框
        mui.confirm("你确定要删除该条记录嘛?", "温馨提示", ["取消", "确认"], function( e ) {
            if(e.index === 1){
                // 用户点击了索引为 1 的确认按钮

                // 获取下标
                var index = $(that).data("index");
                // 获取数组
                var arr = getHistory();
                // 根据下标, 删除数组的对应项
                // splice( 从哪开始, 删除几项, 添加的项1, 添加的项2, ...... );
                arr.splice(index,1);
                // 转存jsonStr,存储到本地中
                localStorage.setItem("search_list", JSON.stringify(arr));
                //重新渲染页面
                render();
            }
        });
    })

    // 功能4:点击搜索按钮，将input框中的文本添加到历史记录并跳转到商品列表展示页面
    $('.search-btn').click(function () {
        var key = $('.search-input').val().trim();
        if(key === ''){
            mui.toast("请输入搜索关键字", {
                duration:2000
            });
            return;
        }
        // 获取本地历史记录
        var arr = getHistory();
        // 需求:
        // 1. 如果有重复的, 先将重复的删除, 将这项添加到最前面
        // 2. 长度不能超过 10 个
        var index = arr.indexOf(key);
        if(index != -1){
            // 说明在数组中可以找到重复的项, 且索引为 index
            arr.splice(index,1);
        }
        if(arr.length >= 10){
            // 删除最后一项
            arr.pop()
        }
        // 将搜索记录添加到历史记录中
        arr.unshift(key);
        // 转存jsonStr，存储到本地中
        localStorage.setItem("search_list", JSON.stringify(arr));
        // 重新渲染
        render();
        // 清空框框中国的记录
        $('.search-input').val("");
        //添加跳转，跳转到产品列表展示页
        location.href = "searchList.html?key=" + key;
    })

})