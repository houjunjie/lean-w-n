const { resolve } = require('path')

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
    }else if (content === '5') {
			let data = await client.handle('uploadMaterial', 'video', resolve(__dirname, '../6.mp4'))

			reply = {
				type: 'video',
				title: '回复的视频标题',
				description: '打个篮球玩玩',
				mediaId: data.media_id
			}
		}else if(content ==='6') {
			let data = await client.handle('uploadMaterial', 'video', resolve(__dirname, '../6.mp4'), {
        type: 'video',
        description: '{"title": "这个地方很棒", "introduction": "好吃不如饺子"}'
      })
			console.log(data, '22111')
      reply = {
        type: 'video',
        title: '回复的视频标题 2',
        description: '打个篮球玩玩',
        mediaId: data.media_id
      }
		} else if (content === '7') {
      let data = await client.handle('uploadMaterial', 'image', resolve(__dirname, '../2.jpg'), {
        type: 'image'
      })

      reply = {
        type: 'image',
        mediaId: data.media_id
      }
    }else if (content === '8') {
      let data = await client.handle('uploadMaterial', 'image', resolve(__dirname, '../2.jpg'), {
        type: 'image'
      })
      let data2 = await client.handle('uploadMaterial', 'pic', resolve(__dirname, '../2.jpg'), {
        type: 'image'
      })
      console.log(data2)

      let media = {
        articles: [
          {
            title: '这是服务端上传的图文 1',
            thumb_media_id: data.media_id,
            author: 'Scott',
            digest: '没有摘要',
            show_cover_pic: 1,
            content: '点击去往慕课网',
            content_source_url: 'http://coding.imooc.com/'
          }, {
            title: '这是服务端上传的图文 2',
            thumb_media_id: data.media_id,
            author: 'Scott',
            digest: '没有摘要',
            show_cover_pic: 1,
            content: '点击去往 github',
            content_source_url: 'http://github.com/'
          }
        ]
      }

      let uploadData = await client.handle('uploadMaterial', 'news', media, {})

      let newMedia = {
        media_id: uploadData.media_id,
        index: 0,
        articles: {
          title: '这是服务端上传的图文 1',
          thumb_media_id: data.media_id,
          author: 'Scott',
          digest: '没有摘要',
          show_cover_pic: 1,
          content: '点击去往慕课网',
          content_source_url: 'http://coding.imooc.com/'
        }
      }

      console.log(uploadData)

      let mediaData = await client.handle('updateMaterial', uploadData.media_id, newMedia)

      console.log(mediaData)

      let newsData = await client.handle('fetchMaterial', uploadData.media_id, 'news', true)
      let items = newsData.news_item
      let news = []

      items.forEach(item => {
        news.push({
          title: item.title,
          description: item.description,
          picUrl: data2.url,
          url: item.url
        })
      })

      reply = news
    } 


		ctx.body = reply;
	}
	await next();
}