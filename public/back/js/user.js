/*
* Create By huangyaozu 2019/10/20 
* */
$(function () {
    var currentPage = 1;  // 当前页
    var pageSize = 5;   // 每页条数
    var totalPage; //总页数
    var currentId; //当前用户id
    var isDelete;//是否启停

    // 1. 一进入页面, 发送 ajax 请求所有用户的数据, 进行页面渲染
    render();
    function render(){
        $.ajax({
            type:"get",
            url:"/user/queryUser",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType:"json",
            success:function (info) {
                console.log(info);
                // 参数1: 模板id
                // 参数2: 数据对象
                var htmlStr = template("tpl", info);
                $(".lt_content tbody").html(htmlStr);
                totalPage = Math.ceil(info.total/info.size);
                // 分页初始化
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage:info.page,//当前页
                    totalPages:totalPage,//总页数
                    size:"small",//设置控件的大小，mini, small, normal,large
                    onPageClicked:function(event, originalEvent, type, page){
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        // console.log(page);
                        currentPage = page;
                        render();
                    }
                });

            }
        });
    }


    // 2. 用户点击操作按钮显示模态框改变操作状态
    // 由于是动态生成的，需要用到事件委托
    $("tbody").on("click",".btn", function () {
        // console.log("被点击了");
        $("#myStatus").modal("show");
        currentId = $(this).parent().data("id");
        isDelete = $(this).hasClass("btn-danger") ? 0:1;
    });

    // 3.点击确定按钮改变按钮状态,实现启用和禁用切换
    $("#makeSureBtn").click(function () {
        // 通过ajax请求，从后台响应的数据来改变状态，需要传两个参数
        console.log( "切换启用禁用状态" );
        // $.ajax({
        //     type:"post",
        //     url:"/user/updateUser",
        //     data:{
        //         id:"currentId",
        //         isDelete:"isDelete"
        //     },
        //     dataType:"json",
        //     success:function (info) {
        //         console.log(info);
        //         render();
        //     }
        //
        // });
        $.ajax({
            type: "post",
            url: "/user/updateUser",
            data: {
                id : currentId,
                isDelete: isDelete
            },
            dataType: "json",
            success: function( info ) {
                //console.log( info )

                if ( info.success ) {
                    // 修改状态成功
                    // 关闭模态框 显示show, 关闭hide
                    $('#myStatus').modal("hide");
                    // 页面重新渲染
                    render();
                }
            }
        });

    })
});
