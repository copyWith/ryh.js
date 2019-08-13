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
                    (type === "object" ? $(e).css(res) : res()) :
                    (type === "string" ? $(e).html(res) : _this.throw("Incorrect input parameter type")));
        })
    };
    // 瀑布流
    ryh.prototype.waterfall = function (e) {
    };
    // 懒加载
    ryh.prototype.lazyload = function (e) {
    };
    that.ryh = new ryh()
    typeof isModule && (ryh = ryh.prototype);
    return ryh;
});
