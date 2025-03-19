<template>
	<view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="preWeek" />
            <text>Employee Management</text> 
        </view> 
        <view class="content">
            <view class="sub_title">Employee List</view>
            <view class="user" v-for="(user, index) in users" :key="index" @click="edituser(user)">
                <view class="user_title">
                    <view class="name">{{ user.firstName }} {{ user.lastName }}</view>
                    <text class="delete" @click.stop="deleteUser(user.userId)">Delete user</text>
                </view>
                <view class="position">{{ user.title }}</view>
            </view> 
        </view>
        <button @click="addUser">Add Employee</button>
	</view>
</template>
  
<script>
import { getUsersApi } from "@/api/users";
import { deleteUser } from "../../../api/admin";
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
                        console.log("employees:", this.users)
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
            },
            async deleteUser (id) {
                try {
                    const res = await deleteUser(id);
                    console.log("id:", id);
                    if (res.statusCode === 200) {
                        console.log("success delete:", res)
                        const pages = getCurrentPages();
                        const currentPage = pages[pages.length - 1];
                        uni.reLaunch({
                            url: '/' + currentPage.route
                        });
                    } else {
                        console.log(res);
						uni.showToast({ title: "Fail to delete", icon: "none" });
                    }
                } catch (error) {
                    console.error("error:", error);
					uni.showToast({ title: "Error of deleting", icon: "none" });
                }
            },
            addUser () {
                uni.navigateTo({url: "/pages/manager/management/add"});
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
                .user_title {
                    width: 540rpx;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                }
                .name{
                    color: #141414; 
                    font-family: Nunito;
                    font-size: 26rpx;
                    font-style: normal;
                    font-weight: 600;
                    line-height: normal;
                    letter-spacing: -0.28px;
                }
                .delete{
                    color: #141414;  
                    font-family: Nunito;
                    font-size: 22rpx;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    letter-spacing: -0.24px;
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
            margin-top: 30rpx;
            margin-bottom: 30rpx;
        }
    }
</style>
