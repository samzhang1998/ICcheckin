import Request from './request'
import {refreshToken} from '@/api/login';
import indexConfig from '@/config/index.config';
import mHelper from '@/utils/helper';
import store from '@/store';

const http = new Request();

// request全局参数设置
http.setConfig((config) => { /* 设置全局配置 */
	config.baseUrl = indexConfig.baseUrl; /* 根域名不同 */
	const systemInfo = uni.getSystemInfoSync();
	const systemInfoHeaders = {
		'device-name': systemInfo.brand, // 设备名称
		'width': systemInfo.screenWidth, // 屏幕宽度
		'height': systemInfo.screenHeight, // 屏幕高度
		'os': systemInfo.platform, // 客户端平台
		'os-version': systemInfo.system // 操作系统版本
	};
	config.header = {
		...config.header,
		...systemInfoHeaders
	};
	return config;
});

let isRefreshing = false;
let requests = [];
http.interceptor.request((config) => { /* 请求之前拦截器 */
	config.header['Authorization'] = "Bearer "+  uni.getStorageSync('token');
	// 单商户
	// config.header['merchant-id'] = uni.getStorageSync('merchantId') || 1;
	config.header['Content-Type'] ='application/json'
	return config;
}, error => {
	return Promise.reject(error)
})

// 刷新refreshToken
async function handleRefreshToken(refresh_token) {
	const params = {};
	/*  #ifdef APP-PLUS  */
	params.group = 'tinyShopApp';
	/*  #endif  */
	/*  #ifdef H5  */
	params.group = 'tinyShopH5';
	/*  #endif  */
	/*  #ifdef  MP-WEIXIN  */
	params.group = 'tinyShopWechatMq';
	/*  #endif  */
	/*  #ifdef  MP-QQ  */
	params.group = 'tinyShopQqMq';
	/*  #endif  */
	params.refresh_token = refresh_token;
	await http.post(refreshToken, params).then(async r => {
		store.commit('login', r.data);
		isRefreshing = false;
	});
}
http.interceptor.response(
		response => { 
			if (response.statusCode === 200) { 
				return response.data
			} else {  
				mHelper.toast(response.data.msg)
				return Promise.reject(response.data.msg)
			}
		},
		error => { 
			errorCallback(error)
			return Promise.reject(error)
		}
)

function errorCallback({
	statusCode,
	data = {}
}) { 
	switch (statusCode) {
		case 400:
			mHelper.toast('错误的请求')
			break;
		case 401:
			if(store.getters.hasLogin){
				store.commit('logout')
				mHelper.toast('登录信息已过期')
			}
			break;
			// case 401:
			// 	isRefreshing = false;
			// 	// refreshToken 的返回状态为401
			// 	if (response.config.url === refreshToken) {
			// 		uni.removeStorageSync('accessToken');
			// 		mHelper.backToLogin();
			// 		throw response.data.message;
			// 		break;
			// 	} else {
			// 		// 如果refreshToken为空 则直接跳转登录
			// 		if (!store.state.refreshToken) {
			// 			mHelper.backToLogin();
			// 			throw response.data.message;
			// 		} else {
			// 			// isRefreshing同一个页面只执行一次
			// 			if (!isRefreshing) {
			// 				isRefreshing = true;
			// 				// 刷新token
			// 				await handleRefreshToken(store.state.refreshToken, response);
			// 				requests.forEach(cb => cb());
			// 				requests = [];
			// 				isRefreshing = false
			// 				return http.request(response.config);
			// 			} else {
			// 				return new Promise((resolve) => {
			// 					// 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
			// 					requests.push(() => {
			// 						resolve(http.request(response.config));
			// 					})
			// 				})
			// 			}
			// 		}
			// 	}
			// 	break;
		case 405:
			mHelper.toast('当前操作不被允许')
			break;
			// 注释掉 走default分支
			// case 404: 
			// 	mHelper.toast(data.message)
		case 403:
			mHelper.toast('please login')
			uni.removeStorageSync('token');
			uni.navigateTo({
				url: '/pages/index/index' // 目标页面的路径
			});
			break;
			// 注释掉 走default分支
			// case 404: 
			// 	mHelper.toast(data.message)
		case 429:
			mHelper.toast('请求过多，先休息一下吧')
			break;
		case 500:
			mHelper.toast('服务器打瞌睡了')
			break;
		default:
            
			mHelper.toast(data.msg||"请求错误:" + statusCode)
			break;
	}
}

export {
	http
}
