<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入搜索姓名" class="input-with-select">
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button> </el-input
        ></el-col>
        <!-- 添加 -->
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1, // 页码
        pagesize: 5, // 页大小
      },
      // 用户列表数据
      userList: [],
            // 总记录数
      total: 0,
    };
  },
  created() {
        this.getUserList()

  },
  methods:{
    async getUserList(){
      const {data: res} = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if(res.meta.status !== 200){
          return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    }
  }
};
</script>

<style>
</style>