<template>
	<view class="maindiv">
        <view class="header">
            <image src="/static/back_icon.png" alt="logo" class="arrowimg arrowleft" @click="back"/>
            <view class="title">Personal Data</view> 
        </view> 
        <view class="userinfo">
            <view class="name">{{user.firstName}} {{user.lastName}}</view>
            <view class="position">Details about my personal data</view> 
            
        </view> 

        <view class="item">
            <view class="itemtitle">First Name</view>
            <view class="itemcontents"> 
                <image src="/static/user.png" alt="logo" class="img"  />
                <input class="uni-input userinput" focus  v-model="user.firstName"  /> 
            </view>
        </view> 

        <view class="item">
            <view class="itemtitle">Last Name</view>
            <view class="itemcontents"> 
                <image src="/static/user.png" alt="logo" class="img"  />
                <input class="uni-input userinput" focus v-model="user.lastName" /> 
            </view>
        </view> 

        <view class="item">
            <view class="itemtitle">Contact Number</view>
            <view class="itemcontents"> 
                <image src="/static/calendar.png" alt="logo" class="img"  />
                <input class="uni-input userinput" focus  v-model="user.phone"  />
               
            </view>
        </view> 

        <view class="item">
            <view class="itemtitle">Title</view>
            <view class="itemcontents"> 
                <image src="/static/keyboard.png" alt="logo" class="img"  /> 
                <uni-data-select
                class="uni-input userinput inputdepart" 
                    v-model="user.title"
                    :localdata="titles" 
                    :clear="false"
                    placeholder="select title"
                    ></uni-data-select>
            </view>
        </view> 

        <view class="item">
            <view class="itemtitle">Department</view>
            <view class="itemcontents"> 
                <image src="/static/keyboard.png" alt="logo" class="img"  /> 
                <uni-data-select
                class="uni-input userinput inputdepart" 
                    v-model="user.departmentId"
                    :localdata="range" 
                    :clear="false"
                    placeholder="select department"
                    ></uni-data-select>
                 
            </view>
        </view> 


        <view class="vbtm">
            <view class="btn" @click="update">Update</view>
        </view> 

	</view>
</template>
  
<script>
    import {updateUserApi, getUserDetailApi} from "@/api/users";
    import {getDepartmentsApi } from "@/api/departments";
	export default {
        data() {
            return {  
                titles:[
                    { value: "Employee", text: "Employee" },
                    { value: "Admin", text: "Admin" },
                    { value: "Manager", text: "Manager" },
                ],
                range: [
                    { value: 0, text: "篮球" },
                    { value: 1, text: "足球" },
                    { value: 2, text: "游泳" },
                ],
               event:   {
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
                         uni.setStorageSync("lastName",  this.user.lastName );  
                        uni.setStorageSync("firstName" ,  this.user.firstName );  
                         uni.setStorageSync("phone" ,  this.user.phone );  

                         uni.setStorageSync("department" ,  this.user.department );  
                         uni.setStorageSync("title" ,  this.user.title );  
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
                .inputdepart{
                    width: 630rpx; 
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
