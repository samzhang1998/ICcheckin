<template>
    <view class="attendance"> 
        <view class="title">
            <view class="title_content">
                <text class="name">{{ userFirstName }} {{ userLastName }}</text>
                <text class="role">{{userinfo.region}} - {{ userRole[0] }}</text>
            </view>
            <view class="img_box" @click="showNotification">
                <image src="/static/Bell_icon.png" alt="bell"></image>
            </view>
        </view>
        <view class="select_box">
            <view class="region_select">
                <view class="select" @click="showRegion = !showRegion" :class="{active: showRegion}">
                    {{ selectedRegion.name || "All Area"}}
                    <image src="/static/Expand_down.png" alt="down"></image>
                </view>
                <view v-if="showRegion" class="selection">
                    <view v-for="(region, index) in region" :key="index" @click="selectRegion(region)">
                        <text>{{ region.name }}</text>
                    </view>
                </view>
            </view>
            <image src="/static/Date_range_fill.png" alt="date" @click="showPicker = !showPicker"></image>
        </view>
        <view style="width: 680rpx;">
            <uni-datetime-picker
                v-model="dateRange"
                type="daterange"
                :clear-icon="false"
                v-if="showPicker"
                start-placeholder="Start"
                end-placeholder="End"
                @change="onDateConfirm"
            />
        </view>
        <view class="search">
            <image src="/static/Search.png" alt="search"></image>
            <input v-model="selectedUser" placeholder="Search employee..." />
        </view>
        <button @click="toReport">
            <image src="/static/File_dock_light.png" alt="file"></image>
            Attendance Report
        </button>
        <view v-if="selectedUser" class="user_select">
            <view v-for="(user, index) in filteredUsers" :key="index" class="box1" @click="toUser(user)">
                <view class="records1">
                    <view class="init">{{ getInitial(user.fullName) }}</view>
                    <view class="user">
                        <text class="name">{{ user.fullName }}</text>
                        <text class="email">{{ user.email }}</text>
                    </view>
                </view>
                <view class="records1">
                    <view class="record1">
                        <image src="/static/late.png" alt="late"></image>
                        {{ user.lateDays }}
                    </view>
                    <view class="record1">
                        <image src="/static/absence.png" alt="absence"></image>
                        {{ user.absentDays }}
                    </view>
                </view>
            </view>
        </view>
        <view v-else class="list">
            <view class="info" v-for="(item, index) in attendance" :key="index">
                <view class="box">
                    <text class="info_h1">{{ item.regionName }}</text>
                    <text class="info_p">Manager: {{ item.regionManager }}</text>
                </view>
                <view class="box" v-for="(department, i) in item.departments" :key="i" @click="showDetail(department)">
                    <text class="info_h2">{{ department.departmentName }}</text>
                    <text class="info_p">Employee: {{ department.departmentSize }}</text>
                    <view class="records">
                        <view class="record">
                            <view class="record_title">
                                <image src="/static/late.png" alt="late"></image>
                                Late
                            </view>
                            <text>{{ department.late }}</text>
                        </view>
                        <view class="record">
                            <view class="record_title">
                                <image src="/static/absence.png" alt="absence"></image>
                                Absence
                            </view>
                            <text>{{ department.absent }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import { getAttendancesStatistics, getAllRegion } from '@/api/admin';
    export default {
        data () {
            return {
                userinfo:{},
                date: "",
                userFirstName: "",
                userLastName: "",
                userRole: "",
                region: [],
                selectedRegion: {},
                showRegion: false,
                selectedUser: "",
                attendance: [],
                showPicker: false,
                dateRange:[]
            }
        },
        computed: {
            filteredUsers() {
                return this.attendance
                .flatMap(region => region.departments)
                .flatMap(dept => dept.users)
                .filter(user => user.fullName.includes(this.selectedUser));
            }
        },
        methods: {
            showNotification () {
                uni.navigateTo({ url: "/pages/index/notification" });
            },
            async getRegion () {
                try {
                    const res = await getAllRegion();
                    if (res.data.status === 1) {
                        this.region = res.data.data
                        this.region.unshift({
                            id: '',
                            name: 'All Area'
                        })
                        this.selectedRegion = this.region[0]
                    } else if (res.statusCode === 403) {
                        uni.navigateTo({
                            url: '/pages/index/index'
                        });
                    } else {
                        console.log("Fail:", res);
                        uni.showToast({ title: "Fail to get regions", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Error of getting regions", icon: "none" });
                }
            },
            async getAttendenceInfo () {
                try {
                    const dataSend = {
                        regionId: this.selectedRegion.regionId,
                        start: this.dateRange[0],
                        end: this.dateRange[1]
                    }
                    console.log("data:", dataSend)
                    const res = await getAttendancesStatistics(dataSend);
                    if (res.data.status === 1) {
                        this.attendance = res.data.data
                        console.log("attendance:", this.attendance)
                    } else if (res.statusCode === 403) {
                        uni.navigateTo({
                            url: '/pages/index/index'
                        });
                    } else {
                        console.log("Fail:", res);
                        uni.showToast({ title: "Fail to get attendances", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Error of getting attendances", icon: "none" });
                }
            },
            selectRegion (item) {
                this.selectedRegion = item;
                this.getAttendenceInfo();
                this.showRegion = false;
            },
            onDateConfirm (e) {
                this.dateRange = e;
                this.getAttendenceInfo();
            },
            showDetail (item) {
                uni.navigateTo({ 
                    url: `/pages/home/attendance-detail`,
                    success: (res) => {
                        res.eventChannel.emit('payload', {
                            user: item,
                            dateRange: this.dateRange
                        })
                    }
                })
            },
            getInitial(name) {
                return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '';
            },
            toReport () {
                uni.navigateTo({ url: "/pages/manager/report" });
            },
            toUser (user) {
                uni.navigateTo({ 
                    url: `/pages/home/user-attendance`,
                    success: (res) => {
                        res.eventChannel.emit('payload', {
                            user: user,
                            dateRange: this.dateRange
                        })
                    }
                })
            }
        },
        onLoad () {
            this.userFirstName = uni.getStorageSync("firstName");
            this.userLastName = uni.getStorageSync("lastName");
            this.userRole = uni.getStorageSync("role")
        },
        onShow () {
            this.getRegion();
            this.getAttendenceInfo();
            this.userinfo = uni.getStorageSync("userinfo")
        }
    }
</script>

<style scoped lang="scss">
    .attendance {
        width: 750rpx;
        min-height: 100vh;
        padding: 20rpx 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30rpx;
        background: #FBFBFB;
    }
    .title {
        width: 680rpx;
        background: #FBFBFB;
        position: sticky;
        top: 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: start;
        padding: 100rpx 35rpx 20rpx 35rpx;
        z-index: 100;
        .title_content {
            display: flex;
            flex-direction: column;
            align-items: start; 
        }
        .name {
            color: #333;
            font-family: Inter;
            font-size: 50rpx;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
        }
        .role {
            color: #838383;
            font-family: Inter;
            font-size: 30rpx;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
        }
    }
    .img_box {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        border: 1px solid #F1F1F1;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        image {
            width: 45rpx;
            height: 45rpx;
        }
    }
    .select_box {
        width: 680rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: start;
        image {
            width: 40rpx;
            height: 40rpx;
        }
        .region_select {
            width: 400rpx;
        }
        .select {
            width: 360rpx;
            padding: 20rpx;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-radius: 6px;
            border: 1px solid #F1F1F1;
            background: #FFF;
            color: #333;
            font-family: Inter;
            font-size: 30rpx;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            image {
                width: 30rpx;
                height: 30rpx;
            }        
        }
        .active {
            border-bottom: none;
            border-radius: 6px 6px 0 0;
        }
        .selection {
            width: 360rpx;
            padding: 20rpx;
            display: flex;
            flex-direction: column;
            align-items: start;
            gap: 20rpx;
            border-radius: 0 0 6px 6px;
            border: 1px solid #F1F1F1;
            background: #FFF;
            text {
                color: #333;
                font-family: Inter;
                font-size: 30rpx;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }
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
    button {
        width: 680rpx;
        height: 85rpx;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 15rpx;
        border: none;
        border-radius: 8px;
        background: #EFC462;
        color: #FFF;
        font-family: Inter;
        font-size: 30rpx;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        image {
            width: 35rpx;
            height: 35rpx;
        }
    }
    .list {
        display: flex;
        flex-direction: column;
        gap: 20rpx;
    }
    .info {
        display: flex;
        flex-direction: column;
        gap: 20rpx;
    }
    .box {
        width: 640rpx;
        padding: 20rpx;
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 20rpx;
        border-radius: 6px;
        border: 1px solid #F1F1F1;
        background: #FFF;
        .info_h1 {
            color: #333;
            font-family: Inter;
            font-size: 30rpx;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
        }
        .info_h2 {
            color: #333;
            font-family: Inter;
            font-size: 24rpx;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
        }
        .info_p {
            color: #808080;
            font-family: Inter;
            font-size: 24rpx;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
        }
        .records {
            width: 640rpx;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20rpx;
            .record {
                padding: 20rpx;
                padding-bottom: 0;
                display: flex;
                flex-direction: column;
                align-items: start;
                border-radius: 10px;
                border: 1px solid #F1F1F1;
                background: #FCFCFC;
                gap: 30rpx;
                text {
                    color: #333;
                    font-family: Inter;
                    font-size: 50rpx;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                }
                .record_title {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 10rpx;
                    color: #333;
                    font-family: Inter;
                    font-size: 26rpx;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                    image {
                        width: 30rpx;
                        height: 30rpx;
                    }
                }
            }            
        }
    }
    .user_select {
        display: flex;
        flex-direction: column;
        gap: 20rpx;
        .box1 {
            width: 680rpx;
            padding: 20rpx;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            .records1 {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 10rpx;
                .record1 {
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
    }
</style>