<template>
    <view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="back"/>
            <text>{{ department.departmentName }} Team</text> 
        </view>
        <view class="search">
            <image src="/static/Search.png" alt="search"></image>
            <input v-model="selectedUser" placeholder="Search employee..." />
        </view>
        <view class="list" v-for="(user, index) in filteredList" :key="index">
            <view class="records">
                <view class="init">{{ getInitial(user.fullName) }}</view>
                <view class="user">
                    <text class="name">{{ user.fullName }}</text>
                    <text class="email">{{ user.email }}</text>
                </view>
            </view>
            <view class="records">
                <view class="record">
                    <image src="/static/late.png" alt="late"></image>
                    {{ user.lateDays }}
                </view>
                <view class="record">
                    <image src="/static/absence.png" alt="absence"></image>                        
                    {{ user.absentDays }}
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data () {
            return {
                department: {},
                selectedUser: ""
            }
        },
        computed: {
            filteredList () {
                if (!this.selectedUser) {
                    return this.department.users
                } else {
                    const keyword = this.selectedUser.toLowerCase();
                    return this.department.users.filter(item =>
                        item.fullName.toLowerCase().includes(keyword)
                    );
                }
            }
        },
        methods: {
            back () {
                uni.switchTab({ url: "/pages/home/admin-attendance" });
            },
            getInitial(name) {
                return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '';
            }
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
        background: #FFF;
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
            border-bottom: 1px solid #EAECF0;
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
    .search {
        width: 640rpx;
        padding: 20rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10rpx;
        border-radius: 6px;
        border: 1px solid #F1F1F1;
        background: #FFF;
        image {
            width: 35rpx;
            height: 35rpx;
        }
        input {
            color: #808080;
            font-family: Inter;
            font-size: 22rpx;
            font-style: normal;
            font-weight: 400;
            line-height: 140%;
            border: none;
            outline: none;
        }
    }
    .list {
        width: 680rpx;
        padding: 20rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .records {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10rpx;
            .record {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 10rpx;
                margin-left: 20rpx;
                color: #333;
                font-family: Inter;
                font-size: 24rpx;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                image {
                    width: 35rpx;
                    height: 35rpx;
                }
            }
            .init {
                width: 60rpx;
                height: 60rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 30px;
                border: 1px solid #FFF;
                background: #EFC462;
                color: #FFF;
                font-family: Inter;
                font-size: 24rpx;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
            }
            .user {
                display: flex;
                flex-direction: column;
                align-items: start;
                gap: 10rpx;
                .name {
                    color: #333;
                    font-family: Inter;
                    font-size: 30rpx;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                }
                .email {
                    color: #808080;
                    font-family: Inter;
                    font-size: 24rpx;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                }
            }
        }
    }
</style>