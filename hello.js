const koa = require('koa');
const request = require('request');
var WXBizDataCrypt = require('./WXBizDataCrypt')
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
module.exports = async ctx => {
  var data = ctx.request.query
  var code = data['code']
  var entry = data['encrytedData']
  var iv = data['iv']
  var appid = 'wx5347569c42fa5372';
  var secret = '76dbf6792fee3abf29095c5c4147d701'
  var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code';
  var data2 = await requestAsync(url)
  var pc = new WXBizDataCrypt(appid, data2)
  var data3 = pc.decryptData(entry, iv)
  ctx.state.data = { step: data3['stepInfoList'][30]['step']}
}