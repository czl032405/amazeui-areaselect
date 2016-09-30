# Amaze UI AreaSelect
---


Amaze UI AreaSelect 插件。
- [使用示例](http://worldtree.cc/docs/demo.html)

**特性**

- [x] 多级联动
- [x] 事件监听
- [x] 自定义数据源
- [x] 支持promise数据源
- [x] 支持同步异步

**使用说明：**

1. 在 Amaze UI 之后引入 AreaSelect 样式（`dist` 目录下的 CSS）：

  Amaze UI AreaSelect 依赖 Amaze UI 样式。

 ```html
  <link rel="stylesheet" href="path/to/amazeui.min.css"/>
  <link rel="stylesheet" href="path/to/amazeui.areaselect.css"/>
 ```

2. 在 jQuery 之后和Amaze UI 引入 AreaSelect 插件（`dist` 目录下的 JS）：

 ```html
  <script src="path/to/jquery.min.js"></script>
  <script src="path/to/amazeui.areaselect.js"></script>
 ```

3. 初始化 AreaSelect:

 ```javascript
  $(function() {
      $('input').areaselect(options);
  });
 ```
  
**启动demo**
```
npm install fis3 -g
npm install
npm run dev
```

**配置**
```javascript
    var defaultOption = {
        dataUrl: function (selectedAreaObj) {//异步数据源 返回结果可以是String或者Promise
            return "url";
            return $.ajax().then();
        },
        dataUrl:"ajaxurl?xxx=${areaValue}",
        dataUrl: null,//可以为空
        data: _defaultAreaData,//如果dataUrl空,则直接使用此字段作为数据源
        areaNameKey: "areaName",//数据源地区名称key
        areaValueKey: "areaValue",//数据源地区值key
        subAreaKey: "subArea",//数据源子地区列表key
        inputValueName: function (inputName) {//根据函数返回结果的[name]查找用于配置areaValue的元素
            return `${inputName}Value`;
        },
        allSelectedCallback: function (selectedAreaObjArr) { },//选择结束回调,也可以on('allselected.areaselect.amui')
        selectedCallback: function (selectedAreaObj) { },//每级选择回调,也可以on('selected.areaselect.amui')
    };
```


**Demos**
- 默认及实例
```javascript
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
```

- 事件监听
```javascript
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
```

-  自定义数据源
```javascript
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

```

-  自定义异步数据源
```javascript
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
```

- 自定义异步数据源Promise
```javascript
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
```

- 自定义input[type=hidden][name]
```javascript
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

```
