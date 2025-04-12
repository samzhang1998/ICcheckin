<template>
    <view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="back"/>
            <text>{{ department.departmentName }} Team</text> 
        </view>
    </view>
</template>

<script>
    export default {
        data () {
            return {
                date: "",
                department: {},
                records: []
            }
        },
        methods: {
            back () {
                uni.switchTab({ url: "/pages/home/admin-attendance" });
            },
        },
        onLoad () {
            const eventChannel = this.getOpenerEventChannel()
            eventChannel.on('team', (data) => {
                this.department = data;
                console.log("this team", this.department)
            })
        }
    }
</script>
    
<style scoped lang="scss">
    .maindiv{
        width: 750rpx;
        padding-bottom: 20rpx;
        display: flex;
        flex-direction: column;
        align-items: center; 
        gap: 30rpx;
        background: #FBFBFB;
        .title {
            width: 750rpx;
            height: 150rpx;
            padding-bottom: 30rpx;
            background: #FFF;
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
            font-weight: 600;
            line-height: 140%;
            text-align: center;
        }
    }
</style>