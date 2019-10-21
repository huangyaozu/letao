/*
* Created by huangyaozu 2019/10/21
* */
$(function () {
    var currentPage = 1;
    var pageSize = 5;

    render();
    function render() {
        // 1.通过ajax来渲染二级分类页面
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType:"json",
            success:function(info){
                console.log(info);
                var htmlStr = template("cateTpl", info);
                $(".lt-content tbody").html(htmlStr);

                // 进行分页初始化
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    // 当前页
                    currentPage: info.page,
                    // 总页数
                    totalPages: Math.ceil(info.total / info.size),
                    // 添加按钮点击事件
                    onPageClicked: function( a, b, c, page ) {
                        // 更新当前页
                        currentPage = page;
                        // 重新渲染
                        render();
                    }
                });
            }
        });
    };

    // 2.点击添加分类按钮显示添加分类模态框
    $("#addBtn").click(function () {
        // 显示模态框
        $("#addModal").modal("show");

        // 3.ajax请求后台渲染下拉菜单,获取所有的一级分类的数据
        // 通过获取一级分类接口(带分页的) 模拟 获取全部一级分类的接口
        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success: function( info ) {
                console.log( info )
                var htmlStr = template("dropdownTpl", info );
                $('.dropdown-menu').html( htmlStr );
            }
        })
    });

    // 4.给下拉列表添加点击事件，通过事件委托来绑定
    $(".dropdown-menu").on("click","a",function () {
        // 获取 a 的文本
        var txt = $(this).text();
        // 获取a文本的id
        var id =  $(this).data("id");
        // 设置给按钮
        $("#dropdownText").text(txt);
        // 将a文本的id赋值给input的value
        $("[name='categoryId']").val(id);

        // 设置隐藏域的校验状态为VALID
        $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");

    });

    // 5.配置文件上传插件，进行图片预览、
    $("#fileupload").fileupload({
       dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done:function (e, data) {
            console.log(data);
            // 获取地址
            var imgUrl = data.result.picAddr;
            $("#img-box img").attr("src",imgUrl);
            $("[name='brandLogo']").val(imgUrl);

            // 设置隐藏域的校验状态为VALID
            $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
        }

    });

    // 6.进行表单校验
    $("#form").bootstrapValidator({
        // 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        // 默认插件不对隐藏域进行校验, 现在需要对隐藏域进行校验
        // 重置排除项
        excluded: [],
        // 配置校验图标
        // 配置校验图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',    // 校验成功
            invalid: 'glyphicon glyphicon-remove',  // 校验失败
            validating: 'glyphicon glyphicon-refresh' // 校验中
        },

        // 配置字段
        fields: {
            //categoryId 选择的一级分类 id
            //brandName  二级分类名称
            //brandLogo  上传的图片地址
            categoryId: {
                // 配置校验规则
                validators: {
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: "请输入二级分类"
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "请上传图片"
                    }
                }
            }
        }
    });

    // 6.注册表单校验成功事件，阻止默认的表单提交，用ajax来进行提交
    $("#form").on("success.form.bv",function (e) {
        e.preventDefault();
        // 通过ajax进行提交
        $.ajax({
            type:"post",
            url:"/category/addSecondCategory",
            data:$("#form").serialize(),
            dataType:"json",
            success:function (info) {
                console.log(info);
                if(info.success){
                    $("#addModal").modal("hide");
                    currentPage = 1;
                    render();
                    $("#form").data("bootstrapValidator").resetForm(true);
                    // 下拉按钮的文本, 图片不是表单元素, 需要手动重置
                    // $(".#dropdownText").text("请选择一级分类");
                    // $("#img-box img").attr("src", "./images/none.png");
                    $('#dropdownText').text("请选择一级分类");
                    $('#img-box img').attr("src", "./images/none.png");
                }
            }
        })

    });

});