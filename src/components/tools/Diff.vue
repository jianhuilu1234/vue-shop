<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>测试工具</el-breadcrumb-item>
      <el-breadcrumb-item>Diff性能</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索项目"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getDiffList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getDiffList"
            ></el-button> </el-input
        ></el-col>
        <!-- 添加 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加项目</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
      title="添加设置"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addFormClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="项目名称" prop="diffName">
          <el-input v-model="addForm.diffName"></el-input>
        </el-form-item>
        <el-form-item label="请求间隔时间" prop="interval">
          <el-input v-model="addForm.interval"></el-input>
        </el-form-item>
        <el-form-item label="响应时间门限" prop="resp_overtime">
          <el-input v-model="addForm.resp_overtime"></el-input>
        </el-form-item>
        <el-form-item label="运行时间" prop="runtime">
          <el-input v-model="addForm.runtime"></el-input>
          <!-- <el-input placeholder="请设置运行时间" suffix-icon="el-icon-date"  v-model="addForm.resp_overtime"></el-input> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProject">确 定</el-button>
      </div>
    </el-dialog>

    <el-table :data="diffList" stripe border>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="项目名称" prop="diffName"></el-table-column>
      <el-table-column label="请求间隔时间" prop="interval"></el-table-column>
      <el-table-column label="响应时间门限" prop="resp_overtime"></el-table-column>
      <el-table-column label="运行时间" prop="runtime"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="diffStateChange(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="role_name">
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            content="修改diff项目"
            placement="top"
            :enterable="false"
          >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showEditProject(scope.row.id)"
            ></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="deleteProjectById(scope.row.id)"
            ></el-button>
          </el-tooltip>
        </template>
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

    <el-dialog
      title="修改项目设置"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editFormClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="项目名称" prop="diffNamediffName">
          <el-input v-model="editForm.diffName" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="interval">
          <el-input v-model="editForm.interval"></el-input>
        </el-form-item>
        <el-form-item label="响应超时门限" prop="resp_overtime">
          <el-input v-model="editForm.resp_overtime"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editProject">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      // 查询diff项目列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1, // 页码
        pagesize: 5, // 页大小
      },
      // diff项目列表数据
      diffList: [],
      // 总记录数
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      roleDialogVisible: false,
      addForm: {
        diffName: "",
        runtime: "",
        interval: "",
        resp_overtime: "",
      },
      editForm: {},

      // 添加diff项目的校验规则
      addFormRules: {
        diffName: [
          { required: true, message: "请输入项目名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        resp_overtime: [
          {  required: true,message: "请输入响应时间门限值", trigger: "blur" },
          {
            min: 1,
            max: 6,
            message: "接口响应时间在 1 到 100000毫秒范围内",
            trigger: "blur",
            pattern:
              /^\d+$/,
            
          },
        ],
   
        
      },
      // 编辑diff项目的校验规则
      editFormRules: {
        interval: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "blur",
          },
        ],
        resp_overtime: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern:
              /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
      },
      seletedRoleId: null,
      diffInfo: {},
      rolesList: [],
    };
  },
  created() {
    this.getDiffList();
  },
  methods: {
    async getDiffList() {
      const { data: res } = await this.$http.get("diff", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取DIFF测试项目列表失败");
      }
      this.diffList = res.data.diffs;
      this.total = res.data.total;
      console.log(this.diffList);
    },

    async diffStateChange(diffInfo) {
      const { data: res } = await this.$http.put(
        `diff/${diffInfo.id}/state/${diffInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        diffInfo.mg_state = !diffInfo.mg_state;
        return this.$message.error("状态更新失败！");
      }
      return this.$message.success("更新项目运行状态成功！");
    },
    // 监听pagesize改变的事件
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      this.getDiffList();
    },
    // 监听pagenum改变的事件
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getDiffList();
    },
    // 监听添加diff项目对话框的关闭事件
    addFormClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addProject() {
      this.$refs.addFormRef.validate(async (validate) => {
        if (!validate) {
          return;
        }
        const { data: res } = await this.$http.post("diff", this.addForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加diff项目失败");
        }
        this.addDialogVisible = false;
        this.$message.success("添加diff项目成功");
        this.getDiffList();
      });
    },
    async showEditProject(id) {
      const { data: res } = await this.$http.get(`diff/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取当前diff项目数据失败");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editProject() {
      this.$refs.editFormRef.validate(async (validate) => {
        if (!validate) {
          this.$message.error("数据填写错误，请检查");
          return;
        }
        const { data: res } = await this.$http.put(
          `diff/${this.editForm.id}`,
          {
            interval: this.editForm.interval,
            resp_overtime: this.editForm.resp_overtime,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新diff项目信息失败!");
        }
        this.editDialogVisible = false;
        this.getDiffList();
        this.$message.success("更新diff项目信息成功!");
      });
    },
    // 监听添加diff项目对话框的关闭事件
    editFormClosed() {
      this.$refs.editFormRef.resetFields();
    },
    deleteProjectById(id) {
      this.$confirm("确定删除该diff项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`diff/${id}`);
          if (res.meta.status !== 200) {
            return this.$message.error("删除diff项目失败!");
          }
          this.getDiffList();
          this.$message.success("删除diff项目成功!");
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },

  },
};
</script>

<style>
</style>