// Created by huangyaozu on 2019/10/27
$(function () {
    var currentPage = 1; //当前页
    var pageSize = 2; // 每页多少条

    // 根据关键字进行搜索，发送请求，进行页面渲染
    // 整个页面的核心方法 render
    // 在 render 方法中, 处理了所有的参数, 发送请求, 获取数据
    function render(callback) {
        // 准备请求数据，渲染时显示加载中的效果
       // $('.lt-product').html('<div class="loading"></div>');
        var params = {};
        //三个必须传的参数
        params.proName = $('.search-input').val();
        params.page = currentPage;
        params.pageSize = pageSize;
        // 2、两个可传可不传的参数,
        // (1) 需要根据高亮的 a 来判断传哪个参数,
        // (2) 通过箭头判断, 升序还是降序
        // 价格: price    1升序，2降序
        // 库存: num      1升序，2降序
        var $current = $('.lt-sort a.current');
        if($current.length > 0){
            // 有高亮的 a, 说明需要进行排序
            // 获取传给后台的键
            var sortName = $current.data("type");
            // 获取后台的值，通过箭头来判断
            var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
            // 添加到params中
            params[sortName] = sortValue;
        }

        setTimeout(function () {
            $.ajax({
                type:'get',
                url:'/product/queryProduct',
                data:params,
                dataType:"json",
                success:function (info) {
                    console.log(info);
                    callback && callback(info);
                }
            });
        },500);
    }


    // 功能1: 获取地址栏传递过来的搜索关键字, 设置给 input
    var key = getSearch("key");
    // 设置给 input
    $('.search-input').val(key);
    // 一进入页面, 渲染一次
    // render();
    // 配置下拉刷新和上拉加载注意点:
    // 下拉刷新是对原有数据的覆盖, 执行的是 html 方法
    // 上拉加载时在原有结构的基础上进行追加, 追加到后面, 执行的是 append 方法
    mui.init({
        // 配置pullRefresh
        pullRefresh:{
        container:".mui-scroll-wrapper", //下拉刷新容器标识，querySelector能定位的css选择器均可
            // 配置下拉刷新
            down:{
                // 配置一进入页面，就自动下拉刷新一次
                auto:true,
                callback:function () {
                    console.log("发送ajax请求，进行页面渲染");

                    //加载第一页的数据
                    currentPage = 1;
                    // 拿到数据后, 需要执行的方法是不一样的, 所以通过回调函数的方式, 传进去执行
                    render(function (info) {
                        var htmlStr = template("productTpl", info);
                        $('.lt-product').html(htmlStr);

                        // ajax 回来之后, 需要结束下拉刷新, 让内容回滚顶部
                        // 注意: api 做了更新, mui文档上还没更新上(小坑)
                        //      要使用原型上的 endPulldownToRefresh 方法来结束 下拉刷新
                        mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();

                        //第一页数据被重新加载之后，又有数据可以进行上拉加载，需要启动上拉加载
                        mui(".mui-scroll-wrapper").pullRefresh().enablePullupToRefresh();
                    });
                }
            },
            // 配置上拉加载
            up:{
                callback:function () {
                    console.log("执行了上拉加载");
                    //需要加载下一页的数据，更新当前页
                    currentPage++;
                    render(function (info) {
                        var htmlStr = template("productTpl", info);
                        $('.lt-product').append(htmlStr);

                        // 当数据回来之后，需要结束上拉加载
                        // endPullupToRefresh(boolean) 结束上拉加载
                        // 1. 如果传 true, 没有更多数据, 会显示提示语句, 会自动禁用上拉加载, 防止发送无效的ajax
                        // 2. 如果传 false, 还有更多数据
                        if(info.data.length === 0){
                            //没有更多的数据，显示提示语句
                            mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh( true );
                        }else{
                            // 还有数据, 正常结束上拉加载
                            mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh( false );
                        }
                    });
                }
            }
        }
    });


    // 功能2：点击搜索按钮，实现搜索功能
    $('.search-btn').click(function () {
        // 需要将搜索关键字, 追加存储到本地存储中
        var key = $('.search-input').val();
        if(key.trim() === ''){
            mui.toast("请输入搜索关键字");
            return;
        }
        // 执行一次下拉刷新即可, 在下拉刷新回调中, 会进行页面渲染
        // 调用 pulldownLoading 执行下拉刷新
        mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading()

        // 获取数组，需要将jsonStr ==> arr
        var history = localStorage.getItem('search_list') || [];
        var arr = JSON.parse(history);

        // 1.删除重复的项
        var index = arr.indexOf(key);
        if(index != -1){
            // 删除重复的项
            arr.splice(index,1);
        }
        // 2.长度限制在10
        if(arr.length >= 10){
            // 删除最后一项
            arr.pop();
        }
        // 将关键字追加到arr最前面
        arr.unshift(key);
        // 转成json，存储到本地存储中
        localStorage.setItem("search_list", JSON.stringify(arr));
    });

    // 功能3：排序功能
    // 通过属性选择器给价格和库存添加点击事件
    // (1) 如果自己有 current 类, 切换箭头的方向即可
    // (2) 如果自己没有 current 类, 给自己加上 current 类, 并且移除兄弟元素的 current

    $('.lt-sort a[data-type]').click(function () {
        if ( $(this).hasClass("current") ){
            // 有current类，切换箭头即可
            $(this).find("i").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
        }else{
            $(this).addClass("current").siblings().removeClass("current");
        }

        // 执行一次下拉刷新即可
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    });

    //功能4：点击每个商品实现页面跳转， 注册点击事件, 通过事件委托注册, 注册 tap 事件
    $('.lt-product').on("tap","a",function () {
        var id = $(this).data("id");
        location.href = "product.html?productId="+id;
    });

})