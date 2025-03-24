<template>
	<view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" @click="back" alt="logo" />
            <text>Change Password</text> 
        </view>
        <view class="password">
            <view class="userinfo">
                <view class="name">Change Password Form</view>
                <view class="position">Fill information to change your password</view>             
            </view>
            <view class="item">
                <view class="itemtitle">Current Password</view>
                <view class="itemcontents"> 
                    <image src="/static/finger-scan.png" alt="logo" class="img" />
                    <input class="userinput" type="password"  v-model="oldpwd"  placeholder="My Password"  /> 
                    <image src="/static/Show_password.png" alt="logo" class="img" /> 
                </view>
            </view>
            <view class="item">
                <view class="itemtitle">New Password</view>
                <view class="itemcontents"> 
                    <image src="/static/finger-scan.png" alt="logo" class="img" />
                    <input class="userinput"  type="password"  v-model="newpwd1"   placeholder="My Password" /> 
                    <image src="/static/Show_password.png" alt="logo" class="img" /> 
                </view>
            </view> 
            <view class="item">
                <view class="itemtitle">Confirm New Password</view>
                <view class="itemcontents"> 
                    <image src="/static/finger-scan.png" alt="logo" class="img" />
                    <input class="userinput"  type="password"  v-model="newpwd2"   placeholder="My Password" />
                    <image src="/static/Show_password.png" alt="logo" class="img" /> 
                </view>
            </view>
        </view>
        <view class="btn">
            <button @click="update">Update Password</button>
        </view>
	</view>
</template>
  
<script>
import {changePwdApi, getUserDetailApi} from "@/api/users";
	export default {
        data() {
            return { 
               oldpwd:"",
               newpwd1:"",
               newpwd2:"" ,
               userid:'',// 待修改
            };
        },
		methods: { 
            back(){
                uni.navigateBack({
                    delta: 1
                });
            },
            update(){
                if (this.newpwd1.length < 8){
                    uni.showModal({
                        content: 'Passwords at least 8 chars',
                        confirmText: 'OK', 
                        showCancel:false
                    })                     
                    return 
                }
                if(this.newpwd1 != this.newpwd2){
                    uni.showModal({
                        content: 'Passwords do not match',
                        confirmText: 'OK', 
                        showCancel:false
                    }) 
                    return 
                }
                let data = {
                "oldPassword": this.oldpwd,
                "newPassword": this.newpwd1
                }
                changePwdApi(this.userid, data).then((res)=>{
                    uni.showToast({
                        title: "Saved",
                        icon: "success",
                        duration: 3000,
                    });
                })                
            },
            getUserInfo(){
                this.user.token = uni.getStorageSync("token");  
                if (this.user.token == ''){
                    // 跳转登录
                    uni.navigateTo({
                        url: 'pages/index/index' // 目标页面的路径
                    });
                    return 
                }
                this.user.email = uni.getStorageSync("email");  
                this.userid = uni.getStorageSync("id");  
                this.user.lastName = uni.getStorageSync("lastName");  
                this.user.firstName = uni.getStorageSync("firstName");  
                this.user.phone = uni.getStorageSync("phone"); 
                this.user.department = uni.getStorageSync("department");  
                this.user.title = uni.getStorageSync("title");  
                this.user.role = uni.getStorageSync("role");
                console.log(this.user)
            }
		},
        onShow () {
            this.getUserInfo()
        }
	}
</script>
  
<style scoped lang="scss">
	.maindiv {
        width: 750rpx;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #F8F8F8;
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
        .password {
            width: 600rpx;
            padding: 30rpx 40rpx;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 20rpx;
            border-radius: 10px;
            background: #FEFEFE;
            margin-top: 30rpx;
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
            .itemcontents{
                width: 560rpx;
                padding: 10rpx 20rpx;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                border-radius: 10px; 
                border: 1px solid #DADADA;
                background: #FFF;
                gap: 20rpx;
                .userinput{
                    height: 50rpx;
                    flex: 1;
                    font-family: Nunito;
                    font-size: 26rpx;
                    font-style: normal;
                    font-weight: 400;
                    letter-spacing: -0.2px;
                }
                .img{ 
                    width: 36rpx;
                    height: 36rpx;
                }
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
    }
</style>
