<template>
    <view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="back"/>
            <text>Office Setting</text> 
        </view>
        <view v-for="(office, index) in offices" :key="index" class="office">
            <text class="sub_title">Office {{ index+1 }}</text>
            <text>Office Name</text>
            <input 
                v-model="office.companyName"
            />
            <text>Office Address</text>
            <input 
                v-model="office.address"
            />
            <!-- <button>Save Change</button> -->
        </view>
    </view>
</template>

<script>
    import { getOfficeRequest } from '@/api/admin';
    export default {
        data () {
            return {
                offices: []
            }
        },
        methods: {
            back(){
                uni.navigateBack({
                    delta: 1
                });
            },
            async getOfficeInfo () {
                try{
                    const res = await getOfficeRequest();
                    if (res.statusCode === 200) {
                        this.offices = res.data.data;
                        console.log("office:", this.offices);
                    } else {
                        console.log(res);
						uni.showToast({ title: "Faile to get office info!", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Fail to get office info!", icon: "none" });
                }
            }
        },
        onShow () {
            this.getOfficeInfo();
        }
    }
</script>

<style scoped lang="scss">
    .maindiv {
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
        .office {
            width: 600rpx;
            padding: 30rpx 40rpx;
            border-radius: 10px;
            background-color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10rpx;
            .sub_title {
                width: 600rpx;
                color: #101828;
                font-family: Nunito;
                font-size: 26rpx;
                font-style: normal;
                font-weight: 600;
                line-height: 16px;
                letter-spacing: -0.2px;
            }
            text {
                width: 600rpx;
                color: #101828;
                font-family: Nunito;
                font-size: 22rpx;
                font-style: normal;
                font-weight: 600;
                line-height: 16px;
                letter-spacing: -0.2px;
            }
            input {
                width: 560rpx;
                border-radius: 8px;
                padding: 20rpx;
                border: 1px solid #EAECF0;
                background: #F9FAFB;
                color: #344054;
                font-family: Inter;
                font-size: 22rpx;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                letter-spacing: -0.5px;
            }
            // button {
            //     display: flex;
            //     width: 600rpx;
            //     height: 85rpx;
            //     justify-content: center;
            //     align-items: center;
            //     flex-shrink: 0;
            //     border-radius: 100px;
            //     border: none;
            //     background: #EFC462;
            //     color: #fff;
            //     text-align: center;
            //     font-family: Nunito;
            //     font-size: 30rpx;
            //     font-style: normal;
            //     font-weight: 600;
            //     line-height: 20px;
            //     letter-spacing: 0.1px;
            //     margin-top: 30rpx;
            // }
        }
    }
</style>