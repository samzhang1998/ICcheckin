import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const ACCESSTOKEN = uni.getStorageSync('accessToken') || '';
const REFERRER = uni.getStorageSync('referrer') || '';
const USER = uni.getStorageSync('user') || {};
// const REFRESHTOKEN = uni.getStorageSync('refreshToken') || '';

const store = new Vuex.Store({
    state: {
		// baseurl
        WX_XIAOCHENGXU_ID:"gh_bb5a51cfbb1a", //微信小程序ID
		BaseUrl:'https://property.chidict.com/',
        BaseShareUrl:'https://property.chidict.com/api/appshare/appshare/',//分享链接
        BaseImagesUrl:'https://property.chidict.com/images/',
        BaseAppStaticUrl:'https://property.chidict.com/app/',
        //用户token
        accessToken: ACCESSTOKEN,
        //用户信息
        userInfo: USER,
        //推荐人
        referrer: REFERRER,
        //小程序openid
        openId: '',
        //网络状态，用于下载提醒
        networkState: 'unknown',
        // refreshToken: REFRESHTOKEN
    },
    getters: {
		// 获取网络状态
		networkStatus: state => {
			return state.networkState;
		},
        // 判断用户是否登录
        hasLogin: state =>  !!(state.accessToken) 
    },
    mutations: {
        login(state, provider) {
            const TOKEN = `JWT ${provider.token}`  
			state.accessToken=TOKEN;
			state.userInfo = provider;
			state.user = provider;
            uni.setStorageSync('user', provider);
			uni.setStorageSync('accessToken',TOKEN);
			// uni.setStorageSync('refreshToken', provider.refresh_token);
			uni.setStorageSync('userInfo', provider); 
            if (provider.merchant){
                uni.setStorageSync('merchant', provider.merchant); 
                console.log(provider.merchant)
            }
            uni.setStorageSync('openid', provider['openid']);
        },
        logout(state) {
            state.accessToken = '';
            // state.refreshToken = '';
            state.userInfo = {}; 
            uni.removeStorageSync('accessToken');
            // uni.removeStorageSync('refreshToken');
            uni.removeStorageSync('userInfo');
            uni.removeStorageSync('user')
            uni.removeStorageSync('merchant') // 移除商户信息
        },
        setReferrer(state, referrer) {
            state.referrer = referrer;
            uni.setStorageSync('referrer', referrer);
        },
        setOpenId(state, openId) {
            state.openId = openId;
            uni.setStorageSync('openId', openId);
        },
        setNetworkState(state, provider) {
            state.networkState = provider;
        }
    },
    actions: {
        networkStateChange({commit}, info) {
            commit('setNetworkState', info);
        },
        logout({commit}) {
            commit('logout');
        }
    }
})

export default store
