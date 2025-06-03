<template>
	<view class="maindiv">
	    <view class="title">
	        <image src="/static/back_icon.png" alt="logo" @click="back"/>
	        <text>Sign Up</text> 
	    </view>
	    <view class="profile">
	        <view class="item">
	            <view class="itemtitle">First Name</view>
				<view class="info">
					<input v-model="firstName"  /> 
				</view>
	        </view>
	        <view class="item">
	            <view class="itemtitle">Last Name</view>
				<view class="info">
					<input v-model="lastName" />
				</view>
	        </view>
	        <view class="item">
	            <view class="itemtitle">Email</view> 
				<view class="info">
					<input v-model="email" />
				</view>
	        </view>
			<view class="item">
			    <view class="itemtitle">Password</view>
				<view class="info">
					<input v-model="password" type="password" />
				</view>
			</view>
			<view class="item">
			    <view class="itemtitle">Confirm Password</view>
				<view class="info">
					<input v-model="confirmPassword" type="password" />
				</view>
			</view>
	    </view>
	    <view class="btn">
	        <button @click="signUp">Sign Up</button>
	    </view>
	</view>
</template>

<script>
	import { signUpRequest } from '@/api/index';
	export default {
		data () {
			return {
				firstName: "",
				lastName: "",
				password: "",
				confirmPassword: "",
				email: ""
			}
		},
		methods: {
		    back(){
		        uni.navigateTo({ url: "/pages/index/index"});
		    },
			async signUp () {
				try {
					if (this.password !== this.confirmPassword) {
						uni.showToast({ title: "Your password is not the same with confirm password", icon: "none" });
					} else {
						const data = {
							email: this.email,
							password: this.password,
							firstName: this.firstName,
							lastName: this.lastName
						}
						const res = await signUpRequest(data);
						if (res.data.status === 1) {
							console.log("sign up Success:", res.data);
							uni.navigateTo({ url: "/pages/index/index"});
						} else {
							console.log("sign up Fail:", res.data);
							uni.showToast({ title: `Fail, ${res.msg}`, icon: "none" });
						}
					}
				} catch (error) {
					console.error("Signup Failed:", error);
					uni.showToast({ title: "Error", icon: "none" });
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.maindiv{
        width: 750rpx; 
        min-height: 100vh;
        background-color: #F8F8F8;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30rpx;
        .title {
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
        .title image {
            width: 50rpx;
            height: 50rpx;
            position: absolute;
            left: 40rpx;
        }
        .title text {
            color: #101828;
            font-family: Nunito;
            font-size: 35rpx;
            font-weight: 700;
            line-height: 140%;
            text-align: center;
        }
        .profile {
            width: 600rpx;
            padding: 20rpx 40rpx;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 30rpx;
            border-radius: 10px;
            background: #FEFEFE;
        }
        .btn {
            position: fixed;
            bottom: 0;
            width: 750rpx;
            height: 150rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            border-top: 1px solid #E9EAEC;
            background: #FEFEFE;
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
            background: #01aed3;
            color: #fff;
            text-align: center;
            font-family: Nunito;
            font-size: 30rpx;
            font-style: normal;
            font-weight: 600;
            line-height: 20px;
            letter-spacing: 0.1px;
        }
        .item{
            display: flex;
            flex-direction: column;
            gap: 10rpx;
            .itemtitle{
                color: #475467;
                font-family: Nunito;
                font-size: 22rpx;
                font-style: normal;
                font-weight: 400;
                line-height: 16px;
                letter-spacing: -0.2px;
            }
			.info {
				border: 1px solid #98A2B3;
				border-radius: 10px;
				padding: 10rpx 20rpx;
			}
        }
        .userinfo{
            .name{
                color: #101828; 
                font-family: Nunito;
                font-size: 30rpx;
                font-style: normal;
                font-weight: 600;
                line-height: normal;
                letter-spacing: -0.4px;
            }
            .position{
                color: #667085;
                font-family: Nunito;
                font-size: 22rpx;
                font-style: normal;
                font-weight: 400;
                line-height: 140%;
            }
        } 
    }
</style>