 
// 密码注册
const registerByPass = '/users/register/';

// 密码登录
// const loginByPass = '/tiny-shop/v1/site/login';
const loginByPass = '/users/login/';

// 微信授权登录
const wechatH5Login = '/tiny-shop/v1/third-party/wechat';

// 微信小程序授权登录
const mpWechatLogin = '/tiny-shop/v1/third-party/wechat-mp';

// 密码重置
const updatePassword = '/users/find_password/';

// 第三方绑定
const authLogin = '/tiny-shop/v1/member/auth/create';

// 查询绑定状态
const isBindingCheck = '/tiny-shop/v1/member/auth/is-binding';

// 手机号登录
const loginBySmsCode = '/tiny-shop/v1/site/mobile-login';

// 获取手机验证码
const smsCode = '/users/phonecode/';

// 退出登录
const logout = '/tiny-shop/v1/site/logout';

// 刷新token
const refreshToken = '/tiny-shop/v1/site/refresh';

export function initUserinfo(){
	// 登录后初始化用户数据
	that.$mHelper.toast("恭喜您，登录成功！");
	that.$store.commit("login", r); 
	if (this.userInfo) {
	    that.btnLoading = false;
	    const oauthClientParams = {};
		/*  #ifdef MP-WEIXIN */
		oauthClientParams.oauth_client = "wechatMp";
		/*  #endif  */
		/*  #ifndef MP-WEIXIN */
		oauthClientParams.oauth_client = "wechat";
		/*  #endif  */
		const userInfo = JSON.parse(that.userInfo); 
		// #ifdef H5
		that.$mPayment.wxConfigH5();
		// #endif
		const backToPage = uni.getStorageSync("backToPage"); 
		if (backToPage) {
		if (
			backToPage.indexOf("/pages/user/user") !== -1 ||
			backToPage.indexOf("/pages/cart/cart") !== -1 ||
			backToPage.indexOf("/pages/index/index") !== -1 ||
			backToPage.indexOf("/pages/category/category") !== -1
		) {
			that.$mRouter.reLaunch(JSON.parse(backToPage));
		} else {
			that.$mRouter.redirectTo(JSON.parse(backToPage));
		}
		uni.removeStorageSync("backToPage");
		uni.removeStorageSync("wechatUserInfo");
			return;
		} else {
				that.$mRouter.reLaunch({
					route: "/pages/user/user",
				});
		}
	} else {
	    this.$mHelper.toast(r.msg);
	}
}

export {
    registerByPass,
    loginByPass,
    isBindingCheck,
    wechatH5Login,
    mpWechatLogin,
    authLogin,
    updatePassword,
    smsCode,
    loginBySmsCode,
    logout,
    refreshToken
};
