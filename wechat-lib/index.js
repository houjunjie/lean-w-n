const fs = require('fs')
const request = require('request-promise')
const base = `https://api.weixin.qq.com/cgi-bin/`;

const api = {
	accessToken: 'token?grant_type=client_credential',
	temporary: {
    upload: base + 'media/upload?',
    fetch: base + 'media/get?'
  },
  permanent: {
    upload: base + 'material/add_material?',
    uploadNews: base + 'material/add_news?',
    uploadNewsPic: base + 'media/uploadimg?',
    fetch: base + 'material/get_material?',
    del: base + 'material/del_material?',
    update: base + 'material/update_news?',
    count: base + 'material/get_materialcount?',
    batch: base + 'material/batchget_material?'
  },
}

module.exports = class Wechat {
	constructor (opts) {
		this.opts = Object.assign({},opts);
		this.appID = opts.appID;
		this.appSecret = opts.appSecret;
		this.getAccessToken = opts.getAccessToken;
		this.saveAccessToken = opts.saveAccessToken;

		this.fetchAccessToken()
	}

	async request(options) {
		options = Object.assign({}, options, {json: true})

		try {
			const res = await request(options)
			return res;
		} catch (err) {
			console.log(err);
		}
	}

	// 首先检查数据库的token是否过期 过期则更新
	async fetchAccessToken() {
		let data = await this.getAccessToken();
		// if(this.getAccessToken) {
		// 	data = await this.getAccessToken()
		// }
		if(!this.isValid(data, 'access_token')) {
			data = await this.updateAccessToken()
		}

		await this.saveAccessToken(data);

		return data;
	}

	async updateAccessToken() {
		const url = base + api.accessToken + `&appid=${this.appID}&secret=${this.appSecret}`
		const data = await this.request({ url })
		const now = new Date().getTime();
		const expiresIn = now + (data.expires_in -20) * 1000;

		data.expires_in = expiresIn;
		return data;
	}

	async fetchTicket (token) {
    let data = await this.getTicket()

    if (!this.isValid(data, 'ticket')) {
      data = await this.updateTicket(token)
    }

    await this.saveTicket(data)

    return data
  }

  // 获取 token
  async updateTicket (token) {
    const url = `${api.ticket.get}access_token=${token}&type=jsapi`

    const data = await this.request({ url })
    const now = new Date().getTime()
    const expiresIn = now + (data.expires_in - 20) * 1000

    data.expires_in = expiresIn

    return data
  }

	isValid (data, name) {
    if (!data || !data.expires_in) {
      return false
    }

    const expiresIn = data.expires_in
    const now = new Date().getTime()

    if (now < expiresIn) {
      return true
    } else {
      return false
    }
	}

	// 上传
	uploadMaterial (token, type, material, permanent = false) {
		let form = {};
		let url = api.temporary.upload;

		// 永久素材form 是个obj， 继承外面传入的新对象
		if(permanent) {
			url = api.permanent.upload;
			form = Object.assign(form, permanent);
		}

		// 上传图文信息的图片素材
		if(type === 'pic'){
			url = api.permanent.uploadNewsPic
		}

		// 图文非突然的素材提交表单的切换
		if(type === 'news') {
			url = api.permanent.uploadNews;
			form = material
		}else {
			form.media = fs.createReadStream(material)
		}
		let uploadUrl = `${url}access_token=${token}`;

		// 根据素材永久性填充 token
		if(!permanent) {
			uploadUrl += `&type=${type}`;
		}else {
			if(type !== 'news') {
				form.access_token = token
			}
		}

		const options = {
			method: 'POST',
			url: uploadUrl,
			json: true
		}

		// 图文和非图文在request 提交主体判断
		if(type === 'news') {
			options.body = form;
		}else {
			options.formData = form
		}
		return options
	}
	
	// 封装用来请求接口的入口方法
	async handle(operation, ...args) {
		const tokenData = await this.fetchAccessToken();
		const options = this[operation](tokenData.access_token, ...args);
		const data = await this.request(options);

		return data;
	}

	// 获取素材本身
	fetchMaterial (token, mediaId, type, permanent) {
		let form = {};
		let fetchUrl = api.temporary.fetch

		if(permanent) {
			fetchUrl = api.permanent.fetch
		}
		let url = fetchUrl + 'access_token=' + token
		let options = { method: 'POST',url}

		if(permanent) {
			form.media_id = mediaId
			form.access_token = token;
			options.body = form;
		}else {
			if(type === 'video') {
				url = url.replace('https:', 'http');
			}
			url += '&media_id=' + mediaId
		}
		return options;
	}

	// 删除素材
	deleteMaterial (token, mediaId) {
		const form = {
			media_id: mediaId
		}
		const url = `${api.permanent.del}access_token=${token}&media_id=${mediaId}`
		return { method: 'POST', url, body: form }
	}

	// 更新素材
  updateMaterial (token, mediaId, news) {
    let form = {
      media_id: mediaId
    }
    form = Object.assign(form, news)

    const url = `${api.permanent.update}access_token=${token}&media_id=${mediaId}`

    return { method: 'POST', url, body: form }
	}
	
	// 获取素材总数
  countMaterial (token) {
    const url = `${api.permanent.count}access_token=${token}`

    return { method: 'POST', url }
	}

	// 获取素材列表
  batchMaterial (token, options) {
    options.type = options.type || 'image'
    options.offset = options.offset || 0
    options.count = options.count || 10

    const url = `${api.permanent.batch}access_token=${token}`

    return { method: 'POST', url, body: options }
  }
}