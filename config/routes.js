const Wechat = require('../app/controllers/wechat')

module.exports = router => {
	// 进入微信消息中间件
  router.get('/wx-hear', Wechat.hear)
  router.post('/wx-hear', Wechat.hear)

  // 跳到授权中间服务页面
  router.get('/wx-oauth', Wechat.oauth)
  // 通过 code 获取用户信息
  router.get('/userinfo', Wechat.userinfo)
}