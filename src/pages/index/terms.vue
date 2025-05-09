<template>
	<view class="content">
		<view class="top">
		    <image src="/static/back_icon.png" alt="logo" @click="back"/>
		    <text>Terms & Conditions</text> 
		</view>
		<view class="body">
			<text class="title">AU Terms & Conditions — IC Clock</text>
			<text class="update">Last updated: 1/5/2025</text>
			<text class="description">By downloading or using the IC Clock app, you agree to be bound by these Terms & Conditions. These terms are governed by the laws of New South Wales, Australia.</text>
			<text class="sub_title">1. Purpose of the App</text>
			<text class="description">IC Clock is designed for workplace attendance tracking, including location check-ins and photo verification. The app may be used by employees, contractors, or authorised personnel only.</text>
			<text class="sub_title">2. User Obligations</text>
			<text class="description">You agree not to:</text>
			<text class="description">Misuse the app or access it for unauthorised purposes</text>
			<text class="description">Provide false information or impersonate others</text>
			<text class="description">Reverse engineer, copy, or redistribute the app</text>
			<text class="sub_title">3. Intellectual Property</text>
			<text class="description">All content, logos, and intellectual property remain the property of Infinity Capital. You may not use this content for any commercial purposes without permission.</text>
			<text class="sub_title">4. Termination</text>
			<text class="description">We reserve the right to suspend or terminate access if you violate these terms.</text>
			<text class="sub_title">5. Updates & Changes</text>
			<text class="description">We may update these terms at any time. Your continued use of the app implies agreement with the updated terms.</text>
			<text class="title">AU Privacy Policy — IC Clock</text>
			<text class="update">Last updated: 1/5/2025</text>
			<text class="description">This Privacy Policy outlines how IC Clock handles your personal information, in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).</text>
			<text class="sub_title">1. What We Collect</text>
			<text class="description">We may collect and store the following information:</text>
			<text class="description">Device identifiers (e.g., for security or analytics)</text>
			<text class="description">Location data for attendance check-ins (with your permission)</text>
			<text class="description">Photos/videos taken within the app (for verification purposes)</text>
			<text class="description">Camera and microphone access (only if explicitly enabled)</text>
			<text class="description">App usage data (e.g., page views, login times)</text>
			<text class="sub_title">2. Why We Collect It</text>
			<text class="description">We collect your personal information to:</text>
			<text class="description">Deliver attendance tracking and workplace management features</text>
			<text class="description">Improve app performance and user experience</text>
			<text class="description">Comply with legal obligations and workplace policies</text>
			<text class="sub_title">3. Consent & Tracking</text>
			<text class="description">We do not track you without your consent. You will see a prompt when the app requires access to location, camera, microphone, or IDFA for optional features. You may decline these and still use limited app functionality.</text>
			<text class="sub_title">4. Disclosure of Information</text>
			<text class="description">Your information may be shared with:</text>
			<text class="description">Your employer or organisation (for compliance purposes)</text>
			<text class="description">Cloud service providers (e.g., Firebase or AWS in Australia)</text>
			<text class="description">Legal or regulatory authorities, if required</text>
			<text class="description">We do not sell or share your personal data with third parties for advertising.</text>
			<text class="sub_title">5. Data Security</text>
			<text class="description">We implement reasonable steps to protect your data from misuse, loss, unauthorised access, or disclosure.</text>
			<text class="sub_title">6. Access & Correction</text>
			<text class="description">You have the right to:</text>
			<text class="description">Request access to the personal information we hold about you</text>
			<text class="description">Request corrections if information is inaccurate or outdated</text>
			<text class="sub_title">7. Contact Us</text>
			<text class="description">If you have questions or wish to make a complaint, please contact:</text>
			<text class="description">Infinity capital</text>
			<text class="description">Email: info@icmm.com.au</text>
			<text class="description">Address: Suite 34.03, level 34/201 Elizabeth St, Sydney NSW 2000</text>
			<text class="description">If you are not satisfied with our response, you may contact the Office of the Australian</text>
			<text class="description">Information Commissioner (OAIC):</text>
			<text class="description">https://www.oaic.gov.au/</text>
		</view>
		<view class="buttons">
			<button @click="handleAgree" class="agree">Agree</button>
			<button @click="handleReject" class="reject">Reject</button>
		</view>
	</view>
</template>

<script>
	export default {
		methods: {
			back(){
			    uni.navigateTo({ url: "/pages/index/index"});
			},
			handleAgree () {
				uni.navigateTo({ url: "/pages/index/index?agree=1"});
			},
			handleReject () {
				uni.navigateTo({ url: "/pages/index/index?agree=0"});
			}
		}
	}
</script>

<style scoped>
	.content {
		width: 750rpx;
		min-height: 100vh;
		background-color: #F8F8F8;
		display: flex;
		flex-direction: column;
		align-items: start;
	}
	.top {
	    width: 750rpx;
	    height: 150rpx;
	    padding-bottom: 30rpx;
	    background: #fff;
	    display: flex;
	    align-items: end;
	    justify-content: center;
	    position: sticky;
	    top: 0;
	    z-index: 100;
	}
	.top image {
	    width: 50rpx;
	    height: 50rpx;
	    position: absolute;
	    left: 40rpx;
	}
	.top text {
	    color: #101828;
	    font-family: Nunito;
	    font-size: 35rpx;
	    font-weight: 700;
	    line-height: 140%;
	    text-align: center;
	}
	.body {
		width: 680rpx;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
	}
	.title {
		color: #000;
		font-family: Nunito;
		font-size: 30rpx;
		font-weight: 500;
		line-height: 20px;
		letter-spacing: 0.1px;
		margin-bottom: 30rpx;
	}
	.update {
		color: #808080;
		font-family: Nunito;
		font-size: 25rpx;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		margin-bottom: 20rpx;
	}
	.description {
		color: #333;
		font-family: Nunito;
		font-size: 25rpx;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
		margin-bottom: 20rpx;
	}
	.sub_title {
		color: #333;
		font-family: Nunito;
		font-size: 25rpx;
		font-style: normal;
		font-weight: 600;
		line-height: normal;
		margin-bottom: 20rpx;
	}
	.buttons {
		width: 750rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 30rpx;
		margin-bottom: 20rpx;
	}
	.buttons button {
		width: 300rpx;
		padding: 15rpx 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 30px;
		outline: none;
		font-family: Nunito;
		font-size: 25rpx;
		font-style: normal;
		font-weight: 500;
		line-height: 140%;
	}
	.agree {
		background: #EFC462;
		color: #FFF;
	}
	.reject {
		border: 1px solid #808080;
		background: #FFF;
		color: #808080;
	}
</style>