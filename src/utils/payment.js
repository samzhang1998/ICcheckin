// #ifdef H5
import { wechatConfig } from '@/api/basic';
import $mConfig from '@/config/index.config';
import jweixin from '@/common/jweixin';
// #endif
import { isBindingCheck } from '@/api/login';
import { payCreate } from '@/api/basic';
import { http } from '@/utils/request';
import mHelper from '@/utils/helper';
import mRouter from '@/utils/router';
import { orderPay } from '@/api/product';

export default {
// 判断是否公众号（微信H5）
	isWechat() {
		const ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/micromessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	},

// wxjssdk
	async wxConfigH5() {
		if (this.isWechat()) {
			const jsApiList = JSON.stringify(['chooseWXPay']);
			await http.post(`${wechatConfig}`, {
				url: $mConfig.hostUrl,
				jsApiList,  // 需要调用微信的原生方法
				debug: false    // 是否打开调试
			}).then(r => {
				jweixin.config({
					...r.data
				});
			});
		}
	},

	/*
   *@des 微信支付
   *
   *@param order_group 订单:order;充值:recharge;
   *@param data 订单 {“order_id”:199} 充值 {“money”:100};
   */
	async weixinPay(order_group, data) {
		/* orderInfo数据格式
		"data": {
		"appid": "wx0411fa6a39d61297",
		"noncestr": "jUsIgpt9H8meyYP1",
		"package": "Sign=WXPay",
		"partnerid": "1230636401",
		"prepayid": "wx20205704684293f30de855041611765700",
		"timestamp": 1576846624,
		"sign": "ED84A75D5CE5FC4A9FF8DA81BB7B0AED"
	},
	*/
		// #ifdef H5
		if (!this.isWechat()) {
			mHelper.toast('仅支持微信H5和微信小程序支付');
			return;
		}
		// #endif
		// #ifdef MP-QQ
		mHelper.toast('QQ小程序暂不支持充值');
		return;
		// #endif
		
		let param = JSON.parse(data); 
		await http.get('/pay/pay/', {
			bills:param.bills,
			payway:"weixin",
			billtype: param.billtype,
			pay_type: 1,
			neworderno:param.neworderno,
			// #ifdef APP-PLUS
			trade_type: 'app',
			// #endif
			// #ifdef MP-WEIXIN
			trade_type: 'wechatMp',
			openid:param.openid
			// #endif 
		}).then((r) => {
			console.log(r)
			if (r.status == 0 ){
				// #ifdef APP-PLUS
				uni.requestPayment({
					provider: 'wxpay',	// 微信支付
					orderInfo:  r.msg, //微信订单数据
					success: function(res) {
						console.log(res)
						mHelper.toast('支付成功');
						// 更新订单状态
						http.post('/pay/pay/', { 
							bills:param.bills,
							payway:'weixin',  
							billtype:param.billtype,
							status: 1
						}).then(r => {
							mRouter.push({ route: '/pages/user/money/success' });   
						}).catch((r) => {
							console.log(r) 
						});
						mRouter.push({ route: '/pages/user/money/success' });
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
					},
					complete:function(e){
						console.log(e)
					},
				}); 
				// #endif
				// #ifndef APP-PLUS
				uni.requestPayment({
					...r.msg, 
					success: () => {
						mHelper.toast('支付成功');
						http.post('/pay/pay/', { 
							bills:param.bills,
							payway:'weixin',  
							billtype:param.billtype,
							status: 1
						}).then(r => {
							mRouter.push({ route: '/pages/user/money/success' });   
						}).catch((r) => {
							console.log(r) 
						}); 
					},
					fail: (res) => {
						mHelper.toast('支付失败' + res.errMsg);
					},
					complete: () => {
					}
				});
				// #endif
			}
			else{
				mHelper.toast('支付失败.' );
			} 
		}); 
	},

	/*
   *@des 支付宝支付
   *
   *@param order_group 订单:order;充值:recharge;
   *@param data 订单 {“order_id”:199} 充值 {“money”:100};
   */
	async aliPay(order_group, data) {
		// #ifdef MP-QQ
		mHelper.toast('QQ小程序不支持支付宝充值');
		return;
		// #endif
		// #ifdef MP-WEIXIN
		mHelper.toast('微信小程序不支持支付宝充值');
		return;
		// #endif
		let param = JSON.parse(data); 
		await http.get('/pay/pay/', { 
			bills:param.bills,
			payway:'zhifubao',
			billtype: param.billtype,
			neworderno:param.neworderno,
			// #ifdef H5
			trade_type: 'wap',
			// #endif
			// #ifdef APP-PLUS
			trade_type: 'app',
			// #endif
			 
		}).then(r => {
			console.log(r.msg)
			// #ifdef H5
			window.location.href = r.orderInfo;
			// #endif
			// #ifdef APP-PLUS
			uni.requestPayment({
				provider: 'alipay',
				orderInfo: r.msg, //微信、支付宝订单数据
				success: function(r) {
					console.log(r)
					mHelper.toast('支付成功');
					// 更新订单状态
					http.post('/pay/pay/', { 
						bills:param.bills,
						payway:'zhifubao', 
						paymsg:r.rawdata,
						billtype:param.billtype,
						status: 1
					}).then(r => {
						mRouter.push({ route: '/pages/user/money/success' });   
					}).catch((r) => {
						console.log(r) 
					}); 
				},
				fail: function(err) {
					console.log('fail:' + JSON.stringify(err));
				}
			});
			// #endif
		}).catch((r) => {
			console.log(r) 
		});
	},

	/*
   *@des 余额支付
   *
   *@param data 支付参数
   */
	async balancePay(data) {
		await http.post(`${orderPay}`, {
			order_group: 'order',
			trade_type: 'js',
			pay_type: 5,
			data
		}).then(() => {
			mHelper.toast('支付成功~');
			mRouter.push({ route: '/pages/user/money/success' });
		});
	}
};
