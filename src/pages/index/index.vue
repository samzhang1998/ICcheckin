<template>
	<view class="login_home">
		<image src="/static/IClogo.png" alt="logo" class="logo_home"></image>
		<text class="welcome">Welcome Back to </text>
		<text class="company">Infinity Capital</text>
		<text class="greeting">Hello there, login to continue</text>
		<view class="sign_in">
			<view class="sign_in_info">
				<text class="title">Sign In</text>
				<text class="sub_title">Sign in to my account</text>
					<view class="sign_in_input">
						<text>Email</text>
						<input 
							v-model.trim="email"
							placeholder="My Email"
							:adjust-position="false"
						/>
						<text>Password</text>
						<input 
							v-model.trim="password"
							placeholder="My Password"
							type="password"
							:adjust-position="false"
						/>
						<view class="login_option">
							<view class="remember" @click="handleRemember">
								<checkbox class="login_checkbox" :checked="isRemembered"/>
								<text>Remember me</text>
							</view>
							<text @click="visitorLogin">Sign In as Visitor</text>
						</view>
					<view @click="signIn" class="signbtn" style=" border :none" :class="{ disabled: !isAgreed }">Sign In</view>        
				</view>
				<text class="sign_up" @click="toSignUp">Don't have an account? Sign Up Here</text>
			</view>
			<label @click="handleAgree">
				<checkbox class="login_checkbox" v-model="isAgreed" :checked="isAgreed" />
				<!-- <span>I agree to the <text style="text-decoration: underline;" @click.stop="showTerms"> Terms & Conditions & Privacy Policy </text> Set out by this site.</span> -->
				<span>
				  I agree to th
				  <text
				    style="text-decoration: underline;"
				    @click.stop="showTerms"
				  >e Terms & Conditions & Privacy Policy s</text>
				  et out by this site.
				</span>
			</label>
		</view>
	</view>
</template>
  
<script>
	import { logInRequest, visitorLoginRequest } from '@/api/index';
	export default {
		data () {
			return {
				email: "",
				password: "",
				isAgreed: false,
				isRemembered: false, 		
			}
		},
		onLoad(options) {
			const storedEmail = uni.getStorageSync("savedEmail");
			const storedPassword = uni.getStorageSync("savedPassword");
			if (storedEmail && storedPassword) {
				this.email = storedEmail;
				this.password = storedPassword;
				this.isRemembered = true;
			}
			if (options.agree === '1') {
			  this.isAgreed = true;
			} else {
				this.isAgreed = false;
			}
		},
		mounted () { 
		},
		methods: {
			handleAgree () {
				this.isAgreed = !this.isAgreed;
			},
			handleRemember () {
				this.isRemembered = !this.isRemembered;
			},
			async signIn () {
				console.log(this.email, this.password);
				try {
					const res = await logInRequest(this.email, this.password);
					if (res.statusCode === 200 & res.data.status === 1) {
						console.log("Login Success:", res.data);	
						uni.setStorageSync("userinfo", res.data.data)
						uni.setStorageSync("id", res.data.data.id);					
						uni.setStorageSync("firstName", res.data.data.firstName);
						uni.setStorageSync("lastName", res.data.data.lastName);
						uni.setStorageSync("role", res.data.data.role);
						uni.setStorageSync("title", res.data.data.title);
						uni.setStorageSync("department", res.data.data.department);
						uni.setStorageSync("id", res.data.data.id);
						uni.setStorageSync("token", res.data.data.token);
						uni.setStorageSync("phone", res.data.data.phone);
						uni.setStorageSync("startOnTime", res.data.data.startOnTime);
						uni.setStorageSync("endOnTime", res.data.data.endOnTime);
						uni.setStorageSync("email", this.email);
						if (res.data.data.role.length>0 && res.data.data.role[0] === "ADMIN") {
							uni.setStorageSync("ADMIN", true);  
                            uni.setTabBarItem({
                                index:0,
                                pagePath:"/pages/home/adminhome",
                            })
                            uni.setTabBarItem({
                                index:1,
                                visible:true,
                            })
                            uni.reLaunch({ url: "/pages/home/adminhome" });
						} else if (res.data.data.role.length>0 && res.data.data.role[0] === "MANAGER"){
							uni.setTabBarItem({
                                index:1,
                                visible:true,
                            })
							uni.setTabBarItem({
                                index:1,
                                pagePath:"/pages/home/manager-attendance"
                            })
							uni.setTabBarItem({
                                index:0,
                                pagePath:"/pages/home/clock-in",
                            })
							uni.setStorageSync("MANAGER", true);
                            uni.reLaunch({ url: "/pages/home/clock-in" });
						} else{
                            uni.setTabBarItem({
                                index:1,
                                visible:false,
                            })
							uni.setTabBarItem({
                                index:0,
                                pagePath:"/pages/home/clock-in",
                            })
							uni.setStorageSync("ADMIN", false);
                            uni.reLaunch({ url: "/pages/home/clock-in" });
						}
						
						if (this.isRemembered) {
							uni.setStorageSync("rememberUser", true);
							uni.setStorageSync("savedEmail", this.email);
							uni.setStorageSync("savedPassword", this.password);
						} else {
							uni.setStorageSync("rememberUser", false);
							uni.removeStorageSync("savedEmail");
							uni.removeStorageSync("savedPassword");
						}
					} else if (res.statusCode === 401 || res.data.status === 0) {
						console.log("Error:	Invalid login credentials");
						uni.showToast({ title: "Invalid login credentials", icon: "none" });
					} else {
						console.log(res);
						uni.showToast({ title: "Login Failed", icon: "none" });
					}					
				} catch (error) {
					console.error("Login Failed:", error);
					uni.showToast({ title: "Login Failed", icon: "none" });
				}
			},
			async visitorLogin () {
				try {
					const res = await visitorLoginRequest();
					if (res.statusCode === 200 & res.data.status === 1) {
						console.log("Login Success:", res.data);
						uni.setStorageSync("userinfo", res.data.data)
						uni.setStorageSync("id", res.data.data.id);					
						uni.setStorageSync("firstName", res.data.data.firstName);
						uni.setStorageSync("lastName", res.data.data.lastName);
						uni.setStorageSync("role", res.data.data.role);
						uni.setStorageSync("title", res.data.data.title);
						uni.setStorageSync("department", res.data.data.department);
						uni.setStorageSync("id", res.data.data.id);
						uni.setStorageSync("token", res.data.data.token);
						uni.setStorageSync("phone", res.data.data.phone);
						uni.setStorageSync("email", this.email);
						uni.reLaunch({ url: "/pages/home/clock-in" });
					} else {
						console.log(res);
						uni.showToast({ title: "Login Failed", icon: "none" });
					}
				} catch (error) {
					console.error("Login Failed:", error);
					uni.showToast({ title: "Error", icon: "none" });
				}
			},
			toSignUp () {
				uni.navigateTo({
					url: "/pages/index/signup"
				})
			},
			showTerms () {
				uni.navigateTo({
					url: "/pages/index/terms"
				})
			}
		}
	}
