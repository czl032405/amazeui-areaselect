
var Mock = require('mockjs')
module.exports = function (req, res, next) {
  var areaId = req.query.areaId || 0;
  var level = parseInt(areaId.toString()[0])+1;
  if (level > 4) {
    res.send([])
  }
  else {
    var data = Mock.mock({
      // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
      'list|1-10': [{
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'areaName': '@cword(1,8)',
        'areaValue': level+'' + '@natural(1,20)',
      }]
    })
    setTimeout(function() {
        
    res.send(data.list)
    }, 400);
  }


};