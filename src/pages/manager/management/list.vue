<template>
	<view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="preWeek" />
            <text>Employee Management</text> 
        </view> 
        <view class="content">
            <view class="sub_title">Employee List</view>
            <view class="user" v-for="(user, index) in users" :key="index" @click="edituser(user)">
                <view class="name">{{ user.firstName }} {{ user.lastName }}</view>
                <view class="position">{{ user.title }}</view>
            </view> 
        </view>
	</view>
</template>
  
<script>
import { getUsersApi } from "@/api/users";
	export default {
        data() {
            return { 
               users:[ 
               ] 
            };
        },
		methods: {
            preWeek(){
                uni.navigateBack({
                    delta: 1
                });
            }, 
            getAllusers(){
                getUsersApi().then((res)=>{ 
                    if(res.status ==1){
                        this.users = res.data

                    }
                    
                }) 
            },  
            update(){
                uni.showToast({
                    title: "Saved",
                    icon: "success",
                    duration: 3000,
                });
            },
            edituser(user){
                uni.navigateTo({
                    url: '/pages/manager/management/edit?userid='+user.userId // 目标页面的路径
                });
            }
		},
        mounted() { 
            this.getAllusers()
        }, 
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
            font-size: 35rpx;
            font-weight: 700;
            line-height: 140%;
            text-align: center;
        }
        .content{
            width: 600rpx;
            padding: 30rpx 40rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20rpx;
            border-radius: 10px;
            background: #FFF;
            margin-top: 30rpx;
            .sub_title{
                width: 600rpx;
                color: #2B2B2B; 
                font-family: Nunito;
                font-size: 26rpx;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                letter-spacing: -0.5px;
            }
            .user {
                width: 540rpx;
                padding: 20rpx 30rpx;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                align-items: start;
                gap: 10rpx;
                border: 1px solid #EAECF0;
                background: #F9FAFB;
                .name{
                    color: #141414; 
                    font-family: Nunito;
                    font-size: 26rpx;
                    font-style: normal;
                    font-weight: 600;
                    line-height: normal;
                    letter-spacing: -0.28px;
                }
                .position{
                    color: #141414;  
                    font-family: Nunito;
                    font-size: 22rpx;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    letter-spacing: -0.24px;
                }
            }
        } 
    }
</style>
