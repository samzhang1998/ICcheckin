<template>
	<view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="back"/>
            <text>Attendance Report</text> 
        </view> 
        <view class="btns">
            <view class="actionbn" 
                :style="selected === 'weekly' ? {color: '#fff', background: '#01aed3'} : {color: '#475467', background: '#fff'}" 
                @click="selected = 'weekly'">Weekly</view>
            <view class="actionbn"
                :style="selected === 'quarterly' ? {color: '#fff', background: '#01aed3'} : {color: '#475467', background: '#fff'}"
                @click="selected = 'quarterly'">Quartly</view>
        </view>
        <view class="content" v-if="selected === 'weekly'">
            <view class="sub_title">Recent</view>
            <view class="user" @click="getWeekReport(0)">
                <view class="name">{{ weeklyReports[0] }}</view> 
            </view>  
            <view class="sub_title">Past Report</view>
            <view class="user" v-for="(week, index) in pastWeeklyReports" :key="index" @click="getWeekReport(index+1)">
                <view class="name">{{ week }}</view> 
            </view> 
        </view>
        <view class="content" v-else>
            <view class="sub_title">Recent</view>
            <view class="user" @click="getQuarterReport(1)">
                <view class="name">{{ quarterlyReports[0] }}</view> 
            </view>  
            <view class="sub_title">Past Report</view>
            <view class="user" v-for="(quarter, index) in pastQuarterlyReports" :key="index" @click="getQuarterReport(index+2)">
                <view class="name">{{ quarter }}</view> 
            </view> 
        </view>
	</view>
</template>
  
<script>
    import { baseUrl } from "@/api/base";
	export default {
        data() {
            return { 
                selected: "weekly",
                numWeek: null,
            };
        },
        computed: {
            weeklyReports () {
                return this.weeks();
            },
            pastWeeklyReports () {
                return this.weeklyReports.slice(1, 5);
            },
            quarterlyReports() {
                return this.quarters();
            },
            pastQuarterlyReports () {
                return this.quarterlyReports.slice(1, 4);
            },
        },
		methods: { 
            back () {
                uni.switchTab({ url: "/pages/home/admin-attendance"})
            },
            weeks () {
                const reports = [];
                let today = new Date();
                for (let i = 0; i < 5; i++) {
                    const dayOfWeek = today.getDay();
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    function formatDate(d) {
                        const day = d.getDate().toString().padStart(2, "0");
                        const month = (d.getMonth() + 1).toString().padStart(2, "0");
                        const year = d.getFullYear();
                        return `${day}/${month}/${year}`;
                    }
                    reports.push(`Weekly Report: ${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`);                    
                    today.setDate(today.getDate() - 7);                                     
                }
                console.log("report:", reports);
                return reports; 
            },
            quarters() {
                const today = new Date();
                let year = today.getFullYear();
                let month = today.getMonth() + 1;
                let currentQuarter = Math.ceil(month / 3);
                let quarters = [];
                for (let i = 0; i < 4; i++) {
                    quarters.push(`Quarterly Report: ${year} Quarter ${currentQuarter}`);
                    currentQuarter--;
                    if (currentQuarter < 1) {
                        currentQuarter = 4;
                        year--;
                    }
                }
                return quarters;
            },
            getWeekReport(n) {
                // const baseUrl = "http://localhost:3000";
                // const targetPath = plus.io.convertLocalFileSystemURL(plus.io.env.DOCUMENTS) + `/DownloadedReports/weeklyAttendance${n}.csv`;
                uni.downloadFile({
                    url: `${baseUrl}/csv/weeklyAttendances?numWeek=${n}`,
                    header: {
                        "Authorization": `Bearer ${uni.getStorageSync("token")}`
                    },
                    success: (res) => {
                        if (res.statusCode === 200) {
                        console.log("File downloaded successfully:", res.tempFilePath);
                        let filePath = res.tempFilePath;
                    //   uni.showToast({ title: "下载成功", icon: "success" });
                        uni.showModal({
                            title: "Successed",
                            content: "File downloaded successfully",
                            confirmText: "Open",
                            success: (res) => {
                                if (res.confirm) {
                                    uni.openDocument({
                                        filePath: filePath,
                                        fileType: "csv",
                                        success: (openRes) => {
                                            console.log("File opened successfully:", openRes);
                                        },
                                    });
                                }
                            },
                        });
                      // Optionally, open the file after download:
                    //   this.openFile(res.filePath || res.tempFilePath);
                        } else {
                          console.error("Download failed with statusCode:", res);
                          uni.showToast({ title: `Download filed: code ${res.statusCode}`, icon: "none" });
                        }
                    },
                    fail: (err) => {
                        console.error("File downloaded failed", err);
                        uni.showToast({ title: "File downloaded failed", icon: "none" });
                    }
                });
            },
            getQuarterReport(n) {
                uni.downloadFile({
                    url: `${baseUrl}/csv/quarterlyAttendance?numQuarter=${n}`,
                    header: {
                        "Authorization": `Bearer ${uni.getStorageSync("token")}`
                    },
                    success: (res) => {
                        if (res.statusCode === 200) {
                        console.log("File downloaded successfully:", res.tempFilePath);
                        let filePath = res.tempFilePath;
                    //   uni.showToast({ title: "下载成功", icon: "success" });
                        uni.showModal({
                            title: "Successed",
                            content: "File downloaded successfully",
                            confirmText: "Open",
                            success: (res) => {
                                if (res.confirm) {
                                    uni.openDocument({
                                        filePath: filePath,
                                        fileType: "csv",
                                        success: (openRes) => {
                                            console.log("File opened successfully:", openRes);
                                        },
                                    });
                                }
                            },
                        });
                      // Optionally, open the file after download:
                    //   this.openFile(res.filePath || res.tempFilePath);
                        } else {
                          console.error("Download failed with statusCode:", res.statusCode);
                          uni.showToast({ title: `Download filed: code ${res.statusCode}`, icon: "none" });
                        }
                    },
                    fail: (err) => {
                        console.error("File downloaded failed", err);
                        uni.showToast({ title: "File downloaded failed", icon: "none" });
                    }
                });
            },
		} 
	}
</script>
  
<style scoped lang="scss">
	.maindiv { 
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
            font-family: Nunito;
            font-size: 35rpx;
            font-weight: 700;
            line-height: 140%;
            text-align: center;
        }
        .btns {
            width: 680rpx;
            height: 60rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 100px;
            background-color:white;
            .actionbn {
                width: 340rpx;
                height: 60rpx;
                display: flex;
                justify-content: center;
                align-items: center;             
                line-height: 60rpx; 
                font-family: Nunito;
                font-size: 22rpx;
                font-style: normal;
                font-weight: 500;
                border-radius: 100px;                
            }
        }
       
        .content{
            width: 600rpx;
            padding: 40rpx;
            border-radius: 10px;
            background: #FFF;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30rpx;
            .sub_title{
                width: 600rpx;
                text-align: start;
                color: #2B2B2B; 
                font-family: Nunito;
                font-size: 26rpx;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                letter-spacing: -0.5px;
            }
            .user{
                width: 540rpx;
                padding: 30rpx;
                border-radius: 10px;
                border: 1px solid #EAECF0;
                background: #F9FAFB;
                .name{
                    color: var(--Color, #141414); 
                    font-family: Nunito;
                    font-size: 22rpx;
                    font-style: normal;
                    font-weight: 550;
                    letter-spacing: -0.28px;
                }
            }
        }
    }
</style>
