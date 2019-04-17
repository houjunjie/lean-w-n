exports.reply = async (ctx, next) => {
	const message = ctx.weixin;

	let mp = require('./index');
	let client = mp.getWechat();

	if(message.MsgType === 'text') {
		let content = message.Content;
		
		let reply = '啊哈，你的说' + content + '太复杂了，我无法解析哟！';

		if(content === '1') {
			reply = '喜欢你啊';
		}else if(content === '2') {
			reply = '爱你啊';
		}else if(content === '3') {
			reply = 'love you';
		}else if (content === '4') {
      let data = await client.handle('uploadMaterial', 'image', resolve(__dirname, '../2.jpg'))

      reply = {
        type: 'image',
        mediaId: data.media_id
      }
    }
		ctx.body = reply;
	}
	await next();
}