/*
* Create by huangyaozu 2019/9/22
* */
$(function () {

    var currentPage = 1;
    var pageSize = 5;
    render();
    function render() {
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:currentPage,
                pageSize: pageSize
            },
            dataType:"json",
            success:function (info) {
                console.log(info);
                var htmlStr = template("cateTpl",info);
                $(" .lt-content tbody").html(htmlStr);

                // 分页插件的初始化
                $("#paginator").bootstrapPaginator({
                    // 指定bootstrap的版本号
                    bootstrapMajorVersion: 3,
                    // 当前页：
                    currentPage:info.page,
                    // 总页数
                    totalPages:Math.ceil(info.total/info.size),
                    // 给页码添加点击事件
                    onPageClicked:function (a,b,c,page) {
                        // 更新当前页
                        currentPage = page;
                        render();
                    }
                })
            }
        });
    }
    // 1.一级分类页面内容通过ajax进行动态渲染

   // 2.点击分类按钮弹出模态框
    $("#addBtn").click(function () {
      $("#addModal").modal("show");
    })

    // 3.点击模态框中的添加按钮添加内容
    // 实现表单校验,表单校验初始化
    $("#form").bootstrapValidator({
        // 配置校验图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',    // 校验成功
            invalid: 'glyphicon glyphicon-remove',  // 校验失败
            validating: 'glyphicon glyphicon-refresh' // 校验中
        },
        // 字段列表
        fields:{
            categoryName:{
                // 校验规则，非空要求
                validators:{
                    notEmpty:{
                        message:"请输入一级分类名"
                    }
                }
            }
        }
    });

    // 4.添加成功后阻止表单的默认行为
    $("#form").on("success.form.bv", function (e) {
        //阻止表单默认提交的行为
        e.preventDefault();

        // 同过ajax进行提交
        $.ajax({
           type:"post",
            url:"/category/addTopCategory",
            data:$("#form").serialize(),
            dataType:"json",
            success:function (info) {
                if(info.success){
                    // 添加成功隐藏模态框
                    $("#addModal").modal("hide");
                    // 重新渲染页面
                    currentPage = 1;
                    render();

                    // 重置表单内容和状态
                    $("#form").data("bootstrapValidator").resetForm(true);
                }
            }
        });
    })
});
