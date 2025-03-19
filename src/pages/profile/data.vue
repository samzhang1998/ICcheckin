<template>
	<view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="back"/>
            <text>Personal Data</text> 
        </view>
        <view class="profile">
            <view class="userinfo">
                <view class="name">{{user.firstName}} {{user.lastName}}</view>
                <view class="position">Details about my personal data</view>            
            </view>
            <view class="item">
                <view class="itemtitle">First Name</view>
                <view class="itemcontents"> 
                    <image src="/static/user1.png" alt="logo" class="img"  />
                    <input class="userinput"   v-model="user.firstName"  /> 
                </view>
            </view>
            <view class="item">
                <view class="itemtitle">Last Name</view>
                <view class="itemcontents"> 
                    <image src="/static/user1.png" alt="logo" class="img"  />
                    <input class="userinput"  v-model="user.lastName" /> 
                </view>
            </view>
            <view class="item">
                <view class="itemtitle">Contact Number</view>
                <view class="itemcontents"> 
                    <image src="/static/calendar.png" alt="logo" class="img"  />
                    <input class="userinput"   v-model="user.phone"  />               
                </view>
            </view>
            <view class="item">
                <view class="itemtitle">Title</view>
                <view class="itemcontents"> 
                    <image src="/static/keyboard.png" alt="logo" class="img"  /> 
                    <input class="userinput"   v-model="user.title"  />
                </view>
            </view>
            <view class="item">
                <view class="itemtitle">Department</view>
                <view class="itemcontents"> 
                    <image src="/static/keyboard.png" alt="logo" class="img"  /> 
                    <uni-data-select
                        class="userinput" 
                        v-model="user.departmentId"
                        :localdata="range" 
                        :clear="false"
                        placeholder="select department"
                    ></uni-data-select>                 
                </view>
            </view>
        </view>
        <view class="btn">
            <button @click="update">Update</button>
        </view>
	</view>
</template>
  
<script>
    import {updateUserApi, getUserDetailApi} from "@/api/users";
    import {getDepartmentsApi } from "@/api/departments";
	export default {
        data() {
            return {  
                titles: [
                    { value: "Employee", text: "Employee" },
                    { value: "Admin", text: "Admin" },
                    { value: "Manager", text: "Manager" },
                ],
                range: [
                    { value: 0, text: "篮球" },
                    { value: 1, text: "足球" },
                    { value: 2, text: "游泳" },
                ],
               event: {
                    activetime:6,
                    name:"SEO Meeting with Lee Massage",
                    date:"24 Feb 2025",
                    time:"3pm - 4pm",
                    note:"note",
                    righttxt:"Shuoqi Wang"
                }  , 
                user:{}
            };
        },
		methods: { 
            back(){
                uni.navigateBack({
                    delta: 1
                });
            },
            getDeparts(){
                this.range  = []
                getDepartmentsApi().then((res)=>{
                    if(res.status ==1){
                        let data = res.data
                        for(let i =0; i < data.length; i++){
                        let item = {
                            value: data[i].departmentId,
                            text: data[i].departmentName,
                        }
                        if (this.user.department ==  data[i].departmentName){
                            this.user.departmentId = data[i].departmentId
                        }
                        this.range.push(item)
                    }
                    }else{
                        uni.showModal({
                            content: res.msg,
                            confirmText: 'OK', 
                            showCancel:false
                        }) 
                        return 
                    }                    
                })
            },
            getUserDetail(){ 
                getUserDetailApi(this.user.id).then((res)=>{ 
                    if(res.status ==1){
                        this.user = res.data
                        this.getDeparts()

                    }else{
                        uni.showModal({
                            content: res.msg,
                            confirmText: 'OK', 
                            showCancel:false
                        }) 
                        return 
                    }                    
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
                this.user.id = uni.getStorageSync("id");  
                this.user.lastName = uni.getStorageSync("lastName");  
                this.user.firstName = uni.getStorageSync("firstName");  
                this.user.phone = uni.getStorageSync("phone"); 
                this.user.department = uni.getStorageSync("department");  
                this.user.title = uni.getStorageSync("title");  
                this.user.role = uni.getStorageSync("role");    
            },
            update(){
                let data = {
                    userId: this.user.id,
                    firstName: this.user.firstName,
                    lastName: this.user.lastName,
                    title: this.user.title,
                    phoneNumber: this.user.phone,
                    departmentId: this.user.departmentId,
                }
                updateUserApi(data).then((res)=>{
                    console.log(res)
                    if(res.status == 1){
                        uni.setStorageSync("lastName",  this.user.lastName);  
                        uni.setStorageSync("firstName" ,  this.user.firstName);  
                        uni.setStorageSync("phone" ,  this.user.phone);
                        uni.setStorageSync("department" ,  this.user.department);  
                        uni.setStorageSync("title" ,  this.user.title);  
                        uni.showToast({
                            title: "Saved",
                            icon: "success",
                            duration: 3000,
                        });
                    }else{
                        uni.showModal({
                            content: res.msg,
                            confirmText: 'OK', 
                            showCancel:false
                        }) 
                        return
                    }
                    
                }) 
            }
		},
        onShow () {
            this.getUserInfo()
            this.getUserDetail() 
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
                height: 60rpx;
                gap: 20rpx;
                .userinput{
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
    }
</style>
