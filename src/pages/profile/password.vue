<template>
	<view class="maindiv">
        <view class="header">
            <image src="/static/back_icon.png" @click="back" alt="logo" class="arrowimg arrowleft" />
            <view class="title">Change Password</view> 
        </view> 
        <view class="userinfo">
            <view class="name">Change Password Form</view>
            <view class="position">Fill information to change your password</view> 
            
        </view> 

        <view class="item">
            <view class="itemtitle">Current Password</view>
            <view class="itemcontents"> 
                <image src="/static/finger-scan.png" alt="logo" class="img"  />
                <input class="uni-input userinput" type="password" focus v-model="oldpwd"  placeholder="My Password"  /> 
                <image src="/static/Show_password.png" alt="logo" class="img imgfloatright"  /> 
            </view>
        </view> 

        <view class="item">
            <view class="itemtitle">New Password</view>
            <view class="itemcontents"> 
                <image src="/static/finger-scan.png" alt="logo" class="img"  />
                <input class="uni-input userinput" focus type="password"  v-model="newpwd1"   placeholder="My Password" /> 
                <image src="/static/Show_password.png" alt="logo" class="img imgfloatright"  /> 
            </view>
        </view> 

        <view class="item">
            <view class="itemtitle">Confirm New Password</view>
            <view class="itemcontents"> 
                <image src="/static/finger-scan.png" alt="logo" class="img"  />
                <input class="uni-input userinput" focus type="password"  v-model="newpwd2"   placeholder="My Password"  />
                <image src="/static/Show_password.png" alt="logo" class="img imgfloatright"  /> 
            </view>
        </view> 
 

        <view class="vbtm">
            <view class="btn" @click="update">Update Password</view>
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
        },
	}
</script>
  
<style scoped lang="scss">
	 .maindiv{ 
        min-height: 100vh;
        padding: 15rpx; 
        background-color: #F8F8F8;
        .vbtm{
            position: fixed;
            bottom: 0;
            height: 154rpx;
            width:750rpx;
            border-top: 1px solid #E9EAEC; 
            background: var(--Color-Surface-Primary, #FEFEFE);
            
            .btn{ 
                margin-left: 35rpx;
                margin-top: 20rpx;
                height: 80rpx; 
                line-height: 80rpx;
                width: 650rpx;
                text-align: center;
                border-radius: 100px;
                background: #EFC462;
                color:white;
            }
        }
        .item{
            margin-top: 20rpx;
            .itemtitle{
                color: var(--Color-Gray-Gray-600, #475467);
                font-family: Nunito;
                font-size: var(--Body-Small-Size, 12px);
                font-style: normal;
                font-weight: 400;
                line-height: var(--Body-Small-Line-Height, 16px); /* 133.333% */
                letter-spacing: -0.2px;
            }
            .itemcontents{
                display: flex;
                border-radius: 8px; 
                border: 1px solid #DADADA;
                background: #FFF;
                margin-top: 20rpx;
                height: 70rpx;
                line-height: 70rpx;
                .userinput{
                    height: 70rpx;
                    line-height: 70rpx;
                    margin-left: 20rpx;
                }
                .imgfloatright{
                    position: absolute;
                    right: 30rpx;
                }
                .itemcontent{  
                    display: flex;
                    margin-top: 20rpx;
                    margin-left: 10rpx;
                }
                .img{ 
                    width: 36rpx;
                    height: 36rpx;  
                    margin-left: 20rpx; 
                    margin-top: 15rpx;
                }
                .msg{ 
                    color: #4F5464;
                    font-family: Nunito;
                    font-size: 14px; 
                    font-style: normal;
                    font-weight: 600; 
                    margin-bottom: 10rpx;
                }
            }
        }
        .userinfo{
            .name{
                color: #101828; 
                font-family: Nunito;
                font-size: 20px;
                font-style: normal;
                font-weight: 600;
                line-height: normal;
                letter-spacing: -0.4px;
            }
            .position{
                color: var(--Color-Gray-Gray-500, #667085);
                font-family: Nunito;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 140%; /* 16.8px */
            }
        } 
        .header{
            display: flex;
            justify-content: space-between;
            margin-bottom: 20rpx;
            
            .arrowimg{
                width:60rpx;
                height: 60rpx;
            }
            .title{
                width: 700rpx;
                text-align: center;
                color: #101828; 
                font-family: Nunito;
                font-size: 18px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
            }

        } 
     }
</style>
