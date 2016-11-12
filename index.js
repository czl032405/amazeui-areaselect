var express = require('express');
var path = require('path');
var app = express();
app.set('port', (process.env.PORT || 80));

var clientPath = path.join(__dirname, "./");
var DOCUMENT_ROOT = path.resolve("./");

// server.conf 功能
// 支持 test/ 目录下面 .js js 脚本功能和 json 预览功能。
// 注意这里面的.js，不是一般的.js 文件，而是相当于 express 的 route.
app.use(require('yog-devtools')({
    view_path: '',    // 避免报错。
    rewrite_file: [path.join(DOCUMENT_ROOT, 'config', 'server.conf'), path.join(DOCUMENT_ROOT, 'mock', 'server.conf')],
    data_path: [path.join(DOCUMENT_ROOT, 'test'), path.join(DOCUMENT_ROOT, 'mock')]
}));

// 静态文件输出
app.use(express.static(clientPath));



app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
