import {
	resuest_config
} from '@/common/api/index.js';
export default function uploadFile(file, fdata) {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: resuest_config.baseURL + '/wx/imgupload',
			filePath: file,
			header: {
				token: uni.getStorageSync('userinfo').token
			},
			name: 'img',
			formData: fdata,
			success: uploadFileRes => {
				const data = JSON.parse(uploadFileRes.data);
				resolve(data);
			},
			fail: err => {
				reject(err);
			}
		});
	})
}
