/*
 * Create By huangyaozu 2019/10/20
 * */

$(function () {
    // 基于准备好的dom，初始化echarts实例
    var echarts_1 = echarts.init(document.querySelector(".echarts_1"));

// 指定图表的配置项和数据
    var option1 = {
        title: {
            text: '2018年注册人数'
        },
        tooltip: {},
        legend: {
            data:['人数']
        },
        xAxis: {
            data: ["1月","2月","3月","4月","5月","6月"]
        },
        yAxis: {},
        series: [{
            name: '人数',
            type: 'bar',
            data: [1200, 1300, 1600, 1720, 1522, 2000]
        }]
    };

// 使用刚指定的配置项和数据显示图表。
    echarts_1.setOption(option1);

// 基于准备好的dom，初始化echarts实例
    var echarts_2 = echarts.init(document.querySelector(".echarts_2"));

// 指定图表的配置项和数据
    option2 = {
        title : {
            text: '热门品牌销售',
            subtext: '2019年10月',
            x:'center'
        },
        // 提示框组件
        tooltip : {
            trigger: 'item',
            // 配置提示信息
            // {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['耐克','阿迪','新百伦','阿尼玛','海澜之家']
        },
        series : [
            {
                name: '品牌',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'耐克'},
                    {value:310, name:'阿迪'},
                    {value:234, name:'新百伦'},
                    {value:135, name:'阿尼玛'},
                    {value:1548, name:'海澜之家'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };


// 使用刚指定的配置项和数据显示图表。
    echarts_2.setOption(option2);
})
