/*
* Created by huangyaozu 2019/10/22
* */
$(function () {
    // 1.通过ajax请求商品数据进行页面渲染
    var currentPage = 1;
    var pageSize = 2;
    // 定义 用来存储已上传图片 的数组
    var picArr = [];

    render();
    function render() {
        $.ajax({
            type:"get",
            url:"/product/queryProductDetailList",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType:"json",
            success:function (info) {
                // console.log(info);
                var htmlStr = template("productTpl", info);
                $(".lt-content tbody").html(htmlStr);

                // 2.动态分页图标渲染 分页初始化
                $("#paginator").bootstrapPaginator({
                   bootstrapMajorVersion:3,
                    // 当前页
                    currentPage:info.page,
                    // 总页数
                    totalPages:Math.ceil(info.total/info.size),
                    //改变操作按钮样式，设置为中文
                    // 每个按钮在初始化的时候，都会调用一次这个函数，通过返回值进行设置文本
                    // 参数1: type  取值: page  first  last  prev  next
                    // 参数2: page  指当前这个按钮所指向的页码
                    // 参数3: current 当前页
                    itemTexts:function (type, page, current) {
                    // console.log(arguments);
                        switch (type){
                            case "page":
                                return "第"+ page +"页";
                            case "first":
                                return "首页";
                            case "last":
                                return "尾页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                        }
                    },

                    // 配置 title 提示信息
                    // 每个按钮在初始化的时候, 都会调用一次这个函数, 通过返回值设置title文本
                    tooltipTitles:function(type, page, current){
                        switch ( type ) {
                            case "page":
                                return "前往第" + page + "页";
                            case "first":
                                return "首页";
                            case "last":
                                return "尾页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                        }
                    },

                    // 使用 bootstrap 的提示框组件
                    useBootstrapTooltip: true,

                    // 添加按钮点击事件
                    onPageClicked:function (a,b,c,page) {
                        //更新当前页
                        currentPage = page;
                        // 重新渲染
                        render();
                    }

                });
            }
        });
    }

    // 4.点击添加商品按钮显示模态框
    $("#addBtn").click(function () {
        $("#addModal").modal("show");

        // 5.模态框添加商品下拉列表动态渲染
        // 模拟分页查询二级分类名称的方式
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            dataType:"json",
            success:function (info) {
                console.log(info);
                var htmlStr = template("dropdownTpl", info);
                $(".dropdown-menu").html(htmlStr);
            }
        })
    });

    // 6.给dropdown-menu下面的a注册点击事件(通过事件委托)
    $(".dropdown-menu").on("click","a",function () {
        // 设置文本
        var txt = $(this).text();
        $('#dropdownText').text( txt );

        // 设置 id 给隐藏域, name="brandId"
        var id = $(this).data("id");
        $('[name="brandId"]').val( id );

        //重新校验VALID
        $("#form").data("bootstrapValidator").updateStatus("brandId", "VALID");
    });

    // 7. 文件上传初始化
    //    多文件上传时, 插件会遍历选中的图片, 发送多次请求到服务器, 将来响应多次
    //    每次响应都会调用一次 done 方法
    $("#fileupload").fileupload({
        // 返回的数据格式
        dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        // 文件上传完成调用回调函数
        done:function (e, data) {
            console.log(data.result);
            // 往数组前面追加图片对象
            picArr.unshift(data.result);
            //往imgBox最前面追加img元素
            $("#img-box").prepend('<img src="'+data.result.picAddr+'" width="100px" alt="">');

            // 通过判断数组的长度，如果数组的长度大于3，将数组的最后一项移出
            if(picArr.length > 3){
                //移除数组的最后一项
                picArr.pop();

                // 移除imgBox的最后一个图片
                $("#img-box img:last-of-type").remove();
            }
            // 如果处理后, 图片数组的长度为 3, 那么就通过校验, 手动将picStatus置成VALID
            if( picArr.length === 3 ){
                $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");
            }
        }
    });

        // 8.表单校验初始化
    $("#form").bootstrapValidator({
            // 图标状态校验
            // 重置排除项
            excluded: [],
            // 配置校验图标
            // 配置校验图标
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',    // 校验成功
                invalid: 'glyphicon glyphicon-remove',  // 校验失败
                validating: 'glyphicon glyphicon-refresh' // 校验中
            },

            // 配置校验字段
            fields:{
                // 选择二级分类
                brandId:{
                    validators:{
                        notEmpty:{
                            message:"请选择二级分类"
                        }
                    }
                },
                // 产品名称
                proName:{
                    validators:{
                        notEmpty:{
                            message:"请输入商品名称"
                        }
                    }
                },
                // 产品描述
                proDesc:{
                    validators:{
                        notEmpty:{
                            message:"请输入商品描述"
                        }
                    }
                },
                // 产品库存
                // 除了非空之外, 要求必须是非零开头的数字
                num:{
                    validators:{
                        notEmpty:{
                            message:"请输入商品库存"
                        },
                        //正则校验
                        // \d 表示数字 0-9
                        // + 表示出现一次或多次
                        // * 表示出现0次或多次
                        // ? 表示出现0次或1次
                        regexp: {
                            regexp: /^[1-9]\d*$/,
                            message: '商品库存必须是非零开头的数字'
                        }
                    }
                },

                // 尺码, 还要求必须是 xx-xx 的格式, x为数字
                size:{
                    validators:{
                        notEmpty:{
                            message: "请输入商品尺码"
                        },
                        regexp:{
                            regexp:/^\d{2}-\d{2}$/,
                            message:'尺码必须是 xx-xx 的格式, 例如: 32-40'
                        }
                    }
                },

                // 原价
                oldPrice:{
                    validators:{
                        notEmpty:{
                            message:"请输入商品原价"
                        }
                    }
                },

                // 现价
                price:{
                    validators:{
                        notEmpty:{
                            message:"请输入商品现价"
                        }
                    }
                },

                //图片校验
                picStatus:{
                    validators:{
                        notEmpty:{
                            message:"请选择三张图片"
                        }
                    }
                }
            }
    });

    // 9.注册表单校验成功事件，阻止默认的提交，通过ajax进行提交
    $("#form").on("success.form.bv", function (e) {
        // 阻止默认的提交
        e.preventDefault();

        // 获取的是表单元素数据
        var paramsStr = $("#form").serialize();

        // 还需要拼接上图片的数据
        // &picName1=xx&picAddr1=xx
        // &picName2=xx&picAddr2=xx
        // &picName3=xx&picAddr3=xx
        // paramsStr = paramsStr + "&picName1="+picArr[0].picName+"&picAddr1="+picArr[0].picAddr+"";
        paramsStr+="&picName1="+picArr[0].picName+"&picAddr1="+picArr[0].picAddr;
        paramsStr+="&picName2="+picArr[1].picName+"&picAddr2="+picArr[1].picAddr;
        paramsStr+="&picName3="+picArr[2].picName+"&picAddr3="+picArr[2].picAddr;

        $.ajax({
            type:"post",
            url:"/product/addProduct",
            data: paramsStr,
            dataType: "json",
            success:function (info) {
                console.log(info);
                if(info.success){
                    // 添加成功
                    // 关闭模态框
                    $("#addModal").modal("hide");
                    // 重新渲染页面
                    currentPage = 1;
                    render();

                    // 重置表单的内容和校验状态
                    $("#form").data("bootstrapValidator").resetForm(true);
                    // 下拉列表 和 图片 不是表单元素, 需要手动重置
                    $('#dropdownText').text("请选择二级分类");
                    $('#img-box img').remove(); // 让所有的图片自杀
                }

            }
        });
    })


})