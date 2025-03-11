<template>
	<view class="maindiv">
        <view class="header">
            <image src="/static/back_icon.png" alt="logo" class="arrowimg arrowleft" @click="back"/>
            <view class="title">Attendance Report【接口不通】</view> 
        </view> 

        <view class="btns">
            <view class="actiontbn" :class="{'activetbn':btnindex==1}" @click="activebtns(1)">Weekly</view>
            <view class="actiontbn" :class="{'activetbn':btnindex==2}" @click="activebtns(2)">Quartly</view>
            
        </view>


        <view class="content">
          <view class="title">Employee List</view>
          <view class="user" v-for="(user, index) in reports" :key="index">
            <view class="name">{{ user.name }}</view> 
          </view>  
          <view class="title">Past Report</view>
          <view class="user" v-for="(user, index) in reports" :key="index">
            <view class="name">{{ user.name }}</view> 
          </view> 
        </view>
	</view>
</template>
  
<script>
import { getQuarterApi, getWeekApi} from "@/api/reports";
	export default {
        data() {
            return { 
                btnindex:1,
                reports:[
                    {
                        name:"Weekly Report 24/02/2025 - 28/02/2025",
                        
                    },
                    {
                        name:"Weekly Report 24/02/2025 - 28/02/2025", 
                    },
                ] 
            };
        },
		methods: { 
            back(){
                uni.navigateBack({
                    delta: 1
                });
            },
            getWeekData(){
                getWeekApi().then((res)=>{
                    console.log(res)
                })
            },
            getQuarteData(){  
                let params = {
                    numQuarter : this.getCurrentQuarter()
                }
                getQuarterApi(params).then((res)=>{
                    console.log(res)
                })
            },
            getCurrentQuarter() {
                const month = new Date().getMonth() + 1; // 获取当前月份 (1-12)
                return Math.ceil(month / 3); // 计算当前季度
            },
            testf(){
                uni.request({
                    url: 'api/user/list',
                    method: 'GET',
                    header:{
                        "Content-Type": "application/json",
                        "Authorization":"Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbjFAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDEyNjA2ODQsImV4cCI6MTc0MTI2NDI4NH0.Lh3Qg10GL2KwS-efbh8EmnidlFTTE-iKpeyxQiJ4kc8"

                    },
                    data: {
                        page: 1,
                        limit: 10,
                    },
                    success: (res) => {
                        console.log('请求成功:', res.data);
                    },
                    fail: (err) => {
                        console.error('请求失败:', err);
                    },  
                });
            },
            activebtns(index){
                this.btnindex = index

            },  
            update(){
                uni.showToast({
                    title: "Saved",
                    icon: "success",
                    duration: 3000,
                });
            }
		},
        mounted() { 
            this.getQuarteData()
        }, 
	}
</script>
  
<style scoped lang="scss">
	 .maindiv{ 
        min-height: 100vh;
        padding: 15rpx; 
        background-color: #F8F8F8;
        .btns{
            margin-top: 40rpx;
            margin-bottom: 40rpx;
            display: flex;
            justify-content: space-between;
            border-radius: 30rpx;
            background-color:white;
            .actiontbn{
                width: 350rpx;
                height: 60rpx;
                color: #475467;
                
                text-align: center;
                line-height: 60rpx; 
                font-family: Nunito;
                font-size: 12px;
                font-style: normal;
                font-weight: 500;
                
            }
            .activetbn{
                border-radius: 30rpx;
                color:white;
                background-color: #EFC462;
            }
        }
       
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
                margin-top: 25rpx;
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
                    line-height: 110rpx;
                    height: 110rpx;
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
