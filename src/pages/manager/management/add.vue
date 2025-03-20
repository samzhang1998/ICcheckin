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
            <text>Password:</text>
            <input v-model="password" />
            <text>Phone:</text>
            <input v-model="phone" />
            <text>First Name:</text>
            <input v-model="firstName" />
            <text>Last Name:</text>
            <input v-model="lastName" />
            <text>Title:</text>
            <input v-model="title" />
            <text>Role:</text>
            <view 
                class="selection" 
                :class="roleSelection ? 'active' : ''" 
                @click="showRole"
                v-if="thisRole[0] === 'ADMIN'"
            >
                <text>{{ selectedRole ? selectedRole : "Select" }}</text>
                <image src="/static/Arrow_down.png" alt="arrow-down"></image>
            </view>
            <input v-else placeholder="EMPLOYEE" disabled />
            <view v-if="roleSelection" class="type_menu">
                <view 
                    v-for="(type, index) in roles" 
                    :key="index" 
                    class="type"
                    @click="selectRole(type)"
                >
                    {{ type.roleName }}
                </view>
            </view>
        </view>
        <button @click="createUser">Create User</button>
    </view>
</template>

<script>
    import { getRoleRequest, createUserRequest } from '@/api/admin';
    export default {
        data () {
            return {
                roleSelection: false,
                roles: [],
                email: "",
                password: "",
                firstName: "",
                lastName: "",
                title: "",
                phone: "",
                phoneNumber: "",
                selectedRole: "",
                selectedRoleId: "",
                thisRole: uni.getStorageSync("role")
            }
        },
        methods: {
            back () {
                uni.switchTab({ url: "/pages/profile/index"});
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
            selectRole (type) {
                this.selectedRole = type.roleName;
                this.selectedRoleId = type.roleId;
                this.roleSelection = false;
            },
            async createUser () {
                if (this.thisRole[0] === "MANAGER") {
                    this.selectedRoleId = "11111111-1111-1111-1111-111111111111"
                }
                const data = {
                    email: this.email,
                    password: this.password,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    title: this.title,
                    roleId: this.selectedRoleId,
                    phoneNumber: this.phone
                }
                try {
                    const res = await createUserRequest(data);
                    if (res.statusCode === 200) {
                        console.log("success", res.data);
                        uni.navigateto({ url: "/pages/manager/managemant/list"});
                        uni.reLaunch({ url: "/pages/manager/managemant/list"});
                    } else {
                        console.error("fail:", res);
					    uni.showToast({ title: "Fail to create new user", icon: "none" });
                    }
                } catch (error) {
                    console.error("error:", error);
					uni.showToast({ title: "Error of creating new user", icon: "none" });
                }
            }
        },
        onShow () {
            if (this.thisRole[0] === "ADMIN") {
                this.getRoles();
            }
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
        gap: 20rpx;
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
        .sub_title {
            color: #101828; 
            font-family: Nunito;
            font-size: 40rpx;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            letter-spacing: -0.4px;
        }
        button {
            display: flex;
            width: 675rpx;
            height: 85rpx;
            justify-content: center;
            align-items: center;
            flex-shrink: 0;
            border-radius: 100px;
            border: none;
            background: #EFC462;
            color: #fff;
            text-align: center;
            font-family: Nunito;
            font-size: 30rpx;
            font-style: normal;
            font-weight: 600;
            line-height: 20px;
            letter-spacing: 0.1px;
            margin-bottom: 30rpx;
        }
        .new_user {
            width: 600rpx;
            padding: 30rpx 40rpx;
            border-radius: 10px;
            background: #FFF;
            display: flex;
            flex-direction: column;
            align-items: center;
            text {
                width: 600rpx;
                color: #101828; 
                font-family: Nunito;
                font-size: 30rpx;
                font-style: normal;
                font-weight: 600;
                line-height: normal;
                letter-spacing: -0.4px;
                margin-bottom: 10rpx;
                margin-top: 20rpx;
            }
            input {
                width: 560rpx;
                border-radius: 8px;
                padding: 20rpx;
                border: 1px solid #EAECF0;
                background: #fff;
                color: #344054;
                font-family: Inter;
                font-size: 26rpx;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                letter-spacing: -0.5px;
            }
            .selection {
                width: 560rpx;
                border-radius: 8px;
                padding: 20rpx;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                border: 1px solid #EAECF0;
                background: #fff;
                text {
                    color: #344054;
                    font-family: Inter;
                    font-size: 26rpx;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                    letter-spacing: -0.5px;
                    margin: 0;
                }
                image {
                    width: 40rpx;
                    height: 40rpx;
                }
            }
            .active {
                border-bottom: none;
                border-radius: 8px 8px 0 0;
            }
            .type_menu {
                width: 560rpx;
                padding: 20rpx;
                display: flex;
                flex-direction: column;
                align-items: start;
                border: 1px solid #EAECF0;
                background: #fff;
                border-radius: 0 0 8px 8px;
                gap: 20rpx;
                .type {
                    color: #344054;
                    font-family: Inter;
                    font-size: 26rpx;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                    letter-spacing: -0.5px;
                }
            }
        }
    }
</style>