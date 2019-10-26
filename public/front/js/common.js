/*
* Created by huangyaozu 2019/10/26
* */
$(function () {
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
})