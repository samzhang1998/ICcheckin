<template>
    <view class="leave">
        <identity></identity>
        <work-leave :user="user"></work-leave>
        <view class="filter">
            <view
                v-for="(tab, index) in tabs" 
                :key="index" 
                @click="selectTab(tab.value)"
                class="filter_opt"
                :class="activeTab === tab.value ? 'active' : ''"
            >{{ tab.label }}</view>
        </view>
    </view>
</template>

<script>
    import workLeave from '@/components/leave/work-leave.vue'
    export default {
    components: { workLeave },
        data () {
            return {
                activeTab: "review",
                user: [
                    {
                        period: "Paid Period 1 Sept 2024 - 1 Sept 2025",
                        availableHrs: "132 Hours",
                        usedHrs: "32 Hours"
                    }
                ],
                tabs: [
                    { label: "Review", value: "review" },
                    { label: "Approved", value: "approved" },
                    { label: "Rejected", value: "rejected" }
                ],
            }
        },
        methods: {
            selectTab(value) {
                this.activeTab = value;
            }
        }
    }
</script>

<style scoped>
    .leave {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        background: linear-gradient(0deg, #F9F9F9 0%, #F9F9F9 100%), linear-gradient(0deg, rgba(228, 208, 189, 0.03) 9.72%, #FFF 100%), linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 37.32%);
        font-family: Nunito;
        font-style: normal;
        line-height: normal;
    }
    .filter {
        width: 90%;
        height: 32px;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-radius: 100px;
        background: #FEFEFE;
    }
    .filter_opt {
        flex: 1;
        height: 32px;
        border-radius: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 12px;
        font-weight: 500;
        line-height: 140%;
    }
    .active {
        background: #EFC462;
        color: white;
    }
</style>