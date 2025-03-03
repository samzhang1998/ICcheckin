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
							placeholder="My Email"
						/>
						<text>Password</text>
						<input 
							placeholder="My Password"
						/>
						<view class="login_option">
							<view class="remember">
								<checkbox class="login_checkbox"/>
								<text>Remember me</text>
							</view>
							<text>Forgot Password</text>
						</view>
					<button @click="signIn">Sign In</button>        
				</view>
				<p>Don't have an account? Sign Up Here</p>
			</view>
			<label>
				<checkbox class="login_checkbox"/>
				<span>I agree to the Terms & Conditions & Privacy Policy Set out by this site.</span>
			</label>
		</view>
	</view>
</template>
  
<script>
	export default {
		methods: {
			signIn () {
				uni.switchTab({ url: "/pages/home/home" });
				const user = {
					userName: "Eniasls Nunito",
					userRole: "UI/UX Designer",
					userPeriod: "Paid Period 1 Sept 2024 - 30 Sept 2024"
				};
				uni.setStorageSync("name", user.userName);
				uni.setStorageSync("role", user.userRole);
				uni.setStorageSync("period", user.userPeriod);
			}
		}
	}
</script>
  
<style scoped>
	.login_home {
		width: 100%;
		height: 100vh;
		background: black;
		display: flex;
		flex-direction: column;
		justify-content: end;
		font-family: Nunito;
        font-style: normal;
	}
	.logo_home {
		width: 70%;
		margin-left: 5%;
	}
	.welcome {
		margin-left: 5%;
		color: #fff;
		font-size: 24px;
		font-weight: 700;
		line-height: normal;
		margin-bottom: 0;
		margin-top: 8%;
	}
	.company {
		margin-left: 5%;
		color:#EFC462;
		font-size: 24px;
		font-weight: 700;
		line-height: normal;
		margin-bottom: 0;
		margin-top: 2%;
	}
	.greeting {
		margin-left: 5%;
		color: #fff;
		font-size: 14px;
		font-weight: 500;
		line-height: normal;
		margin-top: 2%;
		margin-bottom: 8%;
	}
	.sign_in {
		width: 100%;
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
		padding-top: 5%;
	}
	.title {
		width: 100%;
		text-align: center;
		font-size: 24px;
		font-weight: 600;
		line-height: 32px;
		margin-bottom: 0;
	}
	.sub_title {
		color: #475467;
		text-align: center;
		font-size: 14px;
		font-weight: 500;
		line-height: 20px;
		letter-spacing: 0.1px;
	}
	.sign_in p {
		color: #475467;
		text-align: center;
		margin: 0;
		margin-bottom: 3%;
	}
	.sign_in_input {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.sign_in_input text {
		width: 90%;
		font-size: 12px;
		text-align: start;
		margin-bottom: 3px;
	}
	input {
		width: 83%;
		height: 20px;
		border-radius: 8px;
		padding: 12px;
		margin-bottom: 5%;
		border: 1px solid var(--Color-Gray-Gray-400, #98A2B3);
		box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
	}
	.login_option {
		width: 90%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 5%;
	}
	.login_option text {
		width: auto;
		color: #EFC462;
	}
	.remember {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 40%;
	}
	.remember p {
	  	color: #000;
	}
	button {
		display: flex;
		width: 90%;
		height: 48px;
		padding: 12px 20px;
		margin-bottom: 5%;
		justify-content: center;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
		border-radius: 100px;
		border: none;
		background: #EFC462;
		color: #fff;
		text-align: center;
		font-family: Nunito;
		font-size: 16px;
		font-style: normal;
		font-weight: 600;
		line-height: 20px;
		letter-spacing: 0.1px;
	}
	label {
		width: 90%;
		margin-left: 5%;
		margin-bottom: 5%;
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 10px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
		letter-spacing: -0.2px;
	}
</style>
