(function (win, fun) {
    // 判断有没有找到document对象
    // node.js情况下直接公开为module.exports,例如var ryh=require("ryh")
    typeof module === "object" && typeof module.exports === "object" ?
        (module.exports = win.document ? fun(win, true) : (function () { throw new Error("No document was found"); })()) :
        fun(win)
})(typeof window !== "undefined" ? window : this, function (that, isModule) {
    var ryh = function () { };
    ryh.prototype.init = function () {
        //    初始化
    };
    // 抛出错误
    ryh.prototype.throw = function (str) {
        throw new Error(str);
    };
    // 移动到某处执行某操作
    ryh.prototype.moveTo = function (e, res) {//res支持传入css,function,string
        var _this = this, endTop = $(e).offset().top, type = typeof res;
        $(that).on("scroll", function () {
            $(that).scrollTop() + $(that).height() >= endTop &&
                ((type === "object" && typeof res.length !== "number") || type === "function" ?
                    (type === "object" ? $(e).css(res) : res.apply($(e))) :
                    (type === "string" ? $(e).html(res) : _this.throw("Incorrect input parameter type")));
        })
    };
    // 瀑布流
    ryh.prototype.waterfall = function (e) {
        
    };
    // 图片懒加载
    ryh.prototype.lazyload = function (e, obj) {
        // obj(object)支持参数:
        var option = {
            event: '',  //触发事件,不传为滚动加载,click时点击图片加载
            top: '',  //距离顶部多久时加载图片,滚动加载时生效,可以为负数(单位px)
            time: 0,  //触发事件后延迟多久加载图片(单位ms)
            lazyImg: 'https://github.com/copyWith/photoGallery/blob/master/no-img.jpg?raw=true'  //图片未加载时显示的图片地址
        }, _this;
        $.extend(option, obj);
        $(e).attr("src", option.lazyImg);
        option.event == "click" ?
            $(e).on("click", function () { _this = $(this), setTimeout(function () { _this.attr("src", _this.data("lazy")) }, option.time); })
            : $(that).on("scroll", function () {
                $(e).each(function () {
                    (function (_this) { $(that).scrollTop() + $(that).height() >= (option.top?_this.offset().top - option.top:_this.offset().top) && 
                        setTimeout(function () { _this.attr("src", _this.data("lazy")) }, option.time) })($(this));
                })
            })
    };
    that.ryh = new ryh();
    typeof isModule && (ryh = ryh.prototype);
    return ryh;
});
