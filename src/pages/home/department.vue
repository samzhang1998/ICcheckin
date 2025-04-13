<template>
    <view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="back"/>
            <text>{{ department.departmentName }} Team</text> 
        </view>
        <view class="box">
            <text class="box_name">{{ department.departmentName }} Team ({{ department.departmentSize }})</text>
            <text class="box_time">{{ department.startOnTime }} - {{ department.endOnTime }}</text>
        </view>
        <view v-for="(item, index) in formattedRecords" :key="index" class="record">
            <view class="record_title">
                <view class="if_record">
                    <image :src="ifRecord(item.outsideRecord, item.attendanceType)" alt="status"></image>
                    {{ outsideRecord(item.outsideRecord, item.attendanceType) }}
                </view>
                <text>{{ date }}</text>
            </view>
            <view class="record_content">
                <view class="info">
                    <text class="late_name">{{ item.firstName }} {{ item.lastName }}</text>
                    <text class="late_role">{{ item.regionName }} - {{ item.title }}</text>
                    <view class="late_times">
                        <view class="late_time" :style="{ background: getBackground(item.attendanceType) }">
                            <image :src="lateInfo(item.attendanceType)" alt="in"></image>
                        </view>
                        <text>{{ item.signInTime }}</text>
                        <view class="late_time" :style="{ background: getBackground(item.attendanceType) }">
                            <image :src="lateInfo(item.attendanceType)" alt="out"></image>                            
                        </view>
                        <text>{{ item.signOutTime }}</text>
                    </view>
                </view>
                <view class="info">
                    <text class="warn_time">{{ item.lateTime }}</text>
                    <text class="warn_time">{{ item.earlyTime }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import { getRecordDepartment } from '@/api/admin';

    export default {
        data () {
            return {
                date: "",
                department: {},
                records: []
            }
        },
        computed: {
            formattedRecords () {
                return this.records.map(item => {
                    const signIn = item.signInTime ? item.signInTime.split(' ')[1] : "not checked";
                    const date = item.signInTime ? item.signInTime.split(' ')[0] : "";
                    const signOut = item.signOutTime ? item.signOutTime.split(' ')[1] : "not checked";
                    return {
                        ...item,
                        date: date,
                        signInTime: signIn,
                        signOutTime: signOut
                    }
                });
            }
        },
        methods: {
            back () {
                uni.switchTab({ url: "/pages/home/adminhome" });
            },
            async getDepartmentInfo () {
                try{
                    const data = {
                        departmentId: this.department.departmentId
                    }
                    console.log("id:", data)
                    const res = await getRecordDepartment(data);
                    if (res.data.status === 1) {
                        this.date = res.data.data.date
                        this.records = res.data.data.attendances
                        console.log("records:", this.records)
                    } else if (res.statusCode === 403) {
                        uni.navigateTo({
                            url: '/pages/index/index'
                        });
                    } else {
                        console.log("Fail:", res);
                        uni.showToast({ title: "Fail to get records", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Error of getting records", icon: "none" });
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
            eventChannel.on('department', (data) => {
                this.department = data;
                console.log("this department", this.department)
                this.getDepartmentInfo()
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
        .box {
            width: 640rpx;
            padding: 20rpx;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-radius: 6px;
            border: 1px solid #F1F1F1;
            background: #FFF;
            .box_name { 
                color: #333;
                font-family: Inter;
                font-size: 30rpx;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }
            .box_time {
                color: #696969;
                font-family: Inter;
                font-size: 26rpx;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
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
    }
</style>