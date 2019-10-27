/*
* Created by huangyaozu 2019/10/26
* */

   mui('.mui-scroll-wrapper').scroll({
       deceleration: 0.0005 ,//flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
       bounce: true, //是否启用回弹
       scrollY:true,
       indicators:false
   });

    // 自动轮播图
    //获得slider插件对象
    var gallery = mui('.mui-slider');
    gallery.slider({
        interval:2000//自动轮播周期，若为0则不自动播放，默认为0；
    });

    //作用专门用于解析地址栏参数
    function getSearch(k){
        // 获取地址栏参数
        var search = location.search; //"?name=pp&age=18&desc=%E5%B8%85"
        // 将其解码为中文
        search = decodeURI(search); // "?name=pp&age=18&desc=帅"
        // 去掉问号
        search = search.slice(1); // "name=pp&age=18&desc=帅"
        // 通过&号进行分割
        var arr = search.split("&"); //["name=pp", "age=18", "desc=帅"]
        var obj = {};
        arr.forEach(function (v,i) { // v 表示每项 "name=pp"
            var key = v.split("=")[0];//name
            var value = v.split("=")[1];//pp
            //[]语法会解析变量
            obj[key]=value;
        });
        // console.log(obj[]);
        return obj[k];
    }

