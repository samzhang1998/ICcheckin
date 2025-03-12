<template>
	<view class="login_home">
		<img src="/static/IClogo.png" alt="logo" class="logo_home"/>
		<text class="welcome">Welcome Back to </text>
		<text class="company">Infinity CAPITAL</text>
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
						/>
						<text>Password</text>
						<input 
							v-model.trim="password"
							placeholder="My Password"
							type="password"
						/>
						<view class="login_option">
							<view class="remember">
								<checkbox class="login_checkbox" :checked="isRemembered" @click="handleRemember"/>
								<text>Remember me</text>
							</view>
							<!-- <text>Forgot Password</text> -->
						</view>
					<button @click="signIn" :disabled="!isAgreed">Sign In</button>        
				</view>
				<!-- <p>Don't have an account? Sign Up Here</p> -->
			</view>
			<label>
				<checkbox class="login_checkbox" :checked="isAgreed" @click="handleAgree" />
				<span>I agree to the Terms & Conditions & Privacy Policy Set out by this site.</span>
			</label>
		</view>
	</view>
</template>
  
<script>
	import { logInRequest } from '@/api/index';
	export default {
		data () {
			return {
				email: "",
				password: "",
				isAgreed: false,
				isRemembered: false				
			}
		},
		onLoad() {
			const storedEmail = uni.getStorageSync("savedEmail");
			const storedPassword = uni.getStorageSync("savedPassword");
			if (storedEmail && storedPassword) {
				this.email = storedEmail;
				this.password = storedPassword;
				this.isRemembered = true;
			}
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
					if (res.statusCode === 200) {
						console.log("Login Success:", res.data);
						uni.switchTab({ url: "/pages/home/home" });
						uni.setStorageSync("firstName", res.data.data.firstName);
						uni.setStorageSync("lastName", res.data.data.lastName);
						uni.setStorageSync("role", res.data.data.department);
						uni.setStorageSync("id", res.data.data.id);
						uni.setStorageSync("token", res.data.data.token);
						if (this.isRemembered) {
							uni.setStorageSync("savedEmail", this.email);
							uni.setStorageSync("savedPassword", this.password);
						} else {
							uni.removeStorageSync("savedEmail");
							uni.removeStorageSync("savedPassword");
						}
					} else if (res.statusCode === 401) {
						console.log("Error:	Invalid login credentials");
						uni.showToast({ title: "Login Failed", icon: "none" });
					} else {
						console.log(res);
						uni.showToast({ title: "Login Failed", icon: "none" });
					}					
				} catch (error) {
					console.error("Login Failed:", error);
					uni.showToast({ title: "Login Failed", icon: "none" });
				}
			}
		}
	}
</script>
  
<style scoped>
	.login_home {
		width: 750rpx;
		height: 100vh;
		background: black;
		display: flex;
		flex-direction: column;
		justify-content: end;
		font-family: Nunito;
        font-style: normal;
	}
	.logo_home {
		width: 500rpx;
		margin-left: 40rpx;
	}
	.welcome {
		margin-left: 40rpx;
		color: #fff;
		font-size: 45rpx;
		font-weight: 700;
		line-height: normal;
		margin-top: 70rpx;
	}
	.company {
		margin-left: 40rpx;
		color:#EFC462;
		font-size: 45rpx;
		font-weight: 700;
		line-height: normal;
		margin-top: 18rpx;
	}
	.greeting {
		margin-left: 40rpx;
		color: #fff;
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
		padding-top: 50rpx;
	}
	.title {
		width: 100%;
		text-align: center;
		font-size: 45rpx;
		font-weight: 600;
		line-height: 32px;
	}
	.sub_title {
		color: #475467;
		text-align: center;
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
		font-size: 20rpx;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
		letter-spacing: -0.2px;
	}
</style>
