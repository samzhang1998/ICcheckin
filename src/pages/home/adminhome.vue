<template>
    <view class="admin_home"> 
        <view class="title">
            <view class="title_content">
                <view class="date">
                    <image src="/static/rili.png" alt="canlindar"></image>
                    {{ date }}
                </view>
                <text class="name">{{ userFirstName }} {{ userLastName }}</text>
                <text class="role">{{userinfo.region}} - {{ userRole[0] }}</text>
            </view>
            <view class="img_box" @click="showNotification">
                <image src="/static/Bell_icon.png" alt="bell"></image>
            </view>
        </view>
        <view class="box">
            <view class="sub_title">
                <image src="/static/user1.png" alt="user"></image>
                Late Employees
            </view>
            <view v-for="(item, index) in formattedLateInfo" :key="index" class="late_info">
                <view class="info">
                    <text class="late_name">{{ item.firstName }} {{ item.lastName }}</text>
                    <text class="late_role">{{ item.title }}</text>
                    <view class="late_times">
                        <view class="late_time" :style="{background: item.attendanceType === 'ONSITE' ? 'rgba(4, 177, 10, 0.15)' : '#FFF3D8'}">
                            <image :src="lateInfo(item.attendanceType)" alt="in"></image>                            
                        </view>
                        <text>{{ item.signInTime }}</text>
                        <view class="late_time" :style="{background: item.attendanceType === 'ONSITE' ? 'rgba(4, 177, 10, 0.15)' : '#FFF3D8'}">
                            <image :src="lateInfo(item.attendanceType)" alt="out"></image>                            
                        </view>
                        <text>{{ item.signInTime }}</text>
                    </view>
                </view>
                <view class="info">
                    <text class="warn_time">{{ item.lateTime }}</text>
                    <text class="warn_time">{{ item.earlyTime }}</text>
                </view>
            </view>
        </view>
        <view class="box">
            <view class="sub_title">
                <image src="/static/Stat.png" alt="stat"></image>
                Attendance Overview
            </view>
            <view>
                <view class="select" @click="showRegion = !showRegion" :class="{active: showRegion}">
                    {{ selectedRegion.name }}
                    <image src="/static/Expand_down.png" alt="down"></image>
                </view>
                <view v-if="showRegion" class="selection">
                    <view v-for="(region, index) in region" :key="index" @click="selectRegion(region)">
                        <text>{{ region.name }}</text>
                    </view>
                </view>
            </view>
            <view v-for="(record, index) in attendance" :key="index" @click="viewDetail(record)" class="attendance_info">
                <text class="region">{{ record.departmentName }}</text>
                <text class="num">Employee: {{ record.departmentSize }}</text>
                <view class="records">
                    <view class="record">
                        <view class="record_title">
                            <image src="/static/late.png" alt="late"></image>
                            Late
                        </view>
                        <text>{{ record.late }}</text>
                    </view>
                    <view class="record">
                        <view class="record_title">
                            <image src="/static/absence.png" alt="absence"></image>
                            Absence
                        </view>
                        <text>{{ record.absent }}</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="box">
            <view class="sub_title">
                <image src="/static/File_dock_add.png" alt="leave"></image>
                New Leave
            </view>
            <view v-for="(leave, index) in formattedLeave" :key="index" class="leave">
                <view class="leave_title">
                    <view class="leave_type">
                        <image src="/static/Calendar_light.png" alt="date"></image>
                        {{ leave.requestType }}
                    </view>
                    <text>{{ leave.requestTimestamp }}</text>
                </view>
                <view class="leave_info">
                    <view class="line">
                        <text class="line_title">Leave Date</text>
                        <text class="line_title">Total Leave</text>
                    </view>
                    <view class="line">
                        <text>{{ leave.startTime }} - {{ leave.endTime }}</text>
                        <view class="hours">{{ leave.requestedHours }} Hours</view>
                    </view>
                    <view class="line1">
                        <text>By: {{ leave.user }}</text>
                        <view class="action">
                            <image src="/static/Leave_approved.png" alt="approve" @click="viewLeave(leave.requestId, true)"></image>
                            <image src="/static/reject.png" alt="reject" @click="viewLeave(leave.requestId, false)"></image>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import { getLateTotal, getAttendancesStatistics, getAllRegion, leaveView } from '@/api/admin';
    import { getPendingLeave } from '@/api/leave';

    export default {
        data () {
            return {
                userinfo:{},
                date: "",
                userFirstName: "",
                userLastName: "",
                userRole: "",
                lateEmployee: [],
                region: [],
                attendance: [],
                newLeave: [],
                showRegion: false,
                selectedRegion: {}
            }
        },
        computed: {
            formattedLeave () {
                return this.newLeave.map(item => {
                    const start = item.startTime.split(' ')[0];
                    const end = item.endTime.split(' ')[0];
                    return {
                        ...item,
                        startTime: start,
                        endTime: end
                    }
                });
            },
            formattedLateInfo () {
                return this.lateEmployee.map(item => {
                    const signIn = item.signInTime.split(' ')[1];
                    const signOut = item.signOutTime ? item.signOutTime.split(' ')[1] : "not checked";
                    return {
                        ...item,
                        signInTime: signIn,
                        signOutTime: signOut
                    }
                });
            }
        },
        methods: {
            showNotification () {
                uni.navigateTo({ url: "/pages/index/notification" });
            },
            async getLateInfo () {
                try {
                    const res = await getLateTotal();
                    if (res.data.status === 1) {
                        this.lateEmployee = res.data.data
                        console.log ("late employee:", this.lateEmployee)
                    } else if (res.statusCode === 403) {
                        uni.navigateTo({
                            url: '/pages/index/index'
                        });
                    } else {
                        console.log("Fail:", res);
                        uni.showToast({ title: "Fail to get late info", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Error of getting late info", icon: "none" });
                }
            },
            async getRegion () {
                try {
                    const res = await getAllRegion();
                    if (res.data.status === 1) {
                        this.region = res.data.data
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
                        regionId: this.selectedRegion.regionId
                    }
                    const res = await getAttendancesStatistics(dataSend);
                    if (res.data.status === 1) {
                        this.attendance = res.data.data[0].departments
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
            async getNewLeave () {
                try {
                    const res = await getPendingLeave();
                    if (res.data.status === 1) {
                        this.newLeave = res.data.data
                        console.log("new leave:", this.newLeave)
                    } else if (res.statusCode === 403) {
                        uni.navigateTo({
                            url: '/pages/index/index'
                        });
                    } else {
                        console.log("Fail:", res);
                        uni.showToast({ title: "Fail to get new leaves", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Error of getting new leaves", icon: "none" });
                }
            },
            lateInfo (type) {
                if (type === "ONSITE") {
                    return "/static/Check_in_complete1.png"
                } else {
                    return "/static/Check_in_complete.png"
                }
            },
            selectRegion (item) {
                this.selectedRegion = item;
                this.getAttendenceInfo();
                this.showRegion = false;
            },
            viewDetail (record) {
                uni.navigateTo({ 
                    url: `/pages/home/department`,
                    success: (res) => {
                        res.eventChannel.emit('department', record)
                    }
                })
            },
            formatdate(){
                console.log("/////////////")
                let now = new Date()
              let month =   now.getMonth() + 1
              if (month < 10 ){
                  month ="0" + month 
              }
              let day = now.getDate() 
              if (day < 10 ){
                  day ="0" + day 
              }
              
              this.date =  day + "-" + month +"-"+ now.getFullYear()  
            },
            async viewLeave (id, action) {
                try {
                    const data = {
                        approve: action,
                        comment: ""
                    }
                    const res = await leaveView(id, data);
                    if (res.data.status === 1) {
                        uni.reLaunch({ url: "/pages/home/adminhome" });
                        console.log("success:", res.data)
                    } else if (res.statusCode === 403) {
                        uni.navigateTo({
                            url: '/pages/index/index'
                        });
                    } else {
                        console.log("Fail:", res);
                        uni.showToast({ title: "Fail to view leaves", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Error of viewing leaves", icon: "none" });
                }
            }
        },
        onLoad () {
            this.userFirstName = uni.getStorageSync("firstName");
            this.userLastName = uni.getStorageSync("lastName");
            this.userRole = uni.getStorageSync("role")
            this.formatdate()
        },
        onShow () {
            this.getLateInfo();
            this.getRegion();
            this.getAttendenceInfo();
            this.getNewLeave();
            this.userinfo = uni.getStorageSync("userinfo")
        }
    }
</script>

<style scoped lang="scss">
    .admin_home {
        width: 750rpx;
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
        .date {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10rpx;
            color: #333;
            font-family: Inter;
            font-size: 26rpx;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            image {
                width: 35rpx;
                height: 35rpx;
            }
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
    .box {
        width: 680rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30rpx;
    }
    .sub_title {
        width: 680rpx;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 10rpx;
        color: #333;
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
    .late_info {
        width: 640rpx;
        padding: 20rpx;
        display: flex;
        flex-direction: column;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: start;
        border-radius: 5px 5px 0px 0px;
        border: 1px solid #F1F1F1;
        background: #FFF;
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
    .select {
        width: 640rpx;
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
        width: 640rpx;
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
    .attendance_info {
        width: 640rpx;
        padding: 20rpx;
        gap: 20rpx;
        display: flex;
        flex-direction: column;
        align-items: start;
        border-radius: 8px;
        border: 1px solid #F1F1F1;
        background: #FFF;
        .region {
            color: #000;
            font-family: Inter;
            font-size: 26rpx;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
        }
        .num {
            color: #808080;
            font-family: Inter;
            font-size: 26rpx;
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
    .leave {
        width: 680rpx;
        display: flex;
        flex-direction: column;
        background: #FFF;
        border-radius: 8px;
        border: 1px solid #F1F1F1;
        .leave_title {
            width: 640rpx;
            padding: 20rpx;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #F1F1F1;
            .leave_type {
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
                image {
                    width: 35rpx;
                    height: 35rpx;
                }
            }
            text {
                color: #808080;
                font-family: Inter;
                font-size: 26rpx;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }
        }
        .leave_info {
            width: 640rpx;
            padding: 20rpx;
            display: flex;
            flex-direction: column;
            gap: 10rpx;
            .line {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                text { 
                    color: #333;
                    font-family: Inter;
                    font-size: 30rpx;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                }
                .line_title {
                    color: #696969;
                    font-family: Inter;
                    font-size: 26rpx;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                }
            }
            .line1 {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                margin-top: 20rpx;
                .action {
                    display: flex;
                    flex-direction: row;
                    justify-content: end;
                    align-items: center;
                    gap: 20rpx;
                    image {
                        width: 40rpx;
                        height: 40rpx;
                    }
                }
            }
        }
    }

    .hours{
    color:#EFC462;
}
</style>