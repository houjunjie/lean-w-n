const { reply } = require('../../wechat/reply')
const config = require('../../config/config')
const api = require('../api/index')
const wechatMiddle = require('../../wechat-lib/middleware')


// 接入微信消息中间件
exports.hear = async (ctx, next) => {
  const middle = wechatMiddle(config.wechat, reply)

  await middle(ctx, next)
}


exports.oauth = async (ctx, next) => {
  const state = ctx.query.id
  const scope = 'snsapi_userinfo'
  const target = config.baseUrl + 'userinfo'
  const url = api.wechat.getAuthorizeURL(scope, target, state)

  ctx.redirect(url)
}

exports.userinfo = async (ctx, next) => {
  const userData = await api.wechat.getUserinfoByCode(ctx.query.code)

  ctx.body = userData
}