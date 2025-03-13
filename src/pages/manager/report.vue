<template>
	<view class="maindiv">
        <view class="header">
            <image src="/static/back_icon.png" alt="logo" class="arrowimg arrowleft" @click="back"/>
            <view class="title">Attendance Report</view> 
        </view> 
        <view class="btns">
            <view class="actionbn" 
                :style="selected === 'weekly' ? {color: '#fff', background: '#EFC462'} : {color: '#475467', background: '#fff'}" 
                @click="selected = 'weekly'">Weekly</view>
            <view class="actionbn"
                :style="selected === 'quarterly' ? {color: '#fff', background: '#EFC462'} : {color: '#475467', background: '#fff'}"
                @click="selected = 'quarterly'">Quartly</view>
        </view>
        <view class="content" v-if="selected === 'weekly'">
            <view class="title">Recent</view>
            <view class="user" @click="getWeekReport(0)">
                <view class="name">{{ weeklyReports[0].title }}</view> 
            </view>  
            <view class="title">Past Report</view>
            <view class="user" v-for="(week, index) in pastReports" :key="index" @click="getWeekReport(index+1)">
                <view class="name">{{ week.title }}</view> 
            </view> 
        </view>
        <view class="content" v-else>
            <view class="title">Recent</view>
            <view class="user" @click="getQuarterReport(0)">
                <view class="name">{{ weeklyReports[0].title }}</view> 
            </view>  
            <view class="title">Past Report</view>
            <view class="user" v-for="(week, index) in pastReports" :key="index" @click="getQuarterReport(index+1)">
                <view class="name">{{ week.title }}</view> 
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
            pastReports () {
                return this.weeklyReports.slice(1, 5);
            }
        },
		methods: { 
            back () {
                uni.navigateBack({
                    delta: 1
                });
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
                    reports.push({
                        title: `Weekly Report ${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`
                    });                    
                    today.setDate(today.getDate() - 7);                                     
                }
                console.log("report:", reports);
                return reports; 
            },
            // saveCSV(csvString, fileName) {
            //     const filePath = `${plus.io.PUBLIC_DOWNLOADS}/${fileName}`; // 保存路径
            //     plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, fs => {
            //         fs.root.getFile(fileName, { create: true }, fileEntry => {
            //             fileEntry.createWriter(
            //                 writer => {
            //                     writer.write(csvString);
            //                     uni.showToast({
            //                         title: '文件保存成功',
            //                         icon: 'success'
            //                     });
            //                 }, error => {
            //                 console.error('文件写入失败:', error);
            //             });
            //         }, error => {
            //         console.error('文件创建失败:', error);
            //         });
            //     }, error => {
            //         console.error('文件系统请求失败:', error);
            //     });
            // }, 
            getWeekReport (n) {
                uni.downloadFile({
                    url: `${baseUrl}/csv/weeklyAttendances?numWeek=${n}`,
                    headers: {
                        "Authorization": `Bearer ${uni.getStorageSync("token")}`
                    },
                    success: (res) => {
                        if (res.statusCode === 200) {
                            uni.saveFile({
                                tempFilePath: res.tempFilePath,
                                success: (saveRes) => {
                                    console.log("success:", saveRes.savedFilePath);
                                    uni.showToast({ title: "下载成功", icon: "success" });
                                }
                            });
                        } else {
                            uni.showToast({ title: "下载失败", icon: "none" });
                            console.log("fail:", res);
                        }
                    },
                    fail: (err) => {
                        console.error("下载失败", err);
                    }
                });
            },
            getQuarterReport (n) {
                uni.downloadFile({
                    url: `${baseUrl}/csv/quarterlyAttendance?numQuarter=${n}`,
                    headers: {
                        "Authorization": `Bearer ${uni.getStorageSync("token")}`
                    },
                    success: (res) => {
                        if (res.statusCode === 200) {
                            uni.saveFile({
                                tempFilePath: res.tempFilePath,
                                success: (saveRes) => {
                                    console.log("success:", saveRes.savedFilePath);
                                    uni.showToast({ title: "下载成功", icon: "success" });
                                }
                            });
                        } else {
                            uni.showToast({ title: "下载失败", icon: "none" });
                            console.log("fail:", res);
                        }
                    },
                    fail: (err) => {
                        console.error("下载失败", err);
                    }
                });
            },
            // getQuarteData () {  
            //     let params = {
            //         numQuarter : this.getCurrentQuarter()
            //     }
            //     getQuarterApi(params).then((res)=>{
            //         console.log("quarter:", res);
            //         // this.saveCSV(res, 'data.csv');
            //     })
            // },
            // getCurrentQuarter() {
            //     const month = new Date().getMonth() + 1; // 获取当前月份 (1-12)
            //     return Math.ceil(month / 3); // 计算当前季度
            // },
            // testf(){
            //     uni.request({
            //         url: 'api/user/list',
            //         method: 'GET',
            //         header:{
            //             "Content-Type": "application/json",
            //             "Authorization":"Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbjFAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDEyNjA2ODQsImV4cCI6MTc0MTI2NDI4NH0.Lh3Qg10GL2KwS-efbh8EmnidlFTTE-iKpeyxQiJ4kc8"

            //         },
            //         data: {
            //             page: 1,
            //             limit: 10,
            //         },
            //         success: (res) => {
            //             console.log('请求成功:', res.data);
            //         },
            //         fail: (err) => {
            //             console.error('请求失败:', err);
            //         },  
            //     });
            // },
            // activebtns(index){
            //     this.btnindex = index
            //     if (this.btnindex == 1){
            //         this.getWeekData()
            //     }else{
            //         this.getQuarteData()
            //     }
            // },  
            // update(){
            //     uni.showToast({
            //         title: "Saved",
            //         icon: "success",
            //         duration: 3000,
            //     });
            // }
		} 
	}
</script>
  
<style scoped lang="scss">
	 .maindiv{ 
        min-height: 100vh;
        padding: 15rpx; 
        background-color: #F8F8F8;
        .btns{
            width: 675rpx;
            height: 60rpx;
            margin-top: 40rpx;
            margin-bottom: 40rpx;
            display: flex;
            justify-content: space-between;
            border-radius: 100px;
            background-color:white;
            .actiontbn{
                width: 350rpx;
                height: 60rpx;             
                text-align: center;
                line-height: 60rpx; 
                font-family: Nunito;
                font-size: 12px;
                font-style: normal;
                font-weight: 500;
                border-radius: 100px;                
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
