const config = require('../config/config');
const Wechat = require('../wechat-lib')
const mongoose = require('mongoose');

const Token = mongoose.model('Token');

const wechatCfg = {
	wechat: {
		appID: config.wechat.appID,
		appSecret: config.wechat.appSecret,
		token: config.wechat.token,
		getAccessToken: async () => {
			const res = await Token.getAccessToken();

			return res;
		},
		saveAccessToken: async (data) => {
			const res = await Token.saveAccessToken(data);

			return res
		}
	}
}


// exports.test = async () => {
// 	const client = new Wechat(wechatCfg.wechat);
// 	const data = await client.fetchAccessToken();

// 	console.log('data')
// 	console.log(data);
// }

exports.getWechat = () => new Wechat(wechatCfg.wechat)
// ;(async function () {
// 	const client = new Wechat(wechatCfg.wechat);
// 	const data = await client.fetchAccessToken();

// 	console.log('data')
// 	console.log(data);
	
// })()