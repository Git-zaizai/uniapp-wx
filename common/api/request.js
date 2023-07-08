class httpObject {
	constructor(data = {}) {
		this.defaultData = {
				baseURL: data.baseURL,
				timeout: data.timeout,
				header: data.header || {},
				dataType: data.dataType || 'json',
				sslVerify: data.sslVerify || false
			},
			this.interceptorsFunction = {
				requestuse: null,
				resposeuse: []
			}
	}

	requestuse(f) {
		this.interceptorsFunction.requestuse = f;
	}

	resposeuse(...f) {
		this.interceptorsFunction.resposeuse = f;
	}

	requestObj(res, config, httpurl) {
		return {
			...res,
			requestConfig: {
				http: httpurl,
				url: config.url,
				resquestdata: config.data,
				resquestheader: config.header,
				resquestmethod: config.method,
			}
		}
	}

	/** 
	 * 检验请求是否是绝对路径
	 */
	checkUrl(url) {
		return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
	}

	request(config) {
		const thas = this;
		const defaultconfig = {
			...this.defaultData,
			...config
		};
		const request_config = this.interceptorsFunction.requestuse(defaultconfig);
		const url = this.checkUrl(config.url) ? config.url : this.defaultData.baseURL + config.url;
		const resposeuseList = this.interceptorsFunction.resposeuse;
		return new Promise((resolve, reject) => {
			uni.request({
				url,
				method: request_config.method,
				data: request_config.data,
				header: request_config.header,
				dataType: request_config.dataType,
				sslVerify: request_config.sslVerify,
				success: (res) => {
					if (res.statusCode === 200) {
						const req = thas.requestObj(res, request_config, url)
						const respose = resposeuseList[0](req);
						resolve(respose);
					}
				},
				fail: (err) => {
					const req = thas.requestObj(res, request_config, url)
					const errorFun = resposeuseList[1](req);
					reject(errorFun);
				},
				complete: (complete) => {
					if (complete.statusCode !== 200) {
						const req = thas.requestObj(complete, request_config, url)
						const errorFun = resposeuseList[1](req);
						reject(complete);
					}
				}
			})
		})
	}


	get(url = '', data = {}) {
		const config = {
			url,
			data,
			method: 'GET'
		}
		return this.request(config);
	}

	post(url = '', data = {}) {
		const config = {
			url,
			data,
			method: 'POST'
		}
		return this.request(config);
	}

	del(url = '', data = {}) {
		const config = {
			url,
			data,
			method: 'DELETE'
		}
		return this.request(config);
	}
}


export default httpObject;
