<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>测试工具</el-breadcrumb-item>
      <el-breadcrumb-item>自动化覆盖率</el-breadcrumb-item>
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
            @clear="getProjectsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getProjectsList"
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
        <el-form-item label="项目组" prop="projectName">
          <el-input v-model="addForm.projName"></el-input>
        </el-form-item>
        <el-form-item label="子系统ID" prop="sysID">
          <el-input v-model="addForm.sysID"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="onwer">
          <el-input v-model="addForm.onwer"></el-input>
        </el-form-item>
        <el-form-item label="通知邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
          <!-- <el-input placeholder="请设置运行时间" suffix-icon="el-icon-date"  v-model="addForm.resp_overtime"></el-input> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProject">确 定</el-button>
      </div>
    </el-dialog>

    <el-table :data="projectList" stripe border>
      <el-table-column label="明细" type="expand">
          <template slot-scope="scope">
            <el-table :data="scope.row.children" stripe border>
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column label="子系统" prop="sysName"></el-table-column>
              <el-table-column label="自动化率" prop="ratio"></el-table-column>
              <el-table-column label="用例数量" prop="case"></el-table-column>
              <el-table-column label="自动化数量" prop="autocase"></el-table-column>
              <el-table-column label="结果" prop="result"></el-table-column>
              <!-- <el-table-column label="结果" >
                <template slot-scope="scope1">
                  <el-button
                    :type="getResultInfoByResult(scope1.result).type"
                    :icon="getResultInfoByResult(scope1.row.result).icon"
                    size="mini"
                    circle
                  ></el-button>
                </template >
            </el-table-column> -->
            </el-table>
          </template>
        </el-table-column>

      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="项目组" prop="projectName"></el-table-column>
      <el-table-column label="自动化率" prop="ratio"  width='90' ></el-table-column>
      <el-table-column label="负责人" prop="owner"></el-table-column>
      <el-table-column label="通知邮箱" prop="email" width='190' ></el-table-column>
      <el-table-column label="结果"  prop="success" width='90'>
          <template slot-scope="scope">
            <el-button
              :type="getResultInfoByResult(scope.row.result).type"
              :icon="getResultInfoByResult(scope.row.result).icon"
              size="mini"
              circle
            ></el-button>
          </template >
      </el-table-column>
      <el-table-column label="状态" width="90" >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="projectStateChange(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="role_name" >
        <template slot-scope="scope">
          <el-tooltip
            effect="dark"
            content="修改项目"
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
      title="编辑"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editFormClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="15%"
        class="demo-ruleForm"
      >
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="editForm.projectName" disabled></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="owner">
          <el-input v-model="editForm.owner"></el-input>
        </el-form-item>
        <el-form-item label="通知邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="子系统ID" prop="resp_overtime">
          <el-input v-model="editForm.sysID"></el-input>
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
      // 查询项目列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1, // 页码
        pagesize: 5, // 页大小
      },
      // 项目列表数据
      projectList: [],
      projectDetailList: [],
      // 总记录数
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      roleDialogVisible: false,
      addForm: {
        projectName: "",
        sysID: "",
        owner: "",
        email: "",
      },
      editForm: {},

      // 添加项目的校验规则
      addFormRules: {
        projectName: [
          { required: true, message: "请输入项目名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "blur",
          },
        ],
        sysID: [
          {  required: true,message: "请输入子系统ID，多个以逗号隔开", trigger: "blur" },
          {
            // min: 1,
            // max: 4,
            message: "请输入子系统ID，多个以逗号隔开",
            trigger: "blur",
            // pattern:
            //   /^\d+$/,
            
          },
        ],
   
        
      },
      // 编辑项目的校验规则
      editFormRules: {
        projectName: [
          { required: true, message: "请输入项目名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "blur",
          },
        ],
        sysID: [
          {  required: true,message: "请输入子系统ID，多个以逗号隔开", trigger: "blur" },
          {
            // min: 1,
            // max: 4,
            message: "请输入子系统ID，多个以逗号隔开",
            trigger: "blur",
            // pattern:
            //   /^\d+$/,
            
          },
        ],
      },
      seletedRoleId: null,
      projectInfo: {},
      rolesList: [],
    };
  },
  created() {
    this.getProjectsList();
  },
  methods: {
    async getProjectsList() {
      const { data: res } = await this.$http.get("auto", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取项目列表失败");
      }
      this.projectList = res.data.projects;
      this.total = res.data.total;
      console.log(this.projectList);
    },

    async projectStateChange(projectInfo) {
      const { data: res } = await this.$http.put(
        `auto/${projectInfo.id}/state/${projectInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        projectInfo.mg_state = !projectInfo.mg_state;
        return this.$message.error("状态更新失败！");
      }
      return this.$message.success("更新项目运行状态成功！");
    },
    // 监听pagesize改变的事件
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      this.getProjectsList();
    },
    // 监听pagenum改变的事件
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getProjectsList();
    },
    // 监听添加项目对话框的关闭事件
    addFormClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addProject() {
      this.$refs.addFormRef.validate(async (validate) => {
        if (!validate) {
          return;
        }
        const { data: res } = await this.$http.post("auto", this.addForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加项目失败");
        }
        this.addDialogVisible = false;
        this.$message.success("添加项目成功");
        this.getProjectsList();
      });
    },
    async showEditProject(id) {
      const { data: res } = await this.$http.get(`auto/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取当前项目数据失败");
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
          `auto/${this.editForm.id}`,
          {
            interval: this.editForm.interval,
            resp_overtime: this.editForm.resp_overtime,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新项目信息失败!");
        }
        this.editDialogVisible = false;
        this.getProjectsList();
        this.$message.success("更新项目信息成功!");
      });
    },
    // 监听添加项目对话框的关闭事件
    editFormClosed() {
      this.$refs.editFormRef.resetFields();
    },
    deleteProjectById(id) {
      this.$confirm("确定删除该项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`auto/${id}`);
          if (res.meta.status !== 200) {
            return this.$message.error("删除项目失败!");
          }
          this.getProjectsList();
          this.$message.success("删除项目成功!");
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 监听添加项目对话框的关闭事件
    getResultInfoByResult(result) {
      if (result) {
        return {"type": "success", "icon": "el-icon-success"}
      } else{
        return {"type": "danger", "icon": "el-icon-error"}
      }
      
    },
    async getProjectDetailById(id) {
        const {data: res} = await this.$http.get(`auto/${id}/detail`);
        if (res.meta.status !== 200) {
        return this.$message.error("获取当前项目详细数据失败");
      }
      this.projectDetailList = res.data;
      // this.editDialogVisible = true;
    },
  },
};
</script>

<style>
</style>