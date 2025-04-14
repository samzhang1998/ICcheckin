<template>
    <view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="back"/>
            <text>{{ user.fullName }}</text> 
        </view>
        <view v-for="(item, index) in formattedRecords" :key="index" class="record">
            <view v-for="(attendance, i) in item.attendance" :key="i">
                <view class="record_title">
                    <view class="if_record">
                        <image :src="ifRecord(attendance.outsideRecord, attendance.attendanceType)" alt="status"></image>
                        {{ outsideRecord(attendance.outsideRecord, attendance.attendanceType) }}
                    </view>
                    <text>{{ item.date }}</text>
                </view>
                <view class="record_content">
                    <view class="info">
                        <text class="late_name">{{ attendance.firstName }} {{ attendance.lastName }}</text>
                        <text class="late_role">{{ attendance.regionName }} - {{ attendance.title }}</text>
                        <view class="late_times">
                            <view class="late_time" :style="{ background: getBackground(attendance.attendanceType) }">
                                <image :src="lateInfo(attendance.attendanceType)" alt="in"></image>
                            </view>
                            <text>{{ attendance.signInTime }}</text>
                            <view class="late_time" :style="{ background: getBackground(attendance.attendanceType) }">
                                <image :src="lateInfo(attendance.attendanceType)" alt="out"></image>                            
                            </view>
                            <text>{{ attendance.signOutTime }}</text>
                        </view>
                    </view>
                    <view class="info">
                        <text class="warn_time">{{ attendance.lateTime }}</text>
                        <text class="warn_time">{{ attendance.earlyTime }}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import { getUserAttendance } from '@/api/admin';
    export default {
        data () {
            return {
                date: "",
                user: {},
                attendance: [],
                dateRange: []
            }
        },
        computed: {
            formattedRecords () {
                return this.attendance.map(item => {
                    return {
                        ...item,
                        attendance: item.attendance.map(record => {
                            const signIn = record.signInTime ? record.signInTime.split(' ')[1] : "not checked";
                            const signOut = record.signOutTime ? record.signOutTime.split(' ')[1] : "not checked";
                            return {
                                ...record,
                                signInTime: signIn,
                                signOutTime: signOut
                            }
                        })
                    }                  
                })
            }
        },
        methods: {
            back () {
                uni.navigateBack({
                    delta: 1
                });
            },
            async getAttendance () {
                try {
                    const data = {
                        userId: this.user.userId,
                        start: this.dateRange[0],
                        end: this.dateRange[1]
                    }
                    console.log("data:", data)
                    const res = await getUserAttendance(data);
                    if (res.data.status === 1) {
                        this.attendance = res.data.data
                        this.date = res.data.data.date
                        console.log ("attendance:", this.attendance)
                    } else if (res.statusCode === 403) {
                        uni.navigateTo({
                            url: '/pages/index/index'
                        });
                    } else {
                        console.log("Fail:", res);
                        uni.showToast({ title: "Fail to get attendance", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Error of getting attendance", icon: "none" });
                }
            },
            lateInfo (type) {
                if (type === "ONSITE") {
                    return "/static/Check_in_complete1.png"
                } else if (type === "Absent" || type === "ANNUAL" || type === "SICK") {
                    return "/static/Check_in_icon.png"
                } else {
                    return "/static/Check_in_complete.png"
                }
            },
            ifRecord (status, type) {
                if (type === "ANNUAL" || type === "SICK") {
                    return "/static/Calendar_fill.png"
                } else if (status === false) {
                    return "/static/Check_fill.png"
                } else {
                    return "/static/Check_fill(1).png"
                }
            },
            outsideRecord (status, type) {
                if (type === "ANNUAL") {
                    return "Annual Leave"
                } else if (type === "SICK") {
                    return "Sick Leave"
                } else if (status === false) {
                    return "No Offsite Activity Record"
                } else {
                    return "Outside activity Record"
                }
            },
            getBackground (type) {
                if (type === 'ONSITE') {
                    return 'rgba(4, 177, 10, 0.15)'
                } else if (type === 'ANNUAL' || type === 'SICK') {
                    return '#FFF3D8'
                } else {
                    return '#F1F1F1'
                }
            }
        },
        onLoad () {
            const eventChannel = this.getOpenerEventChannel()
            eventChannel.on('payload', (data) => {
                this.user = data.user
                this.dateRange = data.dateRange
                this.getAttendance ()
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
    .record {
        width: 680rpx;
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        background: #FFF;
        border: 1px solid #F1F1F1;
    }
    .record_title {
        width: 640rpx;
        padding: 20rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        text {
            color: #696969;
            font-family: Inter;
            font-size: 26rpx;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
        }
        .if_record {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10rpx;
            color: #333;
            font-family: Inter;
            font-size: 30rpx;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
        }
        image {
            width: 30rpx;
            height: 30rpx;
        }
    }
    .record_content {
        width: 640rpx;
        padding: 20rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-top: 1px solid #F1F1F1;
    }
    .info {
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 20rpx;
        .late_name {
            color: #000;
            font-family: Inter;
            font-size: 30rpx;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
        }
        .late_role {
            color: #808080;
            font-family: Inter;
            font-size: 26rpx;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
        }
        .late_times {
            display: flex;
            flex-direction: row;
            justify-content: start;
            align-items: center;
            gap: 20rpx;
            .late_time {
                width: 55rpx;
                height: 55rpx;
                border-radius: 6px;
                display: flex;
                justify-content: center;
                align-items: center;
                image {
                    width: 30rpx;
                    height: 30rpx;
                }
            }
            text {
                color: #333;
                font-family: Inter;
                font-size: 26rpx;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }
        }
        .warn_time {
            color: #F95555;
            font-family: Inter;
            font-size: 22rpx;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
        }
    }
</style>