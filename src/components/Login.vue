<template>
    <div class="login-container">
        <div class="login-left">
            <img src="../assets/imgs/login_img.png" alt="登录框">
        </div>
        <div class="login-box">
            <div class="avatar-box">
                <img src="../assets/imgs/login_logo.png" alt="头像框">
            </div>
            <div class="title">
                电商后台管理系统
            </div>
            <!-- 登录表单 -->
            <el-form ref="form">
                <el-form-item label="活动名称">
                    <el-input ></el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.login-container {
    background: #93defe;
    height: 100%;
    display: flex;
    justify-self: center;
    align-items: center;

    .login-left{
        margin-left: 100px;
    }

    .login-box{
        width: 400px;
        height: 400px;
        background: #fff;
        padding: 50px;
        border-radius: 6px;
        box-sizing: border-box;
        position: relative;

        .avatar-box{
            width: 120px;
            height: 120px;
            border: 5px solid #93defe;
            border-radius: 100px;
            text-align: center;
            line-height: 110px;
            position: absolute;
            top: -60px;
            right: 140px;
            background: #fff;
        }

        .title{
            position: absolute;
            top: 100px;
            left: 50%;
            transform: translate(-50%);
            font-size: 18px;
            color: #444;
        }
    }
}

</style>
