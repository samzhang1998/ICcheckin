<template>
	<view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="preWeek" />
            <text>Employee Management</text> 
        </view> 
        <view class="content">
            <view class="sub_title">Employee List</view>
            <view class="user" v-for="(user, index) in filteredUsers" :key="index" @click="edituser(user)">
                <view class="user_title">
                    <view class="name">{{ user.firstName }} {{ user.lastName }}</view>
                    <image
                        src="/static/Trash.png"
                        alt="trash"
                        class="delete" 
                        @click.stop="confirm(user.userId)"
                    ></image>
                </view>
                <view class="position">{{ user.title }}</view>
            </view> 
        </view>
        <button @click="addUser">Add Employee</button>
        <uni-popup ref="popup"  backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0" >
            <view class="popup-content">
                <view class="sub_title1">Delete this user</view>
                <view class="btns">
                    <view class="btn btn-cancel" @click="closeConfirm" >Cancel</view>
                    <view class="btn btn-confirm" @click="deleteUser()" >Confirm</view> 
                </view>
            </view>
        </uni-popup>
	</view>
</template>
  
<script>
import { getUsersApi } from "@/api/users";
import { deleteUser } from "@/api/admin";
	export default {
        data() {
            return { 
               users:[],
               selectedUser: ""
            };
        },
        computed: {
            filteredUsers() {
                return this.users.filter(user => !user.email.includes("deleted"));
            }
        },
		methods: {
            preWeek(){
                uni.switchTab({ url: "/pages/profile/index" })
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
            async deleteUser () {
                try {
                    const res = await deleteUser(this.selectedUser);
                    if (res.statusCode === 200) {
                        console.log("success delete:", res);
                        this.$refs.popup.close();
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
            },
            confirm (id) {
                this.$refs.popup.open("bottom");
                this.selectedUser = id;
                console.log("selected id", this.selectedUser);
            },
            closeConfirm () {
                this.$refs.popup.close()
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
            font-family: Nunito;
            font-size: 35rpx;
            font-weight: 700;
            line-height: 140%;
            text-align: center;
        }
        .content{
            width: 600rpx;
            min-height: 69vh;
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
                    width: 30rpx;
                    height: 30rpx;
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
        .popup-content{
            border-top-left-radius: 40rpx;
            border-top-right-radius: 40rpx; 
            background-color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30rpx;
            padding: 40rpx;
            text-align: center;
            .btns{
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                gap: 20rpx;
                font-family: Nunito;
                font-size: 30rpx;
                font-style: normal;
                font-weight: 500;
                line-height: 20px;
                letter-spacing: 0.1px;
                .btn{
                    width: 300rpx;
                }
                .btn-cancel{
                    border: 1px solid #838383;
                    background-color: white;
                    color:#000;
                }
            }
            .sub_title1{
                color: #000;
                font-family: Nunito;
                font-size: 40rpx;
                font-style: normal;
                font-weight: 600;
                line-height: 16px;
                letter-spacing: -0.2px;
            }
            .btn{  
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                height: 85rpx; 
                line-height: 80rpx;
                width: 630rpx;
                font-family: Nunito;
                font-size: 30rpx;
                font-style: normal;
                font-weight: 500;
                line-height: 20px;
                letter-spacing: 0.1px;
                border-radius: 100px;
                background: #EFC462;
                color:white;
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
