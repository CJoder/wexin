var http = require('http');
const koa = require('koa');
var request = require('request');
function requestAsync(url) {
    return new Promise((resolve, reject) => {
        request({
                    url: url
                }, (err, res, body) => {
        if (err) {
            reject(err);
        } else {
            resolve(JSON.parse(body).session_key);
        }
    })
});
}
http.createServer(function (request, response) {
    var code = request.data['code']              //不太会怎么接受客户端发送的data，大概是用GET发送一个data{‘code’:aaa,'encrytedData':bbb}这样的数据请求
    var entry = request.data['encrytedData']
    var iv = request.data['iv']
    var appid = 'wx5347569c42fa5372';
    var secret = '76dbf6792fee3abf29095c5c4147d701'
    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code';
    var data2 = await requestAsync(url)        //还有这个异步发送请求的问题，不知道ansyc放哪
    var pc = new WXBizDataCrypt(appid, data2)
    var data3 = pc.decryptData(entry, iv)
	response.end(data3['stepInfoList'][30]['step']);
}).listen(8888)