import mRouter from '@/utils/router';
import mConstDataConfig from '@/config/constData.config';
import store from '@/store';
//常用方法集合
export default {
	/**
	 * toast提示
	 */
	toast(title, duration = 3000, mask = false, icon = 'none') {
		if (Boolean(title) === false) {
			return;
		}
		uni.showToast({
			title,
			duration,
			mask,
			icon
		});
	},

	/**
	 * 返回登录页面
	 */
	async backToLogin(forcelogin=false ) {
		// 存当前页面的地址 
		const currentPage = getCurrentPages()[getCurrentPages().length - 1]; 
		const params = {};
		// #ifdef H5
		params.route = `/${currentPage.$vm.route}`;
		params.query = currentPage.$vm.$mp && currentPage.$vm.$mp.query;
		// #endif
		// #ifdef MP
		params.route = `/${currentPage.$vm.__route__}`;
		params.query = currentPage.$vm.$mp && currentPage.$vm.$mp.query;
		// #endif
		// #ifdef APP-PLUS
		params.route = `/${currentPage.route}`;
		params.query = currentPage.options;
		// #endif 
		await uni.setStorageSync('backToPage', JSON.stringify(params));
		await uni.removeTabBarBadge({ index: mConstDataConfig.cartIndex });
		await store.commit('logout');
		if (forcelogin){
			mRouter.push({ route: '/pages/public/logintype' });
		}
		else{
			uni.showModal({
				content: '请先登录，是否跳转登录页面？',
				success: (confirmRes) => {
					if (confirmRes.confirm) {
						mRouter.push({ route: '/pages/public/logintype' });
					}
				}
			});
		}
		
	},
	/**
	 * 返回上一页携带参数
	 */
	prePage(index) {
		let pages = getCurrentPages(); 
		let prePage = pages[pages.length - (index || 2)]; 
		// #ifdef H5
		return prePage;
		// #endif
		return prePage.$vm;
	},

	/**
	 * 开发环境全局打印日志
	 * @param {Object} title
	 */
	log(title) {
		if (process.env.NODE_ENV === 'development' && Boolean(title) === true) {
			console.log(JSON.stringify(title));
		}
	},

	/**
	 * 异步获取设备信息
	 */
	getInfoAsync() {
		return new Promise((resolve, reject) => {
			plus.device.getInfo({
				success(e) {
					resolve(e);
				},
				fail(e) {
					reject(e.message);
				}
			});
		});
	},

	/**
	 * 安卓10不支持IMEI,则获取OAID
	 */
	getOaidAsync() {
		return new Promise((resolve, reject) => {
			plus.device.getOAID({
				success(e) {
					resolve(e);
				},
				fail(e) {
					reject(e.message);
				}
			});
		});
	},

	/**
	 * 获取一个随机数
	 * @param {Object} min
	 * @param {Object} max
	 */
	random(min, max) {
		switch (arguments.length) {
			case 1:
				return parseInt(Math.random() * min + 1, 10);
				break;
			case 2:
				return parseInt(Math.random() * (max - min + 1) + min, 10);
				break;
			default:
				return 0;
				break;
		}
	},

	/**
	 * 获取ios的IDFA
	 */
	getIdfa() {
		let idfa = '';
		try {
			if ('iOS' == plus.os.name) {
				let manager = plus.ios.invoke('ASIdentifierManager', 'sharedManager');
				if (plus.ios.invoke(manager, 'isAdvertisingTrackingEnabled')) {
					let identifier = plus.ios.invoke(manager, 'advertisingIdentifier');
					idfa = plus.ios.invoke(identifier, 'UUIDString');
					plus.ios.deleteObject(identifier);
				}
				plus.ios.deleteObject(manager);
			}
		} catch (e) {
			console.error('获取idfa失败');
		}
		return idfa;
	},

	/*
	 * obj 转 params字符串参数
	 * 例子：{a:1,b:2} => a=1&b=2
	 */
	objParseParam(obj) {
		let paramsStr = '';
		if (obj instanceof Array) return paramsStr;
		if (!(obj instanceof Object)) return paramsStr;
		for (let key in obj) {
			paramsStr += `${key}=${obj[key]}&`;
		}
		return paramsStr.substring(0, paramsStr.length - 1);
	},

	/*
	 * obj 转 路由地址带参数
	 * 例子：{a:1,b:2} => /pages/index/index?a=1&b=2
	 */
	objParseUrlAndParam(path, obj) {
		let url = path || '/';
		let paramsStr = '';
		if (obj instanceof Array) return url;
		if (!(obj instanceof Object)) return url;
		paramsStr = this.objParseParam(obj);
		paramsStr && (url += '?');
		url += paramsStr;
		return url;
	},

	/*
	获得当前页面的路径及参数：
	返回形式：/pages/index/index?a=1&b=2
	*/
	getCurrentPageUrl() {
		let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
        let curRoute = routes[routes.length - 1].route //获取当前页面路由
        let curParam = routes[routes.length - 1].options; //获取路由参数
        // 拼接参数
        let param = ''
        for (let key in curParam) {
            param += '&' + key + '=' + curParam[key]
        }
        return "/"+curRoute+"?"+ param
	},
	/*
	 * 获取url字符串参数
	 */
	getRequestParameters(locationhref) {
		let href = locationhref || '';
		let theRequest = new Object();
		let str = href.split('?')[1];
		if (str != undefined) {
			let strs = str.split('&');
			for (let i = 0; i < strs.length; i++) {
				theRequest[strs[i].split('=')[0]] = (strs[i].split('=')[1]);
			}
		}
		return theRequest;
	},

	/**
	 * 加密字符串
	 */
	strEncode(str) {
		const key = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let l = key.length;
		let a = key.split('');
		let s = '', b, b1, b2, b3;
		for (let i = 0; i < str.length; i++) {
			b = str.charCodeAt(i);
			b1 = b % l;
			b = (b - b1) / l;
			b2 = b % l;
			b = (b - b2) / l;
			b3 = b % l;
			s += a[b3] + a[b2] + a[b1];
		}
		return s;
	},

	/**
	 * 解密字符串
	 */
	strDecode(str) {
		const key = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let l = key.length;
		let b, b1, b2, b3, d = 0, s;
		s = new Array(Math.floor(str.length / 3));
		b = s.length;
		for (let i = 0; i < b; i++) {
			b1 = key.indexOf(str.charAt(d));
			d++;
			b2 = key.indexOf(str.charAt(d));
			d++;
			b3 = key.indexOf(str.charAt(d));
			d++;
			s[i] = b1 * l * l + b2 * l + b3;
		}
		b = eval('String.fromCharCode(' + s.join(',') + ')');
		return b;
	},

	/**
	 * 比较版本号
	 */
	compareVersion(reqV, curV) {
		if (curV && reqV) {
			let arr1 = curV.split('.'),
				arr2 = reqV.split('.');
			let minLength = Math.min(arr1.length, arr2.length),
				position = 0,
				diff = 0;
			while (position < minLength && ((diff = parseInt(arr1[position]) - parseInt(arr2[position])) == 0)) {
				position++;
			}
			diff = (diff != 0) ? diff : (arr1.length - arr2.length);
			if (diff > 0) {
				if (position == minLength - 1) {
					return 1;
				} else {
					return 2;
				}
			} else {
				return 0;
			}
		} else {
			console.log('版本号不能为空');
			return 0;
		}
	},

	/**
	 * H5复制
	 */
	h5Copy(content) {
		let textarea = document.createElement('textarea');
		textarea.value = content;
		textarea.readOnly = 'readOnly';
		document.body.appendChild(textarea);
		textarea.select(); // 选择对象
		textarea.setSelectionRange(0, content.length); //核心
		let result = document.execCommand('Copy'); // 执行浏览器复制命令
		textarea.remove();
		return result;
	},
	/**
	 * 计算两个经纬度坐标之间的距离（单位：米）
	 * @param {number} lat1 第一个点的纬度
	 * @param {number} lng1 第一个点的经度
	 * @param {number} lat2 第二个点的纬度
	 * @param {number} lng2 第二个点的经度
	 * @returns {number} 距离（米）
	 */
	getDistanceBetweenCoordinates(lat1, lng1, lat2, lng2) {
		// 将经纬度转换为弧度
		console.log(lat1, lng1, lat2, lng2)
		const toRadians = angle => angle * (Math.PI / 180);
		const φ1 = toRadians(lat1);
		const φ2 = toRadians(lat2);
		const Δφ = toRadians(lat2 - lat1);
		const Δλ = toRadians(lng2 - lng1);

		// Haversine公式
		const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
				Math.cos(φ1) * Math.cos(φ2) *
				Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		// 地球半径（米）
		const R = 6371000;
		return R * c;
	}

	/* 使用示例
	const distance = getDistanceBetweenCoordinates(
		39.9042, 116.4074,  // 北京经纬度
		31.2304, 121.4737   // 上海经纬度
	);

	console.log(`距离: ${distance.toFixed(2)} 米`);  // 输出: 距离: 1067378.77 米
	*/
};

