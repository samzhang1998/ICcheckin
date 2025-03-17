<template>
    <view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo"  @click="back" />
            <text>Employee Management</text> 
        </view>
        <text class="sub_title">New User</text>
        <view class="new_user">
            <text>Email:</text>
            <input v-model="email" />
            <text>First Name:</text>
            <input v-model="firstName" />
            <text>Last Name:</text>
            <input v-model="lastName" />
            <text>Title:</text>
            <input v-model="title" />
            <text>Role:</text>
            <view class="selection" @click="showRole">
                <text>{{ selectedRole ? selectedRole : "Select" }}</text>
                <image src="/static/Arrow_down.png" alt="arrow-down"></image>
            </view>
            <view v-if="roleSelection" class="type_menu">
                <view 
                    v-for="(type, index) in roles" 
                    :key="index" 
                    class="type"
                    @click="selectType(type)"
                >
                    {{ type.roleName }}
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import { getRoleRequest } from '@/api/admin';
    export default {
        deta () {
            return {
                roleSelection: false,
                roles : [],
                email: "",
                password: "",
                firstName: "",
                lastName: "",
                title: "",
                phoneNumber: "",
                selectedRole: ""
            }
        },
        methods: {
            back () {
                uni.navigateBack({
                    delta: 1
                });
            },
            async getRoles () {
                try {
                    const res = await getRoleRequest();
                    if (res.statusCode === 200) {
                        this.roles = res.data.data;
                        console.log("Roles:", this.roles);
                    } else {
                        console.log("Fail:", res);
						uni.showToast({ title: "Error of getting roles", icon: "none" });
                    }
                } catch (error) {
                    console.error("error:", error);
					uni.showToast({ title: "Error of getting roles", icon: "none" });
                }
            },
            showRole () {
                this.roleSelection = !this.roleSelection
            },
            selectType (type) {
                this.selectedRole = type;
                this.roleSelection = false;
            }
        },
        onShow () {
            this.getRoles();
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
    }
</style>