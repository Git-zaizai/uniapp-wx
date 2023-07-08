import request from './request.js';
export const resuest_config = {
	baseURL: 'http://localhost:4398',
	/**
	http://localhost:4398  
	http://112.74.55.122:4390
	https://www.cubcub.top:4390/json
	https://www.cubcub.top/node-server
	http://window.git.cubcub.top
	**/
	timeout: 10 * 1000,
}

const api = new request(resuest_config);

api.requestuse(config => {
	const uo = uni.getStorageSync('userinfo');
	config.header['token'] = uo === '' ? '' : uo.token;
	return config;
})

api.resposeuse(respose => {
	console.log('请求完成', respose)
	const res = respose.data;
	return res;
}, error => {
	/* if (error.message.includes('timeout')) {
		return '请求超时'; // reject这个错误信息
	} */
	console.log('请求错误拦截器', error)

	if (error.errMsg == 'request:fail timeout') {
		uni.showToast({
			title: '请求超时，请重试!',
			duration: 2000,
			icon: "none"
		});
	} else if (error.errMsg == 'request:fail ') {
		uni.showToast({
			title: '无网络请移动到有网络的地方重试!',
			duration: 2000,
			icon: "none"
		});
	} else {
		uni.showToast({
			title: '意外错误，请联系管理员',
			duration: 2000,
			icon: "none"
		});
	}
	return error;
})
export const http = api;
