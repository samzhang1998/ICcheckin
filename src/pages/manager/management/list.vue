<template>
	<view class="maindiv">
        <view class="header">
            <image src="/static/back_icon.png" alt="logo" class="arrowimg arrowleft" @click="preWeek"/>
            <view class="title">Employee Management</view> 
        </view> 
        <view class="content">
          <view class="title">Employee List</view>
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
                    this.users = res
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
        min-height: 100vh;
        padding: 15rpx; 
        background-color: #F8F8F8;
        .content{
            min-height: 80vh;
            padding:25rpx;
            border-radius: 8px;
            background: #FFF;
            .title{
                color: #2B2B2B; 
                font-family: Nunito;
                font-size: 14px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                letter-spacing: -0.5px;
            }
            .user{
                margin-top: 25rpx;
                padding: 15rpx;
                border-radius: 8px;
                border: 1px solid #EAECF0;

                background: #F9FAFB;
                .name{
                    color: var(--Color, #141414); 
                    font-family: Nunito;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: normal;
                    letter-spacing: -0.28px;
                }
                .position{
                    color: #141414;  
                    font-family: Nunito;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    letter-spacing: -0.24px;
                }
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
