$(document).ready(function () {
    console.log("document ready");


    //默认及实例
    (function demo1() {
        var $area1Input = $("input[name=area1]").areaselect()
        var area1SelectInstance = $area1Input.data('amui.areaselect');
        $(document).on("keyup", function (e) {
            if (e.key == '`') {
                area1SelectInstance.open();
            }
            if (e.key == 'Escape') {
                area1SelectInstance.close();
            }
            if (e.key == 'Backspace') {
                area1SelectInstance.back();
            }
            if (e.key == 'Delete') {
                area1SelectInstance.destory();
            }
            if (e.key == 's') {
                console.info("demo1 selectedArea:")
                console.log(area1SelectInstance.selectedArea);
            }
        })
    })();

    //事件监听
    (function demo2() {
        var $area2Input = $("input[name=area2]").areaselect({
            allSelectedCallback: function (selectedAreaObjArr) {
                console.info("demo2 options allSelectedCallback fired");
                console.log(arguments)
            },
            selectedCallback: function (selectedAreaObj) {
                console.info("demo2 options selectedCallback fired");
                console.log(arguments)
            }
        });

        $area2Input.on("open.areaselect.amui", function (e) {
            console.info("demo2 open.areaselect.amui fired");
            console.log(arguments)
        })
        $area2Input.on("close.areaselect.amui", function (e) {
            console.info("demo2 close.areaselect.amui fired");
            console.log(arguments)
        })
        $area2Input.on("back.areaselect.amui", function (e) {
            console.info("demo2 back.areaselect.amui fired");
            console.log(arguments)
        })
        $area2Input.on("selected.areaselect.amui", function (e, selectedAreaObj) {
            console.info("demo2 selected.areaselect.amui fired");
            console.log(arguments)
        })
        $area2Input.on("allselected.areaselect.amui", function (e, selectedAreaObjArr) {
            console.info("demo2 allselected.areaselect.amui fired");
            console.log(arguments)
        })
    })();


    //自定义数据源
    (function demo3() {
        var $area3Input = $("input[name=area3]").areaselect({
            data: [
                { careaName: 'A', csub: [{ careaName: 'A1', careaValue: 'A1V' }, { careaName: 'A2', careaValue: 'A2V' },] },
                { careaName: 'B', csub: [{ careaName: 'B1', careaValue: 'B1V' }, { careaName: 'B2', careaValue: 'B2V' },] },
                { careaName: 'C', csub: [{ careaName: 'C1', careaValue: 'C1V' }, { careaName: 'C2', careaValue: 'C2V', csub: [{ careaName: 'C21', careaValue: 'C21V' }] },] },
            ],
            areaNameKey: 'careaName',
            areaValueKey: 'careaValue',
            subAreaKey: 'csub'
        });
    })();


    //自定义异步数据源
    (function demo4() {
        var $area4Input = $("input[name=area4]").areaselect({
            dataUrl: function (selectedAreaObj) {
                //data from mock.js , please "npm install && npm run dev"
                if (selectedAreaObj) {
                    return "/mock/area?areaId=" + selectedAreaObj.areaValue;
                }
                else {
                    return "/mock/area";
                }

            }

        });
    })();


    //自定义异步数据源Promise
    (function demo5() {
        var $area5Input = $("input[name=area5]").areaselect({
            dataUrl: function (selectedAreaObj) {
                //data from mock.js , please "npm install && npm run dev"
                var url = "/mock/area";
                return $.ajax(url, {
                    data: selectedAreaObj ? { areaId: selectedAreaObj.areaValue } : ""
                }).then(function (resData) {
                    //handle resData
                    console.info(resData)
                    return resData;
                })


            }

        });
    })();



    //自定义input[type=hidden][name]
    (function demo6() {
        //hidden会根据name来查找,如果出现多个则会在对应input的同级元素查找
        var $area6Input = $("input[name=area6]").areaselect({
            inputValueName: function (inputName) {
                console.log(inputName);
                return "customValue";
            },
            //inputValueName:"customValue",//也可以是String
        });
    })();







});