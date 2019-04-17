const koa = require('koa');

const wechat = require('./wechat-lib/middleware')

const config = require('./config/config')
const reply = require('./wechat/reply')

const { initSchemas, connect } = require('./app/database/init')


;(async () => {
	
	await connect(config.db);
	
	initSchemas();
	// const { test } = require('./wechat/index')

	// 测试token 存储
	// await test();
	// 生成服务器实例
	const app = new koa();
	
	// 加载认证中间件
	// ctx 是 koa 的应用上下文
	// next 就是串联中间件的钩子函数
	
	app.use(wechat(config.wechat, reply.reply))
	
	app.listen(config.port);
	console.log('Listen:', + 3009)

})()