$(function () {
    // 进入用户中心页面，请求用户数据，进行页面渲染
    // （1）用户已登录，渲染数据
    // （2）未登录，；拦截到登录页
    $.ajax({
        type:"get",
        url:"/user/queryUserMessage",
        dataType:"json",
        success:function (info) {
            console.log( info );
            if(info.erro === 400){
                // 用户未登录
                location.href = "login,html";
                return;
            }
        // 用户已经登录，返回用户数据进行渲染
            var htmlStr = template("userTpl", info);
            $('#userinfo').html(htmlStr);
        }
    });

    // 2、退出功能
    // 点击退出按钮，跳转到登录页面登录页面
    $('#logout').click(function () {
        //发送请求，进行退出操作即可
        $.ajax({
            type:"get",
            url:"/user/logout",
            dataType:"json",
            success:function (info) {
                console.log(info);
                if(info.success){
                    // 退出成功
                    location.href = "login.html";
                }
            }
        })
    })
})