const { getOAuth, getWechat } = require('../../wechat/index')


exports.getAuthorizeURL = (scope, target, state) => {
  const oauth = getOAuth()
  const url = oauth.getAuthorizeURL(scope, target, state)

  return url
}

exports.getUserinfoByCode = async (code) => {
  const oauth = getOAuth()
  const data = await oauth.fetchAccessToken(code)
  const userData = await oauth.getUserInfo(data.access_token, data.openid)

  return userData
}