import {
	http
} from './index';
import {
	debounce,
	bibao
} from '../js/utils.js';

export const recommend = () => {
	return http.get('/json/reco-mmend.json');
}
export const getcommunity = () => http.get('/json/community.json');
export const getnotice = () => http.get('/json/Notice.json');
// node-server/
export const httpcode = (data = {}) => http.get('/wx/wxlogin/getopenid', data);
export const httplogin = (data = {}) => http.post('/wx/wxlogin/login', data)
export const httprefreshToken = () => http.get('/wx/wxlogin/wx_refreshToken');
export const httpreleaseEntrust = data => http.post('/wx/releaseEntrus', data);
export const httparticleText = data => http.post('/wx/community/add', data);
export const httpcommunityindex = data => http.get('/wx/community/index', data);
export const httpappreciatefillClick = data => http.get('/wx/likes/click', data);
export const httpattention = data => http.get('/wx/community/attention', data);
export const httpcommunonPull = data => http.get('/wx/community/onPull', data);
export const getarticleid = id => http.get('/wx/community/articleid', id);
export const getcomment = data => http.post('/wx/comment/sendadd', data);
export const divinereviewAdd = data => http.get('/wx/divinereview/add', data);
export const getectrustlimit = data => http.get('/wx/ectrust/limit', data);
export const getonPull = data => http.get('/wx/entrust/onpull', data);
export const entrustdetails = id => http.get('/wx/entrust/details', id);
export const entrustbrowse = id => http.get('/wx/entrust/browse', id);
export const acceptadd = id => http.get('/wx/entrust/acceptadd', id);
export const indexdata = () => http.get('/wx/indexdata');
export const userupdataemail = email => http.get('/wx/user/emailadd', email);
export const selectemail = () => http.get('/wx/user/selectemail');
export const opinionadd = data => http.post('/wx/user/opinionadd', data);
export const commview = () => http.get('/wx/user/commview');
export const usercommdel = id => http.get('/wx/user/commdel', id);
export const getuserentrust = () => http.get('/wx/user/userentrust');
export const updatetodel = data => http.get('/wx/user/updatetodel', data);
export const delentrust = id => http.get('/wx/user/delentrust', id)


/*
 为什么要在这里呢？  因为debounce返回的是一个函数，所以要先得到函数
 在getReachBottom中调用 才能使同一个闭包
 
 如果你要这样写
 
 export const getReachBottom = (page) => {
 	const debe = debounce(async (page) => {
 		const respose = await http.post('/page', {
 			page
 		});
 		return respose;
 	}, 1000, true)
	const respose = debe();
 	return respose;
 }
 
 这样会照成闭包不是同一个，每次调用getReachBottom函数，都会
 形成一个新的闭包，这样当然不能清除定时器，每一个闭包、定时器都是新的指针
 所以要先得到返回的函数，保证是一个闭包，在往后调用

let awhttp, respose;
const debe = debounce(async (page) => {
	awhttp = await http.post('/page', {
		page
	});
	respose = awhttp
}, 1000, true)
export const getReachBottom = async (page) => {
	await debe(page);
	console.log(respose)
	return respose;
}*/
