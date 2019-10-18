/*
* Create by huangyaozu 2019/10/18
* */
$(function () {
    /*
     * 1. 进行表单校验配置
     *    校验要求:
     *        (1) 用户名不能为空, 长度为2-6位
     *        (2) 密码不能为空, 长度为6-12位
     * */
// 配置的字段和 input 框中指定的 name 关联, 所以必须要给 input 加上 name
    $("#form").bootstrapValidator({

        //配置校验图标
        feedbackIcons:{
            valid: 'glyphicon glyphicon-ok',    // 校验成功
            invalid: 'glyphicon glyphicon-remove',  // 校验失败
            validating: 'glyphicon glyphicon-refresh' // 校验中
        },
        //配置字段：
        fields:{
            username:{
                //配置校验规则：
                validators:{
                    //非空
                    notEmpty:{
                        //提示信息：
                        message:"用户名不能为空"
                    },
                    //长度校验
                    stringLength:{
                        min:2,
                        max:6,
                        message:"用户名长度必须在2-6位"
                    },
                    callback:{
                        message:"用户名不存在"
                    }
                }
            },
            password:{
                validators:{
                    notEmpty:{
                        message:"密码不能为空"
                    },
                    stringLength:{
                        min:6,
                        max:12,
                        message:"密码长度必须是6-12位"
                    },
                    callback:{
                        message:"密码错误"
                    }
                }
            }

        }
    });

    /*
     * 2. 登陆功能
     *    表单校验插件会在提交表单时进行校验
     *    (1) 校验成功, 默认就提交表单, 会发生页面跳转,
     *        我们需要注册表单校验成功事件, 阻止默认的提交, 通过ajax进行发送请求
     *    (2) 校验失败, 不会提交表单, 配置插件提示用户即可
     * */
    // 注册表单校验成功事件
    $("#form").on("success.form.bv", function (e) {
        //阻止默认提交表单
        e.preventDefault();
        // console.log( "校验成功后的 表单提交 被阻止了" );
        //通过ajax进行提交
        $.ajax({
            type:"post",
            url:"/employee/employeeLogin",
            data: $('#form').serialize(),
            dataType:"json",
            success:function (info) {
                console.log(info);
                if(info.success){
                    // 登录成功, 跳转到首页
                    location.href = "index.html";
                }
                if(info.error == 1000){
                    // alert("用户名不存在");
                    //alert("当前用户名不存在");
                    // updateStatus 更新校验状态
                    // 1. 字段名称
                    // 2. 校验状态  VALID, INVALID   NOT_VALIDATED未校验的,  VALIDATING校验中的
                    // 3. 校验规则,
                    $("#form").data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
                }
                if(info.error == 1001){
                    // alert("密码错误");
                    $("form").data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
                }
            }
        });
    });

    // 3.重置功能   
    $('[type="reset"]').click(function () {
        // 调用插件的方法, 进行重置校验状态
        // resetForm(boolean),
        // 1. 传true, 重置内容以及校验状态
        // 2. 传false, 只重置校验状态
        $("#form").data("bootstrapValidator").resetForm();
    })
    
});