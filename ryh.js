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
    // 图片宽高自适应(以短边100%为准)
    ryh.prototype.imgAuto = function (e) {
        var w = { width: "auto", height: "100%", position: "absolute", top: "0", left: "-50%" },  //宽度大于高度
            h = { width: "100%", height: "auto", position: "absolute", top: "-50%", left: "0" },  //高度大于宽度
            b = { width: "100%", height: "100%", position: "absolute", top: "0", left: "0" };  //宽高相等
        $(e).each(function (index, item) {
            var image = new Image();
            image.src = $(item).attr("src");
            $(item).parent().css("position") == "static" && $(item).parent().css("position", "relative");
            image.complete ? (image.width == image.height ? $(item).css(b) : image.width > image.height ? $(item).css(w) : $(item).css(h)) :
                image.onload = function () { image.width == image.height ? $(item).css(b) : image.width > image.height ? $(item).css(w) : $(item).css(h) };
        })
    };
    // 跑马灯效果(竖向无限滚动)
    ryh.prototype.horselight = function (e, obj) {
        // obj(object)支持参数:
        var option = {
            itemEle: "div",  //跑马灯内容外层元素
            speed: 50,  //滚动速度(单位ms)
            delayed: 1000,  //延时滚动(单位ms)
            distance: 1  //滚动距离(单位px)
        }, timer;
        $.extend(option, obj);
        $(e).children(option.itemEle).clone(true).appendTo($(e));
        timer = setTimeout(function () {
            clearTimeout(timer);
            timer = setInterval(auto, option.speed);
        }, option.delayed)
        function auto() {
            $(e).scrollTop() > $(e).children(option.itemEle).height() ? $(e).scrollTop(1) : $(e).scrollTop($(e).scrollTop() + Number(option.distance));
            $(e).scrollTop() % $(e).height() == 0 && (clearInterval(timer), setTimeout(function () { timer = setInterval(auto, option.speed) }, option.delayed));
        }
    };
    // 瀑布流
    ryh.prototype.waterfall = function (e, obj) {
        // obj(object)支持参数:
        var option = {
            itemEle: "div",  //瀑布流子元素
            spacingWidth: 2,  //距离左右元素宽度
            spacingHieght: 4,  //距离下方元素高度
            colCount: 3,  //一行几列
            minHieght: "260",   //随机高度最小值
            maxHieght: "290"   //随机高度最大数
        }, topList = [], heightList = [];
        $.extend(option, obj);
        $(e).css("position") == "static" && $(e).css("position", "relative")
        $(e).children(option.itemEle).css({ "width": $(e).width() / option.colCount - option.spacingWidth * 2, "position": "absolute" });
        $.each($(e).children(option.itemEle), function (index, item) {
            heightList.push(Math.round(Math.random() * (option.maxHieght - option.minHieght) + Number(option.minHieght)));
            topList.length <= option.colCount - 1 ? topList.push(0) : topList.push(topList[index - option.colCount] + heightList[index - option.colCount] + Number(option.spacingHieght));
            $(item).css({ "top": topList[index], "height": heightList[index], "left": option.spacingWidth + (option.colCount * option.spacingWidth * 2 + $(e).width() / option.colCount - option.colCount * option.spacingWidth * 2) * (index % option.colCount) })
        })
    };
    // 图片懒加载
    ryh.prototype.lazyload = function (e, obj) {
        // obj(object)支持参数:
        var option = {
            event: "",  //触发事件,不传为滚动加载,click时点击图片加载
            top: "",  //距离顶部多久时加载图片,滚动加载时生效,可以为负数(单位px)
            time: 0,  //触发事件后延迟多久加载图片(单位ms)
            lazyImg: "https://github.com/copyWith/photoGallery/blob/master/no-img.jpg?raw=true"  //图片未加载时显示的图片地址
        }, _this;
        $.extend(option, obj);
        $(e).attr("src", option.lazyImg);
        option.event == "click" ?
            $(e).on("click", function () { _this = $(this), setTimeout(function () { _this.attr("src", _this.data("lazy")) }, option.time); }) :
            $(that).on("scroll", function () {
                $(e).each(function () {
                    (function (_this) {
                        $(that).scrollTop() + $(that).height() >= (option.top ? _this.offset().top - option.top : _this.offset().top) &&
                            setTimeout(function () { _this.attr("src", _this.data("lazy")) }, option.time)
                    })($(this));
                })
            })
    };
    that.ryh = new ryh();
    typeof isModule && (ryh = ryh.prototype);
    return ryh;
});