</script>
  
<style scoped lang="scss">
	.login_home {
		width: 750rpx;
		height: 100vh;
		overflow: hidden;
		background: black;
		display: flex;
		flex-direction: column;
		justify-content: end;
	}
	.logo_home {
		width: 500rpx;
		height: auto;
		aspect-ratio: 214 / 52;
		margin-left: 40rpx;
	}
	.welcome {
		margin-left: 40rpx;
		color: #fff;
		font-family: Nunito;
		font-size: 45rpx;
		font-weight: 700;
		line-height: normal;
		margin-top: 70rpx;
	}
	.company {
		margin-left: 40rpx;
		color:#EFC462;
		font-family: Nunito;
		font-size: 45rpx;
		font-weight: 700;
		line-height: normal;
		margin-top: 18rpx;
	}
	.greeting {
		margin-left: 40rpx;
		color: #fff;
		font-family: Nunito;
		font-size: 25rpx;
		font-weight: 500;
		line-height: normal;
		margin-top: 18rpx;
		margin-bottom: 70rpx;
	}
	.sign_in {
		width: 750rpx;
		height: 60vh;
		background: #fff;
		border-radius: 20px 20px 0 0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.sign_in_info {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 50rpx;
	}
	.title {
		width: 100%;
		text-align: center;
		font-family: Nunito;
		font-size: 45rpx;
		font-weight: 600;
		line-height: 32px;
		margin-bottom: 10rpx;
	}
	.sub_title {
		color: #475467;
		text-align: center;
		font-family: Nunito;
		font-size: 25rpx;
		font-weight: 500;
		line-height: 20px;
		letter-spacing: 0.1px;
	}
	.sign_in_input {
		width: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.sign_in_input text {
		width: 675rpx;
		font-size: 25rpx;
		font-family: Nunito;
		text-align: start;
		margin-bottom: 15rpx;
	}
	input {
		width: 630rpx;
		height: 45rpx;
		border-radius: 8px;
		padding: 20rpx;
		margin-bottom: 50rpx;
		border: 1px solid var(--Color-Gray-Gray-400, #98A2B3);
		box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
	}
	.login_option {
		width: 675rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 50rpx;
	}
	.login_option text {
		width: auto;
		color: #EFC462;
	}
	.remember {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 400rpx;
	}
	.remember text {
	  	color: #000;
		margin-bottom: 0;
		font-family: Nunito;
	}
	button {
		display: flex;
		width: 675rpx;
		height: 85rpx;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		border-radius: 100px;
		border: none;
		background: #EFC462;
		color: #fff;
		text-align: center;
		font-family: Nunito;
		font-size: 30rpx;
		font-style: normal;
		font-weight: 600;
		line-height: 20px;
		letter-spacing: 0.1px;
	}
	label {
		width: 675rpx;
		margin-left: 40rpx;
		margin-bottom: 30rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		font-family: Nunito;
		font-size: 20rpx;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
		letter-spacing: -0.2px;
	}
	.signbtn{
		width: 670rpx;
		background-color: #EFC462;
		color: white;
		text-align: center;
		height:  90rpx;
		line-height: 90rpx;
		border-radius: 45rpx;
		font-size: 18px;
		font-weight: 500;
		font-family: Nunito;
	}
	.disabled {
		background: #E0E0E0;
		pointer-events: none;
	}
	.sign_up {
		font-size: 25rpx;
		font-family: Nunito;
		text-align: start;
		margin: 10rpx 0;
	}
	.sign_up1 {
		font-size: 25rpx;
		font-family: Nunito;
		text-align: start;
		margin: 10rpx 0;
		text-decoration: underline;
	}
</style>
