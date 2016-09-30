/*
 * Amaze UI AreaSelect
 * 
 * author:czl
 * email:471060995@qq.com
 * last-edit:20160921
 * 
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var AreaSelect = (function () {
        function AreaSelect(element, options) {
            _classCallCheck(this, AreaSelect);

            var defaultOption = {
                // dataUrl: function (selectedAreaObj) {//异步数据源 返回结果可以是String或者Promise
                //     return "url";
                //     return $.ajax().then();
                // },
                //dataUrl:"ajaxurl?xxx=${areaValue}",
                dataUrl: null, //可以为空
                data: _defaultAreaData, //如果dataUrl空,则直接使用此字段作为数据源
                areaNameKey: "areaName", //数据源地区名称key
                areaValueKey: "areaValue", //数据源地区值key
                subAreaKey: "subArea", //数据源子地区列表key
                inputValueName: function inputValueName(inputName) {
                    //根据函数返回结果的[name]查找用于配置areaValue的元素
                    return inputName + "Value";
                },
                allSelectedCallback: function allSelectedCallback(selectedAreaObjArr) {}, //选择结束回调,也可以on('allselected.areaselect.amui')
                selectedCallback: function selectedCallback(selectedAreaObj) {} };
            //每级选择回调,也可以on('selected.areaselect.amui')
            var options = $.extend({}, defaultOption, options);

            //变量
            this.options = options;
            this.$element = $(element);
            this.selectedArea = [];

            //init
            this.init();
        }

        _createClass(AreaSelect, [{
            key: "init",
            value: function init() {
                var html = "\n            <div class=\"am-areaselect-popup  am-hide\">\n                <div class=\"am-areaselect-shadow\">\n                     <i class=\" am-icon-md am-icon-spinner am-icon-pulse\"></i>\n                </div>\n                <div class=\"am-areaselect-container  am-hide\">\n                    <div class=\"am-topbar am-topbar-inverse\">\n                        <i class=\"am-areaselect-back am-topbar-brand am-fl am-icon am-icon-md am-icon-angle-left\"></i>\n                        <i class=\"am-areaselect-close am-topbar-brand am-fr am-icon am-icon-sm am-icon-close\"></i>\n                    </div>\n                    <div class=\"am-areaselect-lists\">\n                        <div class=\"am-areaselect-list am-hide am-tmpl am-container am-btn-group \">\n                            <button class=\"am-areaselect-item am-hide am-tmpl am-btn am-btn-default\">item</button>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            ";
                this.$element.after(this.$popup = $(html));
                this.$element.attr("readonly", true);
                this.registerActions();
            }
        }, {
            key: "registerActions",
            value: function registerActions() {
                var plugin = this;

                this.$element.on("click", function (e) {
                    e.preventDefault();
                    plugin.open();
                    // setTimeout(function () {
                    //     if ($(".am-areaselect-container", plugin.$popup).hasClass("am-hide")) {
                    //         $(".am-areaselect-shadow", plugin.$popup).on("click", function () {
                    //             plugin.close();
                    //             $(".am-areaselect-shadow", plugin.$popup).unbind("click");
                    //         })
                    //     }
                    // }, 5000);
                });

                $(".am-areaselect-back", this.$popup).on("click", function () {
                    plugin.back();
                });

                $(".am-areaselect-close", this.$popup).on("click", function () {
                    plugin.close();
                });
            }
        }, {
            key: "select",
            value: function select(areaObj) {
                var plugin = this;
                var options = this.options;
                areaObj && plugin.selectedArea.push(areaObj);

                //数据准备好后的select行为
                var selectHandle = function selectHandle(subArea) {
                    if (plugin.$popup.hasClass("am-hide")) {
                        return;
                    }
                    var $shadow = $(".am-areaselect-shadow", plugin.$popup).removeClass("ztop");
                    //var $loading = $(".am-areaselect-loading", plugin.$popup).addClass("am-hide");
                    var $container = $(".am-areaselect-container", plugin.$popup).removeClass("am-hide");
                    if (subArea && subArea.length) {
                        plugin.buildList(subArea);
                    } else {
                        plugin.close();
                        plugin.setData();
                        plugin.$element.trigger('allselected.areaselect.amui', [plugin.selectedArea]);
                        options.allSelectedCallback && options.allSelectedCallback(plugin.selectedArea);
                    }
                };

                if (this.options.dataUrl) {
                    var dataUrl = null;
                    if (typeof this.options.dataUrl == 'function') {
                        dataUrl = this.options.dataUrl(areaObj);
                    } else if (typeof this.options.dataUrl == 'string') {
                        dataUrl = this.options.dataUrl.replace("${areaValue}", areaObj[options.areaValueKey]);
                    }

                    if (dataUrl) {
                        var $shadow = $(".am-areaselect-shadow", this.$popup).addClass("ztop");
                        if (typeof dataUrl == 'string') {
                            $.ajax(dataUrl).then(function (subArea) {
                                console.info(subArea);
                                selectHandle(subArea);
                            });
                        } else if (typeof dataUrl == 'object' && dataUrl.then) {
                            dataUrl.then(function (subArea) {
                                selectHandle(subArea);
                            });
                        }
                    }
                } else {
                    var subArea = areaObj ? areaObj[options.subAreaKey] : this.options.data;
                    selectHandle(subArea);
                }

                areaObj && this.$element.trigger('selected.areaselect.amui', areaObj);
                areaObj && options.selectedCallback && options.selectedCallback(areaObj);
            }
        }, {
            key: "buildList",
            value: function buildList(subArea) {
                var plugin = this;
                var options = this.options;
                var $list = null;
                //查找已经存在的list
                $(".am-areaselect-list", this.$popup).not("am-tmpl").each(function (idx, ele) {
                    if ($(ele).data('subArea') == subArea) {
                        $list = $(ele);
                    }
                });
                //构建list
                if (!$list) {
                    $list = $(".am-areaselect-list.am-tmpl", this.$popup).clone().removeClass("am-tmpl am-hide").data('subArea', subArea);
                    $list.appendTo($(".am-areaselect-lists", this.$popup));
                    for (var i in subArea) {
                        var $item = $(".am-areaselect-item.am-tmpl", $list).clone().removeClass("am-tmpl am-hide").text(subArea[i][options.areaNameKey]).data('value', subArea[i][options.areaValueKey]);
                        $item.appendTo($list);
                        (function (_i) {
                            $item.on("click", function (e) {
                                e.preventDefault();
                                if ($(this).hasClass("am-btn-primary") || $(this).siblings().hasClass("am-btn-primary")) {
                                    plugin.selectedArea.pop();
                                }
                                $(this).addClass("am-btn-primary").siblings().removeClass("am-btn-primary");
                                plugin.select(subArea[_i]);
                            });
                        })(i);
                    }
                }
                $list.siblings(".am-areaselect-list").addClass("am-hide");
            }
        }, {
            key: "setData",
            value: function setData() {
                var options = this.options;
                var selectedAreaNameArr = [];
                var selectedAreaValueArr = [];
                for (var i in this.selectedArea) {
                    selectedAreaNameArr.push(this.selectedArea[i][options.areaNameKey]);
                    selectedAreaValueArr.push(this.selectedArea[i][options.areaValueKey]);
                }

                //text input
                if (/input/i.test(this.$element[0].tagName)) {
                    this.$element.val(selectedAreaNameArr.join(' '));
                } else {
                    this.$element.text(selectedAreaNameArr.join(' '));
                }

                //hidden input
                var hiddenQuery = "[name=" + (typeof options.inputValueName == 'function' ? options.inputValueName(this.$element.attr("name")) : options.inputValueName) + "]";
                var $hidden = $(hiddenQuery);
                if ($hidden.length > 1) {
                    $hidden = this.$element.siblings(hiddenQuery);
                }
                if ($hidden.length) {
                    if (/input/i.test($hidden[0].tagName)) {
                        $hidden.val(selectedAreaValueArr);
                    } else {
                        $hidden.text(selectedAreaValueArr.join(' '));
                    }
                }
            }
        }, {
            key: "back",
            value: function back() {
                var $lists = $(".am-areaselect-list", this.$popup).not(".am-tmpl");
                this.selectedArea.pop();
                if ($lists.length > 1) {
                    $(".am-areaselect-list", this.$popup).not(".am-hide").remove();
                    $(".am-areaselect-list", this.$popup).not(".am-tmpl").last().removeClass("am-hide");
                    this.$element.trigger('back.areaselect.amui');
                } else {
                    this.close();
                }
            }
        }, {
            key: "open",
            value: function open() {

                this.$popup.removeClass("am-hide");
                if (!this.selectedArea.length) {
                    this.select();
                }
                this.$element.trigger('open.areaselect.amui');
            }
        }, {
            key: "close",
            value: function close() {
                this.$popup.addClass("am-hide");
                this.$element.trigger('close.areaselect.amui');
            }
        }, {
            key: "destory",
            value: function destory() {}
        }, {
            key: "test",
            value: function test() {
                console.info(233);
            }
        }]);

        return AreaSelect;
    })();

    var old = $.fn.areaselect;
    $.fn.extend({
        areaselect: function areaselect(option) {
            var args = Array.prototype.slice.call(arguments, 1);
            var returns;
            var $set = this.each(function () {
                var $this = $(this);
                var options = typeof option === 'object' && option;
                var areaSelect = $this.data('amui.areaselect');
                if (!areaSelect) {
                    areaSelect = new AreaSelect(this, options);
                    $this.data('amui.areaselect', areaSelect);
                }

                //调用方法
                if (typeof option === 'string') {
                    if (typeof areaSelect[option] === 'function') {
                        returns = areaSelect[option].apply(areaSelect, args);
                    } else {
                        returns = areaSelect[option];
                    }
                }
            });
            return returns === undefined ? $set : returns;
        }
    });

    var _defaultAreaData = JSON.parse('[{"areaName":"北京","areaValue":"110000","subArea":[{"areaName":"北京市","areaValue":"110000"}]},{"areaName":"天津","areaValue":"120000","subArea":[{"areaName":"天津市","areaValue":"120000"}]},{"areaName":"河北省","areaValue":"130000","subArea":[{"areaName":"石家庄市","areaValue":"130100"},{"areaName":"唐山市","areaValue":"130200"},{"areaName":"秦皇岛市","areaValue":"130300"},{"areaName":"邯郸市","areaValue":"130400"},{"areaName":"邢台市","areaValue":"130500"},{"areaName":"保定市","areaValue":"130600"},{"areaName":"张家口市","areaValue":"130700"},{"areaName":"承德市","areaValue":"130800"},{"areaName":"沧州市","areaValue":"130900"},{"areaName":"廊坊市","areaValue":"131000"},{"areaName":"衡水市","areaValue":"131100"}]},{"areaName":"山西省","areaValue":"140000","subArea":[{"areaName":"太原市","areaValue":"140100"},{"areaName":"大同市","areaValue":"140200"},{"areaName":"阳泉市","areaValue":"140300"},{"areaName":"长治市","areaValue":"140400"},{"areaName":"晋城市","areaValue":"140500"},{"areaName":"朔州市","areaValue":"140600"},{"areaName":"晋中市","areaValue":"140700"},{"areaName":"运城市","areaValue":"140800"},{"areaName":"忻州市","areaValue":"140900"},{"areaName":"临汾市","areaValue":"141000"},{"areaName":"吕梁市","areaValue":"141100"}]},{"areaName":"内蒙古自治区","areaValue":"150000","subArea":[{"areaName":"呼和浩特市","areaValue":"150100"},{"areaName":"包头市","areaValue":"150200"},{"areaName":"乌海市","areaValue":"150300"},{"areaName":"赤峰市","areaValue":"150400"},{"areaName":"通辽市","areaValue":"150500"},{"areaName":"鄂尔多斯市","areaValue":"150600"},{"areaName":"呼伦贝尔市","areaValue":"150700"},{"areaName":"巴彦淖尔市","areaValue":"150800"},{"areaName":"乌兰察布市","areaValue":"150900"},{"areaName":"兴安盟","areaValue":"152200"},{"areaName":"锡林郭勒盟","areaValue":"152500"},{"areaName":"阿拉善盟","areaValue":"152900"}]},{"areaName":"辽宁省","areaValue":"210000","subArea":[{"areaName":"沈阳市","areaValue":"210100"},{"areaName":"大连市","areaValue":"210200"},{"areaName":"鞍山市","areaValue":"210300"},{"areaName":"抚顺市","areaValue":"210400"},{"areaName":"本溪市","areaValue":"210500"},{"areaName":"丹东市","areaValue":"210600"},{"areaName":"锦州市","areaValue":"210700"},{"areaName":"营口市","areaValue":"210800"},{"areaName":"阜新市","areaValue":"210900"},{"areaName":"辽阳市","areaValue":"211000"},{"areaName":"盘锦市","areaValue":"211100"},{"areaName":"铁岭市","areaValue":"211200"},{"areaName":"朝阳市","areaValue":"211300"},{"areaName":"葫芦岛市","areaValue":"211400"}]},{"areaName":"吉林省","areaValue":"220000","subArea":[{"areaName":"长春市","areaValue":"220100"},{"areaName":"吉林市","areaValue":"220200"},{"areaName":"四平市","areaValue":"220300"},{"areaName":"辽源市","areaValue":"220400"},{"areaName":"通化市","areaValue":"220500"},{"areaName":"白山市","areaValue":"220600"},{"areaName":"松原市","areaValue":"220700"},{"areaName":"白城市","areaValue":"220800"},{"areaName":"延边朝鲜族自治州","areaValue":"222400"}]},{"areaName":"黑龙江省","areaValue":"230000","subArea":[{"areaName":"哈尔滨市","areaValue":"230100"},{"areaName":"齐齐哈尔市","areaValue":"230200"},{"areaName":"鸡西市","areaValue":"230300"},{"areaName":"鹤岗市","areaValue":"230400"},{"areaName":"双鸭山市","areaValue":"230500"},{"areaName":"大庆市","areaValue":"230600"},{"areaName":"伊春市","areaValue":"230700"},{"areaName":"佳木斯市","areaValue":"230800"},{"areaName":"七台河市","areaValue":"230900"},{"areaName":"牡丹江市","areaValue":"231000"},{"areaName":"黑河市","areaValue":"231100"},{"areaName":"绥化市","areaValue":"231200"},{"areaName":"大兴安岭地区","areaValue":"232700"}]},{"areaName":"上海","areaValue":"310000","subArea":[{"areaName":"上海市","areaValue":"310000"}]},{"areaName":"江苏省","areaValue":"320000","subArea":[{"areaName":"南京市","areaValue":"320100"},{"areaName":"无锡市","areaValue":"320200"},{"areaName":"徐州市","areaValue":"320300"},{"areaName":"常州市","areaValue":"320400"},{"areaName":"苏州市","areaValue":"320500"},{"areaName":"南通市","areaValue":"320600"},{"areaName":"连云港市","areaValue":"320700"},{"areaName":"淮安市","areaValue":"320800"},{"areaName":"盐城市","areaValue":"320900"},{"areaName":"扬州市","areaValue":"321000"},{"areaName":"镇江市","areaValue":"321100"},{"areaName":"泰州市","areaValue":"321200"},{"areaName":"宿迁市","areaValue":"321300"}]},{"areaName":"浙江省","areaValue":"330000","subArea":[{"areaName":"杭州市","areaValue":"330100"},{"areaName":"宁波市","areaValue":"330200"},{"areaName":"温州市","areaValue":"330300"},{"areaName":"嘉兴市","areaValue":"330400"},{"areaName":"湖州市","areaValue":"330500"},{"areaName":"绍兴市","areaValue":"330600"},{"areaName":"金华市","areaValue":"330700"},{"areaName":"衢州市","areaValue":"330800"},{"areaName":"舟山市","areaValue":"330900"},{"areaName":"台州市","areaValue":"331000"},{"areaName":"丽水市","areaValue":"331100"}]},{"areaName":"安徽省","areaValue":"340000","subArea":[{"areaName":"合肥市","areaValue":"340100"},{"areaName":"芜湖市","areaValue":"340200"},{"areaName":"蚌埠市","areaValue":"340300"},{"areaName":"淮南市","areaValue":"340400"},{"areaName":"马鞍山市","areaValue":"340500"},{"areaName":"淮北市","areaValue":"340600"},{"areaName":"铜陵市","areaValue":"340700"},{"areaName":"安庆市","areaValue":"340800"},{"areaName":"黄山市","areaValue":"341000"},{"areaName":"滁州市","areaValue":"341100"},{"areaName":"阜阳市","areaValue":"341200"},{"areaName":"宿州市","areaValue":"341300"},{"areaName":"六安市","areaValue":"341500"},{"areaName":"亳州市","areaValue":"341600"},{"areaName":"池州市","areaValue":"341700"},{"areaName":"宣城市","areaValue":"341800"}]},{"areaName":"福建省","areaValue":"350000","subArea":[{"areaName":"福州市","areaValue":"350100"},{"areaName":"厦门市","areaValue":"350200"},{"areaName":"莆田市","areaValue":"350300"},{"areaName":"三明市","areaValue":"350400"},{"areaName":"泉州市","areaValue":"350500"},{"areaName":"漳州市","areaValue":"350600"},{"areaName":"南平市","areaValue":"350700"},{"areaName":"龙岩市","areaValue":"350800"},{"areaName":"宁德市","areaValue":"350900"}]},{"areaName":"江西省","areaValue":"360000","subArea":[{"areaName":"南昌市","areaValue":"360100"},{"areaName":"景德镇市","areaValue":"360200"},{"areaName":"萍乡市","areaValue":"360300"},{"areaName":"九江市","areaValue":"360400"},{"areaName":"新余市","areaValue":"360500"},{"areaName":"鹰潭市","areaValue":"360600"},{"areaName":"赣州市","areaValue":"360700"},{"areaName":"吉安市","areaValue":"360800"},{"areaName":"宜春市","areaValue":"360900"},{"areaName":"抚州市","areaValue":"361000"},{"areaName":"上饶市","areaValue":"361100"}]},{"areaName":"山东省","areaValue":"370000","subArea":[{"areaName":"济南市","areaValue":"370100"},{"areaName":"青岛市","areaValue":"370200"},{"areaName":"淄博市","areaValue":"370300"},{"areaName":"枣庄市","areaValue":"370400"},{"areaName":"东营市","areaValue":"370500"},{"areaName":"烟台市","areaValue":"370600"},{"areaName":"潍坊市","areaValue":"370700"},{"areaName":"济宁市","areaValue":"370800"},{"areaName":"泰安市","areaValue":"370900"},{"areaName":"威海市","areaValue":"371000"},{"areaName":"日照市","areaValue":"371100"},{"areaName":"莱芜市","areaValue":"371200"},{"areaName":"临沂市","areaValue":"371300"},{"areaName":"德州市","areaValue":"371400"},{"areaName":"聊城市","areaValue":"371500"},{"areaName":"滨州市","areaValue":"371600"},{"areaName":"菏泽市","areaValue":"371700"}]},{"areaName":"河南省","areaValue":"410000","subArea":[{"areaName":"郑州市","areaValue":"410100"},{"areaName":"开封市","areaValue":"410200"},{"areaName":"洛阳市","areaValue":"410300"},{"areaName":"平顶山市","areaValue":"410400"},{"areaName":"安阳市","areaValue":"410500"},{"areaName":"鹤壁市","areaValue":"410600"},{"areaName":"新乡市","areaValue":"410700"},{"areaName":"焦作市","areaValue":"410800"},{"areaName":"濮阳市","areaValue":"410900"},{"areaName":"许昌市","areaValue":"411000"},{"areaName":"漯河市","areaValue":"411100"},{"areaName":"三门峡市","areaValue":"411200"},{"areaName":"南阳市","areaValue":"411300"},{"areaName":"商丘市","areaValue":"411400"},{"areaName":"信阳市","areaValue":"411500"},{"areaName":"周口市","areaValue":"411600"},{"areaName":"驻马店市","areaValue":"411700"},{"areaName":"济源市","areaValue":"411800"}]},{"areaName":"湖北省","areaValue":"420000","subArea":[{"areaName":"武汉市","areaValue":"420100"},{"areaName":"黄石市","areaValue":"420200"},{"areaName":"十堰市","areaValue":"420300"},{"areaName":"宜昌市","areaValue":"420500"},{"areaName":"襄阳市","areaValue":"420600"},{"areaName":"鄂州市","areaValue":"420700"},{"areaName":"荆门市","areaValue":"420800"},{"areaName":"孝感市","areaValue":"420900"},{"areaName":"荆州市","areaValue":"421000"},{"areaName":"黄冈市","areaValue":"421100"},{"areaName":"咸宁市","areaValue":"421200"},{"areaName":"随州市","areaValue":"421300"},{"areaName":"恩施土家族苗族自治州","areaValue":"422800"},{"areaName":"仙桃市","areaValue":"429004"},{"areaName":"潜江市","areaValue":"429005"},{"areaName":"天门市","areaValue":"429006"},{"areaName":"神农架林区","areaValue":"429021"}]},{"areaName":"湖南省","areaValue":"430000","subArea":[{"areaName":"长沙市","areaValue":"430100"},{"areaName":"株洲市","areaValue":"430200"},{"areaName":"湘潭市","areaValue":"430300"},{"areaName":"衡阳市","areaValue":"430400"},{"areaName":"邵阳市","areaValue":"430500"},{"areaName":"岳阳市","areaValue":"430600"},{"areaName":"常德市","areaValue":"430700"},{"areaName":"张家界市","areaValue":"430800"},{"areaName":"益阳市","areaValue":"430900"},{"areaName":"郴州市","areaValue":"431000"},{"areaName":"永州市","areaValue":"431100"},{"areaName":"怀化市","areaValue":"431200"},{"areaName":"娄底市","areaValue":"431300"},{"areaName":"湘西土家族苗族自治州","areaValue":"433100"}]},{"areaName":"广东省","areaValue":"440000","subArea":[{"areaName":"广州市","areaValue":"440100"},{"areaName":"韶关市","areaValue":"440200"},{"areaName":"深圳市","areaValue":"440300"},{"areaName":"珠海市","areaValue":"440400"},{"areaName":"汕头市","areaValue":"440500"},{"areaName":"佛山市","areaValue":"440600"},{"areaName":"江门市","areaValue":"440700"},{"areaName":"湛江市","areaValue":"440800"},{"areaName":"茂名市","areaValue":"440900"},{"areaName":"肇庆市","areaValue":"441200"},{"areaName":"惠州市","areaValue":"441300"},{"areaName":"梅州市","areaValue":"441400"},{"areaName":"汕尾市","areaValue":"441500"},{"areaName":"河源市","areaValue":"441600"},{"areaName":"阳江市","areaValue":"441700"},{"areaName":"清远市","areaValue":"441800"},{"areaName":"东莞市","areaValue":"441900"},{"areaName":"中山市","areaValue":"442000"},{"areaName":"潮州市","areaValue":"445100"},{"areaName":"揭阳市","areaValue":"445200"},{"areaName":"云浮市","areaValue":"445300"}]},{"areaName":"广西壮族自治区","areaValue":"450000","subArea":[{"areaName":"南宁市","areaValue":"450100"},{"areaName":"柳州市","areaValue":"450200"},{"areaName":"桂林市","areaValue":"450300"},{"areaName":"梧州市","areaValue":"450400"},{"areaName":"北海市","areaValue":"450500"},{"areaName":"防城港市","areaValue":"450600"},{"areaName":"钦州市","areaValue":"450700"},{"areaName":"贵港市","areaValue":"450800"},{"areaName":"玉林市","areaValue":"450900"},{"areaName":"百色市","areaValue":"451000"},{"areaName":"贺州市","areaValue":"451100"},{"areaName":"河池市","areaValue":"451200"},{"areaName":"来宾市","areaValue":"451300"},{"areaName":"崇左市","areaValue":"451400"}]},{"areaName":"海南省","areaValue":"460000","subArea":[{"areaName":"海口市","areaValue":"460100"},{"areaName":"三亚市","areaValue":"460200"},{"areaName":"三沙市","areaValue":"460300"},{"areaName":"五指山市","areaValue":"469001"},{"areaName":"琼海市","areaValue":"469002"},{"areaName":"儋州市","areaValue":"469003"},{"areaName":"文昌市","areaValue":"469005"},{"areaName":"万宁市","areaValue":"469006"},{"areaName":"东方市","areaValue":"469007"},{"areaName":"定安县","areaValue":"469021"},{"areaName":"屯昌县","areaValue":"469022"},{"areaName":"澄迈县","areaValue":"469023"},{"areaName":"临高县","areaValue":"469024"},{"areaName":"白沙黎族自治县","areaValue":"469025"},{"areaName":"昌江黎族自治县","areaValue":"469026"},{"areaName":"乐东黎族自治县","areaValue":"469027"},{"areaName":"陵水黎族自治县","areaValue":"469028"},{"areaName":"保亭黎族苗族自治县","areaValue":"469029"},{"areaName":"琼中黎族苗族自治县","areaValue":"469030"}]},{"areaName":"重庆","areaValue":"500000","subArea":[{"areaName":"重庆市","areaValue":"500001"}]},{"areaName":"四川省","areaValue":"510000","subArea":[{"areaName":"成都市","areaValue":"510100"},{"areaName":"自贡市","areaValue":"510300"},{"areaName":"攀枝花市","areaValue":"510400"},{"areaName":"泸州市","areaValue":"510500"},{"areaName":"德阳市","areaValue":"510600"},{"areaName":"绵阳市","areaValue":"510700"},{"areaName":"广元市","areaValue":"510800"},{"areaName":"遂宁市","areaValue":"510900"},{"areaName":"内江市","areaValue":"511000"},{"areaName":"乐山市","areaValue":"511100"},{"areaName":"南充市","areaValue":"511300"},{"areaName":"眉山市","areaValue":"511400"},{"areaName":"宜宾市","areaValue":"511500"},{"areaName":"广安市","areaValue":"511600"},{"areaName":"达州市","areaValue":"511700"},{"areaName":"雅安市","areaValue":"511800"},{"areaName":"巴中市","areaValue":"511900"},{"areaName":"资阳市","areaValue":"512000"},{"areaName":"阿坝藏族羌族自治州","areaValue":"513200"},{"areaName":"甘孜藏族自治州","areaValue":"513300"},{"areaName":"凉山彝族自治州","areaValue":"513400"}]},{"areaName":"贵州省","areaValue":"520000","subArea":[{"areaName":"贵阳市","areaValue":"520100"},{"areaName":"六盘水市","areaValue":"520200"},{"areaName":"遵义市","areaValue":"520300"},{"areaName":"安顺市","areaValue":"520400"},{"areaName":"铜仁市","areaValue":"522200"},{"areaName":"黔西南布依族苗族自治州","areaValue":"522300"},{"areaName":"毕节市","areaValue":"522400"},{"areaName":"黔东南苗族侗族自治州","areaValue":"522600"},{"areaName":"黔南布依族苗族自治州","areaValue":"522700"}]},{"areaName":"云南省","areaValue":"530000","subArea":[{"areaName":"昆明市","areaValue":"530100"},{"areaName":"曲靖市","areaValue":"530300"},{"areaName":"玉溪市","areaValue":"530400"},{"areaName":"保山市","areaValue":"530500"},{"areaName":"昭通市","areaValue":"530600"},{"areaName":"丽江市","areaValue":"530700"},{"areaName":"普洱市","areaValue":"530800"},{"areaName":"临沧市","areaValue":"530900"},{"areaName":"楚雄彝族自治州","areaValue":"532300"},{"areaName":"红河哈尼族彝族自治州","areaValue":"532500"},{"areaName":"文山壮族苗族自治州","areaValue":"532600"},{"areaName":"西双版纳傣族自治州","areaValue":"532800"},{"areaName":"大理白族自治州","areaValue":"532900"},{"areaName":"德宏傣族景颇族自治州","areaValue":"533100"},{"areaName":"怒江傈僳族自治州","areaValue":"533300"},{"areaName":"迪庆藏族自治州","areaValue":"533400"}]},{"areaName":"西藏自治区","areaValue":"540000","subArea":[{"areaName":"拉萨市","areaValue":"540100"},{"areaName":"昌都地区","areaValue":"542100"},{"areaName":"山南地区","areaValue":"542200"},{"areaName":"日喀则市","areaValue":"542300"},{"areaName":"那曲地区","areaValue":"542400"},{"areaName":"阿里地区","areaValue":"542500"},{"areaName":"林芝市","areaValue":"542600"}]},{"areaName":"陕西省","areaValue":"610000","subArea":[{"areaName":"西安市","areaValue":"610100"},{"areaName":"铜川市","areaValue":"610200"},{"areaName":"宝鸡市","areaValue":"610300"},{"areaName":"咸阳市","areaValue":"610400"},{"areaName":"渭南市","areaValue":"610500"},{"areaName":"延安市","areaValue":"610600"},{"areaName":"汉中市","areaValue":"610700"},{"areaName":"榆林市","areaValue":"610800"},{"areaName":"安康市","areaValue":"610900"},{"areaName":"商洛市","areaValue":"611000"}]},{"areaName":"甘肃省","areaValue":"620000","subArea":[{"areaName":"兰州市","areaValue":"620100"},{"areaName":"嘉峪关市","areaValue":"620200"},{"areaName":"金昌市","areaValue":"620300"},{"areaName":"白银市","areaValue":"620400"},{"areaName":"天水市","areaValue":"620500"},{"areaName":"武威市","areaValue":"620600"},{"areaName":"张掖市","areaValue":"620700"},{"areaName":"平凉市","areaValue":"620800"},{"areaName":"酒泉市","areaValue":"620900"},{"areaName":"庆阳市","areaValue":"621000"},{"areaName":"定西市","areaValue":"621100"},{"areaName":"陇南市","areaValue":"621200"},{"areaName":"临夏回族自治州","areaValue":"622900"},{"areaName":"甘南藏族自治州","areaValue":"623000"}]},{"areaName":"青海省","areaValue":"630000","subArea":[{"areaName":"西宁市","areaValue":"630100"},{"areaName":"海东市","areaValue":"632100"},{"areaName":"海北藏族自治州","areaValue":"632200"},{"areaName":"黄南藏族自治州","areaValue":"632300"},{"areaName":"海南藏族自治州","areaValue":"632500"},{"areaName":"果洛藏族自治州","areaValue":"632600"},{"areaName":"玉树藏族自治州","areaValue":"632700"},{"areaName":"海西蒙古族藏族自治州","areaValue":"632800"}]},{"areaName":"宁夏回族自治区","areaValue":"640000","subArea":[{"areaName":"银川市","areaValue":"640100"},{"areaName":"石嘴山市","areaValue":"640200"},{"areaName":"吴忠市","areaValue":"640300"},{"areaName":"固原市","areaValue":"640400"},{"areaName":"中卫市","areaValue":"640500"}]},{"areaName":"新疆维吾尔自治区","areaValue":"650000","subArea":[{"areaName":"乌鲁木齐市","areaValue":"650100"},{"areaName":"克拉玛依市","areaValue":"650200"},{"areaName":"吐鲁番地区","areaValue":"652100"},{"areaName":"哈密地区","areaValue":"652200"},{"areaName":"昌吉回族自治州","areaValue":"652300"},{"areaName":"博尔塔拉蒙古自治州","areaValue":"652700"},{"areaName":"巴音郭楞蒙古自治州","areaValue":"652800"},{"areaName":"阿克苏地区","areaValue":"652900"},{"areaName":"克孜勒苏柯尔克孜自治州","areaValue":"653000"},{"areaName":"喀什地区","areaValue":"653100"},{"areaName":"和田地区","areaValue":"653200"},{"areaName":"伊犁哈萨克自治州","areaValue":"654000"},{"areaName":"塔城地区","areaValue":"654200"},{"areaName":"阿勒泰地区","areaValue":"654300"},{"areaName":"自治区直辖","areaValue":"659000"}]},{"areaName":"台湾省","areaValue":"710000","subArea":[]},{"areaName":"香港特别行政区","areaValue":"810000","subArea":[]},{"areaName":"澳门特别行政区","areaValue":"820000","subArea":[]}]');
})();