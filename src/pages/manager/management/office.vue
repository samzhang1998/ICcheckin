<template>
    <view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="back"/>
            <text>Office Setting</text> 
        </view>
        <view v-for="(office, index) in offices" :key="index" class="office">
            <view class="sub_title">
                <text class="office1">Office {{ index+1 }}</text>
                <image src="/static/Trash.png" alt="trash" @click="confirm(office.addressId)"></image>
            </view>
            <text class="name">Office Name</text>
            <input 
                v-model="office.companyName"
                disabled
            />
            <text class="name">Office Address</text>
            <input 
                v-model="office.address"
                disabled
            />
        </view>
        <button @click="addOffice">Add Office</button>
        <uni-popup ref="popup"  backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0" >
            <view class="popup-content">
                <view class="sub_title1">Delete this office</view>
                <view class="btns">
                    <view class="btn btn-cancel" @click="closeConfirm" >Cancel</view>
                    <view class="btn btn-confirm" @click="deleteOffice" >Confirm</view> 
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
    import { getOfficeRequest, deleteCompany } from '@/api/admin';
    export default {
        data () {
            return {
                offices: [],
                selectedOffice: ""
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
                    uni.showToast({ title: "Error of getting office info!", icon: "none" });
                }
            },
            confirm (id) {
                this.selectedOffice = id;
                this.$refs.popup.open("bottom")
            },
            closeConfirm () {
                this.$refs.popup.close()
            },
            async deleteOffice () {
                try {
                    const res = await deleteCompany(this.selectedOffice);
                    if (res.statusCode === 200) {
                        console.log("success delete:", res);
                        this.$refs.popup.close();
                        uni.reLaunch({ url: "/pages/manager/management/office" });
                    } else {
                        console.log(res);
						uni.showToast({ title: "Faile to delete!", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Error of deleting!", icon: "none" });
                }
            },
            addOffice () {
                uni.navigateTo({ url: "/pages/manager/management/add-office"});
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
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                .office1 {
                    color: #101828;
                    font-family: Nunito;
                    font-size: 26rpx;
                    font-style: normal;
                    font-weight: 600;
                    line-height: 16px;
                    letter-spacing: -0.2px;
                }
                image {
                    width: 30rpx;
                    height: 30rpx;
                }
            }
            .name {
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
                font-size: 20rpx;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                letter-spacing: -0.5px;
            }
        }
        button {
            display: flex;
            width: 600rpx;
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
            margin-bottom: 30rpx;
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
    }
</style>