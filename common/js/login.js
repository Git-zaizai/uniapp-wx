import {
	httpcode
} from '../api/api-list.js';
const promiselogin = (provider) => {
	return new Promise((res, rej) => {
		uni.login({
			provider: provider,
			success: async loginRes => {
				try {
					const respoeo = await httpcode({
						code: loginRes.code
					})
					res({
						respoeo,
						code: loginRes.code
					})
				} catch (e) {
					rej(e)
				}

			}
		});
	})

}

export default promiselogin;
