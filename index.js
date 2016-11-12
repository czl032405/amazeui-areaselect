var express = require('express');
var path = require('path');
var app = express();
app.set('port', (process.env.PORT || 80));

var clientPath = path.join(__dirname, "./");
var DOCUMENT_ROOT = path.join(__dirname, "./");



// 静态文件输出
app.use('/',express.static(clientPath));


app.use('/mock/area',require('./mock/area'))


app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
