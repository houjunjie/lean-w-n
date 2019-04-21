const koa = require('koa');

const wechat = require('./wechat-lib/middleware')

const config = require('./config/config')
const reply = require('./wechat/reply')
const Router = require('koa-router')

const { initSchemas, connect } = require('./app/database/init')


;(async () => {
	
	await connect(config.db);
	
	initSchemas();
	// const { test } = require('./wechat/index')

	// 测试token 存储
	// await test();
	// 生成服务器实例
	const app = new koa();
	const router = new Router();
	
	
	require('./config/routes')(router)
	app.use(router.routes()).use(router.allowedMethods())
	
	
	app.listen(config.port);
	console.log('Listen:', + 3009)

})()