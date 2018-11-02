<template>
  <div class="organization" v-loading.body="loading">
        <el-input
        placeholder="输入关键字进行过滤"
        class="search"
        v-model="filterText">
        </el-input>
        <el-tree
        class="filter-tree"
        :data="data"
        :indent= "10"
        :props="defaultProps"
        node-key="id"
        :render-content="renderContent"
        :filter-node-method="filterNode"
        ref="tree2">
        </el-tree>
      <!--底部按钮-->
      <div class="active button-list">
        <el-button size="small" @click="addDepartment('新增顶级')" type="success"
        v-show="(thisData.node.level == 1 && this.thisData.data.Layer<4 ||thisData.node.length == 0)&& this.power.dpetadd == '1'">新增顶级</el-button>
        <el-button size="small" @click="addDepartment('新增')" type="success"
        v-show="thisData.data.swiper === '1' && this.power.dpetadd == '1' && this.thisData.data.Layer<4" >新增</el-button>
        <el-button size="small" @click="addStaff('增员')" type="success"
        v-show="thisData.data.swiper === '1' && this.power.empadd == '1'">增员</el-button>
        <el-button size="small" @click="addDepartment('编辑')" type="warning"
        v-show="thisData.data.swiper === '1' &&thisData.node.length !== 0 && this.power.Edit == '1'">编辑</el-button>
        <el-button size="small" @click="dialogVisible4 = true" type="danger"
        v-show="thisData.data.FlagDeleted == 'False' && this.power.Edit == '1'" >作废</el-button>
        <el-button size="small" @click="dialogVisible4 = true" type="success"
        v-show="thisData.data.FlagDeleted == 'True' && this.power.Edit == '1'">开启</el-button>
        <el-button size="small" @click="dialogVisible5 = true" type="danger"
        v-show="thisData.data.swiper === '0' && this.power.EmpDel == '1'">删除</el-button>
        <el-button size="small" @click="addStaff('编辑')" type="warning"
        v-show="thisData.data.swiper === '0' && thisData.node.length !== 0 && this.power.EmpEdit == '1'">编辑</el-button>
        <!-- <el-button  type="success"
        v-show="thisData.data.swiper === '0' && this.power.Purview_Select == '1'">权限</el-button> -->
        <el-button size="small" @click="makeSure('离职')" type="danger"
        v-show="thisData.data.swiper === '0' && this.power.EmpStatus == '1'">离职</el-button>
        <!-- <el-button size="small" @click="dialogVisible8 = true" type="success"
        v-show="thisData.data.swiper === '0' && this.power.EmpStatus == '1'">邀请</el-button> -->
        <el-button size="small" @click="makeSure('正式')" type="success"
        v-show="thisData.data.Status === '待审' && this.power.EmpStatus == '1'">正式</el-button>
        <el-button size="small" @click="makeSure('驻场')" type="warning"
        v-show="thisData.data.OPResident === '0' && this.power.Resident == '1'">驻场</el-button>
        <el-button size="small" @click="makeSure('取驻')" type="warning"
        v-show="thisData.data.OPResident === '1' && this.power.Resident == '1'">取驻</el-button>
      </div>
    <!-- 新增,编辑部门 -->
      <el-dialog
        :title="dptType"
        :visible.sync="dialogVisible1"
        width="80%">
        <Form :model="formItem" :label-width="80" label-position="left">
            <FormItem label="名称">
                <Input v-model="formItem.name" placeholder="输入部门名称"></Input>
            </FormItem>
            <FormItem label="序号">
                <Select v-model="formItem.selectId">
                    <Option v-for="item in idOption" :key="item.value" :value="item.value">{{item.text}}</Option>
                </Select>
            </FormItem>
            <FormItem label="类型">
                <Select v-model="formItem.selectKide">
                    <Option v-for="item in selectKideOption" :key="item.value" :value="item.value">{{item.text}}</Option>
                </Select>
            </FormItem>
            <FormItem label="简称">
                <Select v-model="formItem.selectName">
                    <Option v-for="item in selectForHeader" :key="item.value" :value="item.value">{{item.text}}</Option>
                </Select>
            </FormItem>
            <FormItem label="管理人员">
                <Cascader
                :data="departmant"
                v-model="departmantValue"
                clearable size="large"
                filterable
                transfer
                change-on-select
                @close="beforeClose()"
                placeholder="试试搜索：部门">
                </Cascader>
                <div @click="selectMember()">
                <Cascader
                  :data="personOption"
                  placeholder="试试搜索：人员"
                  v-model="formItem.personValue"
                  clearable
                  size="large"
                  filterable
                  transfer
                  change-on-select
                ></Cascader>
                </div>
            </FormItem>
            <FormItem label="电话">
                <Input v-model="formItem.tel" placeholder="输入部门电话"></Input>
            </FormItem>
            <FormItem label="地址">
                <Input v-model="formItem.address" placeholder="输入部门地址"></Input>
            </FormItem>
            <FormItem label="业务">
                <i-switch v-model="formItem.switch" size="large">
                    <span slot="open">On</span>
                    <span slot="close">Off</span>
                </i-switch>
            </FormItem>
        </Form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="beforeClose()">取 消</el-button>
            <el-button type="primary" @click="handleClose1(formItem,dptType)">确 定</el-button>
        </span>
      </el-dialog>

    <!-- 增员编辑 -->
    <el-dialog
        :title="ppType"
        :visible.sync="dialogVisible2"
        @close="beforeClose()"
        width="80%">
        <Form :model="formItem2" :label-width="80" label-position="left">
          <div class="pic" style="display:flex;">
            <span style="line-height:100px;padding-right:10px">头像</span>
            <el-upload
              class="avatar-uploader"
              action="/Handler/Handler.ashx"
              :on-progress="uploadPic"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="fPicSrc" :src="fPicSrc" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
            <FormItem label="姓名">
                <Input v-model="formItem2.EmpName" placeholder="输入您的名字"></Input>
            </FormItem>
            <FormItem label="密码">
                <input type="password" v-model="formItem2.Password" class="ivu-input">
            </FormItem>
            <FormItem label="手机">
                <Input v-model="formItem2.Tel" placeholder="输入手机号码"></Input>
            </FormItem>
            <FormItem label="性别">
                <RadioGroup v-model="formItem2.Sex">
                    <Radio label="男">男</Radio>
                    <Radio label="女">女</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="部门">
                <Cascader
                :data="departmant"
                placeholder="试试搜索：部门"
                v-model="DeptID"
                clearable
                @on-visible-change="text"
                size="large"
                filterable
                transfer
                change-on-select
                ></Cascader>
                <el-button v-show="ppType==='编辑'" @click="dialogVisible7=true" type="danger">转移</el-button>
            </FormItem>
            <FormItem label="职务">
                <Select v-model="formItem2.PositionID">
                    <Option v-for="item in selectPosition" :key="item.value" :value="item.value">{{item.text}}</Option>
                </Select>
            </FormItem>
            <FormItem label="状态">
                <Select v-model="formItem2.Status">
                    <Option v-for="item in staticOption" :key="item.value" :value="item.value">{{item.text}}</Option>
                </Select>
            </FormItem>
            <FormItem label="楼盘">
                <Select v-model="formItem2.WorkEstate" clearable  placeholder="请选择楼盘">
                    <Option v-for="item in buildingOption" :value="item.value" :key="item.text"
                            size="large">{{ item.text }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="驻场">
                <i-switch v-model="formItem2.IsResident" size="large">
                    <span slot="oepn"></span>
                    <span slot="close"></span>
                </i-switch>
            </FormItem>
            <FormItem label="生日">
                <Row>
                    <Col>
                        <DatePicker type="date" placeholder="选择日期" v-model="formItem2.Birthday"></DatePicker>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="入职">
                <Row>
                    <Col>
                        <DatePicker type="date" placeholder="选择日期" v-model="formItem2.JoinDate"></DatePicker>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="离职">
                <Row>
                    <Col>
                        <DatePicker type="date" placeholder="选择日期" v-model="formItem2.AwayDate"></DatePicker>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="备注">
                <Input v-model="formItem2.Remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder=""></Input>
            </FormItem>
        </Form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="beforeClose()">取 消</el-button>
            <el-button type="primary" @click="handleClose2(formItem2)">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 作废开启确定 -->
     <el-dialog
        title="作废开启"
        :visible.sync="dialogVisible4"
        width="80%">
        <span>是否确定？</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible4 = false">取 消</el-button>
            <el-button type="primary" @click="flagDeleted()">确 定</el-button>
        </span>
      </el-dialog>
    <!-- 人员删除确定 -->
     <el-dialog
        title="人员删除"
        :visible.sync="dialogVisible5"
        width="80%">
        <span>是否确定？</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible5 = false">取 消</el-button>
            <el-button type="primary" @click="employeeDeleted()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 人员状态确定 -->
     <el-dialog
        :title="'人员'+selectType"
        :visible.sync="dialogVisible6"
        width="80%">
        <span>是否确定{{selectType}}？</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible6 = false">取 消</el-button>
            <el-button type="primary" @click="changeStatic(selectType)">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 邀请 -->
     <el-dialog
        title="邀请"
        :visible.sync="dialogVisible8"
        width="80%">
        <span>是否确认邀请？</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible8 = false">取 消</el-button>
            <el-button type="primary" @click="please()">确 定</el-button>
        </span>
      </el-dialog>

    <!-- 数据转移 -->
     <el-dialog
        title="数据转移"
        :visible.sync="dialogVisible7"
        width="80%">
        <el-checkbox-group v-model="selectList">
          <el-checkbox v-for="item in selectTrans" :key="item.text" :label="item.text"></el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible7 = false">取 消</el-button>
            <el-button type="primary" @click="handleClose4()">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
import wx from 'weixin-js-sdk'
// import wx from '@/common/js/weixin'
import { GetDepartmentJson,ImgUpLoad } from '../../api/public.js'
import { please,GetOrganization,Position,EmpStatus,Estate,SelectForDeptNo,SelectForHeader,DeptType,SelectByDeptID,GetEmployeeJson,addChange,upDepartment,upFlagDeleted,upPurviewForEmpID,upEmployee,deleteEmployee,SumCount,Selectbyid } from '../../api/organization/organization.js'
let id = 1000;

export default {
  data() {
    return {
      data: {
        todo: "ImgUpLoad",
        type: "SaveImgFile",
        needpurview: false,
        valiurl: document.URL
      },
      // 转移数据类型列表
      selectTrans: [
        { value: "Inquiry", text: "客源记录" },
        { value: "Property", text: "房源记录" },
        { value: "News", text: "新闻记录" },
        { value: "Message", text: "消息记录" },
        { value: "Contract", text: "合同记录" },
        { value: "Prepare", text: "合同报备" },
        { value: "FlowType", text: "过户流程" },
        { value: "ContractComm", text: "业绩分成" },
        { value: "Calendar", text: "日程安排" },
        { value: "Attendance", text: "考勤记录" }
      ],
      selectList: [], // 转移选择的类型
      dialogVisible7: false,
      loading: true,
      power: {}, // 权限
      dptType: '', // 部门新增还是编辑
      ppType: "", // 人员新增还是编辑
      thisFormItem: {}, // 当前部门数据
      thisPersonItem: {}, // 当前人员数据
      // 部门
      arrayData: {},
      // 管理部门
      departmantValue: [],
      // 管理人员
      personOption: [],
      // 部门
      departmant: [],
      // 楼盘
      buildingOption: [],
      idOption: [], // 序号数据
      selectForHeader: [], //部门简称数据
      selectKideOption: [], // 部门类型数据
      // 新增部门
      formItem: {
        name: "",
        selectId: [],
        selectName: [],
        selectKide: [],
        personValue: [],
        tel: "",
        address: "",
        switch: false
      },
      // 修改部门
      formItem3: {},

      //人员
      // 职位列表
      selectPosition: [],
      // 人员状态
      staticOption: [],
      fPicSrc: "",
      // 新增编辑人员
      DeptID: [],
      formItem2: {
        EmpName: "",
        Password: "",
        Tel: "",
        Sex: "",
        Status: "",
        PositionID: "",
        WorkEstate: [],
        IsResident: 0,
        Birthday: "",
        JoinDate: "",
        AwayDate: "",
        Remark: "",
        PicSrc: "",
        todo: "Employee",
        type: "insertData",
        valiurl: document.URL,
        needpurview: true
      },

      dialogVisible1: false, // 新增修改部门弹窗
      dialogVisible2: false, // 新增修改人员弹窗
      dialogVisible4: false, // 开启作废弹窗
      dialogVisible5: false, // 人员删除弹窗
      dialogVisible6: false, // 人员状态操作弹窗
      dialogVisible8: false, // 邀请确认
      selectType: "", // 操作转正，离职，待审状态
      filterText: "",
      thisData: {
        data: {},
        node: []
      }, // 当前操作的对象
      data: [], // 页面数据
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  mounted () {
    // 获取组织架构数据
    GetOrganization().then(res => {
        if (res.data.data) {
          this.data = eval(res.data.data);
          this.power = res.data;
        }
        if (res.data.result === '权限不足') {
          this.$message.error('权限不足')
          setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
        }
      })
      .catch(error => {
        console.log(error);
      });
    // 获取部门数据
    GetDepartmentJson().then(res => {
        if (res.data !== "") {
          this.departmant = eval(res.data);
        }
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
      });
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  methods: {

    renderContent(h, { node, data, store }) {
      return (
        <div
          on-click={() => this._do(node, data)}
          style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;"
          class={{ break: data.FlagDeleted === "作废" }}
        >
          <p>
            <span v-show={data.swiper === "0"} style="position:relative">
              <img
                src={data.PicSrc !== ''?data.PicSrc:'./static/img/default_header.png'}
                class="author"
                width="30"
                height="30"
                style="border-radius:45px;vertical-align: middle;margin-right:5px"
              />
              <span v-show={data.Status === "离职"} class="imgBackground" />
            </span>
            <span>{node.label}</span>
            <span v-show={data.swiper === "0"}>
              <span style="font-size: 10px;color: #a2a2a7;padding: 0 5px;">
                {data.PositionName}
              </span>
              <span v-show={data.iswx} style="font-size: 10px;color: #67C23A;">
                微信
              </span>
            </span>
          </p>
          <span>
            <span>
              <span style="color: #FA5555;padding-right:5px">
                {data.ChildDeptCount}
              </span>
              <span style="color: #67C23A">{data.ChildEmpCount}</span>
            </span>
            <span style="font-size:10px">
              <a href={"tel:" + data.tel} style="padding-right:5px">
                {data.tel}
              </a>
              <span>{data.Status}</span>
            </span>
          </span>
        </div>
      );
    },
    text() {
      console.log(0);
    },
    // 邀请
    please(){
      please().then((data)=>{
        if(data){
          this.dialogVisible8 = false
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: 'wxd477f8c4b596b5d5', // 必填，企业号的唯一标识，此处填写企业号corpid
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature,// 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'openLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function () {
                wx.onMenuShareTimeline({
                    title: '房管家聚仁国际分销启动大会邀请函', // 分享标题
                    link: 'http://app.vipfgj.com/Test/huadong/index.html', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'http://app.vipfgj.com/images/yqh.png', // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.onMenuShareAppMessage({
                    title: '房管家聚仁国际分销启动大会邀请函', // 分享标题
                    desc: '协作~跨越~共赢 [掘金2.1亿] 请尾页填写报名表方便我们布置会场和礼品 9月6日早上10点盛大启动', // 分享描述
                    link: 'http://app.vipfgj.com/Test/huadong/index.html', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'http://app.vipfgj.com/images/yqh.png', // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                this,open('邀请成功')
            });
        }
      }).catch()
    },
    // 弹窗关闭前
    beforeClose() {
      this.dialogVisible1 = false;
      this.dialogVisible2 = false;
      this.formItem = {
        name: "",
        selectId: [],
        selectName: [],
        selectKide: [],
        personValue: [],
        tel: "",
        address: "",
        switch: false
      };
      this.fPicSrc = "";
      this.formItem2 = {
        EmpName: "",
        Password: "",
        Tel: "",
        Sex: "",
        Status: "",
        PositionID: "",
        WorkEstate: [],
        IsResident: false,
        Birthday: "",
        JoinDate: "",
        AwayDate: "",
        Remark: "",
        PicSrc: "",
        todo: "Employee",
        type: "insertData",
        valiurl: document.URL,
        needpurview: true
      };
    },
    // 上传头像
    uploadPic(event, file, fileList) {
      console.log(file);
      let pic = "";
      let thisobj = this;
      let img = document.createElement("img");
      img.src = file.url;
      console.log(img);
      ImgUpLoad(img,img).then(res => {
          if (res.data.result === "success") {
            // alert('图片上传成功')
            this.formItem2.PicSrc = "http://app.vipfgj.com" + res.data.path;
            console.log(this.formItem2.PicSrc);
          } else if (res.data.result === "error") {
            thisobj.loading = false;
            // alert(res.data.errorcode)
            // thisobj.open(res.data.msg)
          }
        })
        .catch(error => {
          thisobj.loading = false;
          thisobj.open(error);
        });
    },
    handleAvatarSuccess(res, file) {
      this.fPicSrc = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 人员状态改变离职驻场转正
    changeStatic(type) {
      let OPResident = "";
      let status = type;
      if (type === "驻场" || type === "取驻") {
        OPResident =
          this.thisData.data.OPResident === "1"
            ? this.thisData.data.OPResident
            : "0";
        type = "";
      }
      upEmployee(this.thisData.data.EmpID,this.thisData.data.iswx,OPResident,OPResident).then(res => {
          if (res.data.result === "success") {
            this.open(type + "操作成功");
          } else if (res.data.result === "error") {
            this.open(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    makeSure(type) {
      this.selectType = type;
      this.dialogVisible6 = true;
    },
    // 人员删除
    employeeDeleted() {
      const node = this.thisData.node;
      const data = this.thisData.data;
      this.dialogVisible5 = false;
      deleteEmployee(this.thisData.data.value).then(res => {
          if (res.data.result === "success") {
            console.log(node.id)
            this.remove(node, data);
            this.open("删除成功");
            console.log(this.thisData.node.parent.data.ChildEmpCount)
            this.thisData.node.parent.data.ChildEmpCount =
              parseInt(this.thisData.node.parent.data.ChildEmpCount) - 1;
          } else if (res.data.result === "error") {
            this.open(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 部门作废开启
    flagDeleted() {
      this.dialogVisible4 = false;
      const DeptNo =
        this.thisData.data.value !== undefined
          ? this.thisData.data.value.split(",")[1]
          : "";
      const DeptID =
        this.thisData.data.value !== undefined
          ? this.thisData.data.value.split(",")[0]
          : "";
      const FlagDeleted = this.thisData.data.FlagDeleted === "False" ? 1 : 0
      upFlagDeleted(DeptID,DeptNo,FlagDeleted).then(res => {
          if (res.data.result === "success") {
            console.log(this.thisData.data.FlagDeleted);
            if (this.thisData.data.FlagDeleted === "False") {
              this.thisData.data.FlagDeleted = "True";
            } else {
              this.thisData.data.FlagDeleted = "False";
            }
            this.open("操作成功");
          } else if (res.data.result === "error") {
            this.open(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 人员数据转移
    transfer() {
      console.log(this.selectList);
      this.dialogVisible7 = false;
      this.selectTrans.forEach((value, index, array) => {
        let _this = value;
        this.selectList.forEach(value => {
          if (value === _this.text) {
            SumCount(_this.value,this.thisData.data.value).then(res => {
                if (res.data.result === "success") {
                  this.open("转移成功" + res.data.count);
                } else if (res.data.result === "error") {
                  this.open("res.data.msg");
                }
              })
              .catch();
          }
        });
      });
    },
    // 新增编辑人员
    addStaff(type) {
      this.ppType = type;
      this.dialogVisible2 = true;
      if (type === "编辑") {
        this.loading = true
        Selectbyid(this.thisData.data.value).then(res => {
            if (res.data.result === "success") {
              this.loading = false
              let psData = res.data.tempTable[0];
              this.thisPersonItem= psData;
              this.fPicSrc = psData.picSrc;
              let thisdpt = { label: psData.DeptName, value: psData.DeptID };
              console.log(thisdpt);
              this.departmant.push(thisdpt);
              this.DeptID = [thisdpt.value];
              this.formItem2 = {
                EmpName: psData.EmpName,
                Password: "",
                Tel: psData.Tel,
                Sex: psData.Sex,
                Status: psData.Status,
                PositionID: psData.PositionID,
                EmpID: psData.EmpID,
                WorkEstate: psData.WorkEstate,
                IsResident: psData.IsResident === "0" ? false : true,
                Birthday: psData.Birthday,
                JoinDate: psData.JoinDate,
                AwayDate: psData.AwayDate,
                DeptID: psData.DeptID,
                Remark: psData.Remark,
                PicSrc: psData.picSrc,
                todo: "Employee",
                type: "upEmployee",
                valiurl: document.URL,
                needpurview: true
              };
            } else if (res.data.result === "error") {
              this.open(res.data.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
      // 获取职务
      Position().then(res => {
          if (res.data.result === "success") {
            this.selectPosition = res.data.data;
          } else if (res.data.result === "error") {
            this.open(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
      // 获取状态
      EmpStatus().then(res => {
          if (res.data.result === "success") {
            this.staticOption = res.data.data;
          } else if (res.data.result === "error") {
            this.open(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
      // 获取工作楼盘
      Estate().then(res => {
          if (res.data.result === "success") {
            this.buildingOption = res.data.data;
          } else if (res.data.result === "error") {
            this.open(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 新增修改部门
    addDepartment(type) {
      let Layer = this.thisData.data.Layer;
      let deptNo =
        this.thisData.data.value !== undefined
          ? this.thisData.data.value.split(",")[1]
          : "";
      let DeptID =
        this.thisData.data.value !== undefined
          ? this.thisData.data.value.split(",")[0]
          : "";
      if (type === "新增顶级") {
        Layer = 0;
        deptNo = "";
      }
      // 获取可选序号
      SelectForDeptNo(Layer,deptNo).then(res => {
          console.log(res.data.result);
          if (res.data.result === "success") {
            this.idOption = res.data.data;
          } else if (res.data.result === "error") {
            this.open(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
      console.log(0)
      // 获取部门简称
      SelectForHeader().then(res => {
          if (res.data.result === "success") {
            this.selectForHeader = res.data.data;
          } else if (res.data.result === "error") {
            this.open(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
      // 获取部门类型
      DeptType().then(res => {
          if (res.data.result === "success") {
            this.selectKideOption = res.data.data;
          } else if (res.data.result === "error") {
            this.open(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
      // 获取部门数据
      SelectByDeptID(DeptID).then(res => {
          if (res.data) {
            let formData = [];
            formData = res.data.tempTable[0];
            this.dialogVisible1 = true;
            this.dptType = type === "编辑" ? type : "新增";
            if (this.dptType === "编辑") {
              this.idOption.unshift({
                text: formData.DeptNo,
                value: formData.DeptNo
              }); // 添加序号
              this.selectForHeader.unshift({
                text: formData.Header,
                value: formData.Header
              }); // 添加简称
              this.personOption.unshift({
                value: formData.EmpID,
                label: formData.EmpName,
                openid: formData.openid
              }); // 添加管理人员
              console.log(this.personOption);
              this.formItem = {
                name: formData.DeptName,
                selectId: formData.DeptNo,
                selectName: formData.Header,
                DeptID: DeptID,
                selectKide: formData.DeptType,
                personValue: [formData.EmpID],
                tel: formData.Tel,
                address: formData.Address,
                switch: formData.FlagSale === "True" ? true : false
              };
              console.log(formData);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //选择管理人员
    selectMember() {
      if (this.departmantValue.length == 0) {
        return;
      }
      let len = this.departmantValue.length;
      let id = this.departmantValue[len - 1].split(",");
      GetEmployeeJson(id[0]).then(res => {
          if (res.data) {
            this.personOption = eval(res.data);
          } else {
            console.log("请求失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 新增部门确认
    handleClose1(formItem, type) {
      if (
        formItem.name !== "" &&
        formItem.selectId.length !== 0 &&
        formItem.selectName.length !== 0 &&
        formItem.selectKide.length !== 0
      ) {
        this.$confirm("确认？")
          .then(_ => {
            if (type === "新增") {
              this.append(formItem);
            } else if (type === "编辑") {
              this.changeDpt(formItem);
            }
          })
          .catch(_ => {});
      } else {
        this.open("新增内容不能为空");
      }
    },
    // 新增人员确认
    handleClose2(formItem) {
      if (
        formItem.EmpName &&
        formItem.Tel &&
        formItem.PositionID &&
        this.DeptID.length !== 0
      ) {
        this.$confirm("确认？")
          .then(_ => {
            if (this.ppType === "增员") {
              this.append(formItem);
            } else {
              this.changePs(formItem);
            }
          })
          .catch(_ => {});
      } else {
        this.open("新增内容不能为空");
      }
    },
    // 数据转移确认
    handleClose4() {
      this.$confirm("确认？")
        .then(_ => {
          this.transfer();
        })
        .catch(_ => {});
    },

    // 新增
    append(formItem) {
      this.dialogVisible1 = false;
      this.dialogVisible2 = false;
      let label = formItem.name;
      let data = this.thisData.data;
      let deptNo =
        this.thisData.data.value !== undefined
          ? this.thisData.data.value.split(",")[1]
          : "";
      let ManageOpenID = "";
      this.personOption.forEach(value => {
        if (value.value === this.formItem.personValue[0]) {
          ManageOpenID = value.openid;
        }
      });
      let _data = this.thisData.data;
      let ss = deptNo + this.formItem.selectId;
      if (formItem.selectId) {
        const paramsItem = {
              todo: "Department",
              type: "insertData",
              DeptName: this.formItem.name,
              DeptNo: deptNo + this.formItem.selectId,
              DeptType: this.formItem.selectKide,
              Layer:
                this.thisData.data.length === 0
                  ? 1
                  : parseInt(this.thisData.data.Layer) + 1,
              Header: this.formItem.selectName,
              FlagSale: this.formItem.selectKide === "业务" ? 1 : 0,
              Tel: this.formItem.tel,
              Address: this.formItem.address,
              ManageID: this.formItem.personValue[0],
              ManageOpenID: ManageOpenID,
              valiurl: document.URL,
              needpurview: true
        }
        // 新增部门
        addChange(paramsItem).then(res => {
            if (res.data.result === "success") {
              this.open("新增成功");
              this.thisData.data.ChildDeptCount =
                parseInt(this.thisData.data.ChildDeptCount) + 1;
              let newChild = {
                id: id++,
                children: [],
                ChildDeptCount: "0",
                ChildEmpCount: "0",
                DeptType: this.formItem.selectKide,
                FlagDeleted:
                  this.formItem.selectKide === "业务" ? "True" : "False",
                label: this.formItem.name,
                Layer:
                  this.thisData.data.length === 0
                    ? 1
                    : parseInt(this.thisData.data.Layer) + 1,
                value: res.data.DeptID + "," + ss,
                selectId: formItem.selectId
              };
              console.log(newChild);
              this.add(_data, newChild);
            } else if (res.data.result === "error") {
              this.open(res.data.msg);
            }
            this.formItem = {
              name: "",
              selectId: [],
              selectName: [],
              selectKide: [],
              personValue: [],
              tel: "",
              address: "",
              switch: false
            };
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        // 新增人员
        // this.arrayData = {
        //   ChildDeptCount: "0",
        //   ChildEmpCount: "0",
        //   DeptType: this.formItem.selectKide,
        //   FlagDeleted: this.formItem.selectKide === "业务" ? 1 : 0,
        //   Layer:
        //     this.thisData.data.length === 0
        //       ? 1
        //       : parseInt(this.thisData.data.Layer) + 1,
        //   label: this.formItem.name
        // };
        this.formItem2.DeptID = this.DeptID[this.DeptID.length - 1].split(",")[0];
        const FormItem = this.formItem2
        addChange(FormItem).then(res => {
            if (res.data.result === "success") {
              console.log(FormItem)
              this.open("新增成功");
              this.thisData.data.ChildEmpCount =
                parseInt(this.thisData.data.ChildEmpCount) + 1;
              //状态
              let PositionName = "";
              this.selectPosition.forEach(value => {
                if (FormItem.PositionID === value.value) {
                  PositionName = value.text;
                }
              });
              let newChild = {
                id: id++,
                children: [],
                PicSrc: FormItem.PicSrc,
                PositionName: PositionName,
                Status: FormItem.Status,
                swiper: 0,
                label: FormItem.EmpName,
                tel: FormItem.Tel,
                value: res.data.empid,
                PositionID: FormItem.PositionID
              };
              this.add(_data, newChild);
            } else if (res.data.result === "error") {
              this.open(res.data.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    add(data, newChild) {
      console.log(newChild)
      if (newChild.selectId) {
        newChild.swiper = "1";
      } else {
        newChild.swiper = "0";
      }
      newChild.id = newChild.id++
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === node.id);
      children.splice(index, 1);
    },
    // 修改确认
    handleClose3(formItem) {
      this.$confirm("确认？")
        .then(_ => {
          this.change(formItem);
        })
        .catch(_ => {});
    },
    //修改编辑部门
    changeDpt(formItem) {
      this.dialogVisible1 = false;
      this.dialogVisible2 = false;
      const data = this.thisData.data;
      let ManageOpenID = "";
      const Layer =  this.thisData.data.length === 0? 1: parseInt(this.thisData.data.Layer)
      this.personOption.forEach(value => {
        if (value.value === formItem.personValue[0]) {
          ManageOpenID = value.openid;
        }
      });
      upDepartment(formItem,Layer,ManageOpenID).then(res => {
          if (res.data.result === "success") {
            this.open("编辑成功");
            console.log(formItem.name);
            data.label = formItem.name;
            data.DeptType = formItem.selectKide;
            data.FlagSale = formItem.selectKide === "业务" ? 1 : 0;
            data.value = res.data.DeptID + formItem.selectId;
            formItem = {
              name: "",
              selectId: [],
              selectName: [],
              selectKide: [],
              personValue: [],
              tel: "",
              address: "",
              switch: false
            };
          } else if (res.data.result === "error") {
            this.open(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 修改编辑人员
    changePs(formItem) {
      this.dialogVisible1 = false;
      this.dialogVisible2 = false;
      const data = this.thisData.data;
      (this.formItem2.IsResident = this.formItem2.IsResident === true ? 1 : 0),
        addChange(this.formItem2).then(res => {
            if (res.data.result === "success") {
              this.open("修改成功");
              data.PicSrc = formItem.PicSrc
              data.label = formItem.EmpName
              this.selectPosition.forEach((value)=>{
                if(value.value === formItem.PositionID){
                  data.PositionName = value.text
                }
              })
              if (this.thisPersonItem.PositionID !== this.formItem2.PositionID) {
                // 职位更改权限变化
                upPurviewForEmpID(this.formItem2.EmpID,this.formItem2.PositionID).then(res => {
                    if (res.data.result === "success") {
                      this.open("权限变更成功");
                    } else if (res.data.result === "error") {
                      this.open(res.data.msg);
                    }
                  })
                  .catch();
              }
              this.empty()
            } else if (res.data.result === "error") {
              this.open(res.data.msg);
              this.empty() // 初始化
            }
          })
          .catch();
    },
    // 操作
    _do(node, data) {
      console.log(node);

      const parent = node.parent;
      const children = parent.data.children || parent.data;
      console.log(children.findIndex(d => d.id === data.id));
      this.thisData.node = node;
      this.thisData.data = data;
      // this.buttonShow = true;
    },
    filterNode(value, data) {
      if (!value) return true;
      let a =
        data.tel && data.tel !== "" ? data.tel.indexOf(value) !== -1 : false;
      let b = data.label.indexOf(value) !== -1;
      let c = data.Status ? data.Status.indexOf(value) !== -1 : false;
      if (a || b || c) {
        return true;
      }
      return false;
    },

    // 提示
    open(msg) {
      this.$message(msg);
    },
    // 初始化
    empty(){
      this.formItem2 = {
        EmpName: "",
        Password: "",
        Tel: "",
        Sex: "",
        Status: "",
        PositionID: "",
        WorkEstate: [],
        IsResident: 0,
        Birthday: "",
        JoinDate: "",
        AwayDate: "",
        Remark: "",
        PicSrc: "",
        todo: "Employee",
        type: "insertData",
        valiurl: document.URL,
        needpurview: true
      };
    }
  }
};
</script>

<style lang="stylus">
.pic .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin: 10px 50px;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 10px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.author
  background url(../login/default_header.png)
  background-size: 100%
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.el-message-box {
  width: 80% !important;
}

.imgBackground {
  width: 30px;
  height: 30px;
  background: rgba(183, 179, 179, 0.8);
  position: absolute;
  top: -6px;
  left: 0px;
  border-radius: 45px;
}

.ivu-cascader-transfer {
  z-index: 2300;
  white-space: normal;
}

.ivu-cascader-menu {
  background: #fff;
}

.organization {
  height: 100%;

  .el-tree-node__content {
    display: flex;
    height 36px
    justify-content: space-between;
  }

  .el-tree {
    padding-top: 44px;
    height: 90%;
    overflow: scroll;
    position: fixed;
    width: 100%;
    overflow-x: hidden;
  }

  .search {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 200;
  }

  .ivu-form-item-content {
    display: flex;
  }

  .el-button {
    margin-left: 5px;
  }
  .el-dialog{
    margin-top: 6vh !important;
  }
  .el-dialog--small {
    width: 90%;
    top: 8% !important;
  }

  .el-tree-node__expand-icon {
    margin: 12px 8px;
  }


  .button-list {
    display: flex;
    position: fixed;
    z-index: 2;
    transition: all 0.2s linear;
    width: 100%;
    bottom: -144px;
    left: 0;

    &.active {
      bottom: 10px;
    }

    button {
      width: 100%;
      margin: 0 5px;
    }
  }
}
</style>
