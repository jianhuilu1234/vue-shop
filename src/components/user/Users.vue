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
          <el-input placeholder="请输入搜索姓名" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <!-- 添加 -->
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- <template> -->
    <el-table :data="userList" stripe border>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state"> </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="role_name">
        <el-tooltip
          effect="dark"
          content="分配角色"
          placement="top"
          :enterable="false"
        >
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除" placement="top">
          <el-button type="danger" icon="el-icon-delete" circle></el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="设置" placement="top">
          <el-button type="warning" icon="el-icon-setting" circle></el-button>
        </el-tooltip>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
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
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
      // console.log(res);
    },
    // 监听pagesize改变的事件
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      this.getUserList()
    },
    // 监听pagenum改变的事件
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getUserList()
    },
  },
};
</script>

<style>
</style>