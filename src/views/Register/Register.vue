<template>
  <Header></Header>
  <div class="register-container">
    <!-- 注册内容 -->
    <div class="register">
      <h3>
        注册新用户
        <span class="go"
        >我有账号，去 <a href="login.html" target="_blank">登陆</a>
        </span>
      </h3>
      <!--      :model 绑定数据源-->
      <el-form
          ref="ruleForm"
          :model="userInfo"
          status-icon
          :rules="rules"
      >
        <el-form-item class="content" prop="phone">
          <!--        prop:写绑定数据源下的数据 比如上面绑定了userInfo，prop就写phone-->
          <label>手机号:</label>
          <el-input

              placeholder="请输入你的手机号"
              name="phone"
              v-model="userInfo.phone"

          />
        </el-form-item>
        <el-form-item class="content" prop="code">
          <label>验证码:</label>
          <el-input
              placeholder="请输入你的验证码"
              v-model="userInfo.code"
              name="code"

          />
          <el-button style="width:100px;height:38px" @click="getCode">
            获取验证码
          </el-button>
          <!--        <span class="error-msg"></span>-->

        </el-form-item>
        <el-form-item class="content" prop="password">
          <label>登录密码:</label>
          <el-input
              placeholder="请输入你的密码"
              v-model="userInfo.password"
              name="password"

          />
          <!--        <span class="error-msg"></span>-->

        </el-form-item>
        <el-form-item class="content" prop="password2">
          <label>确认密码:</label>
          <el-input
              placeholder="请输入确认密码"
              v-model="userInfo.password2"
              name="password2"

          />
          <!--        <span class="error-msg"></span>-->

        </el-form-item>
        <el-form-item class="controls" prop="isCheck">
          <el-checkbox
              type="checkbox"
              :checked="userInfo.isCheck"
              name="agree"

          />
          <span>同意协议并注册《尚品汇用户协议》</span>
          <!--        <span class="error-msg"></span>-->

        </el-form-item>
        <el-form-item class="btn">
          <button @click.prevent="userRegister">完成注册</button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 底部 -->
    <div class="copyright">
      <ul>
        <li>关于我们</li>
        <li>联系我们</li>
        <li>联系客服</li>
        <li>商家入驻</li>
        <li>营销中心</li>
        <li>手机尚品汇</li>
        <li>销售联盟</li>
        <li>尚品汇社区</li>
      </ul>
      <div class="address">地址：北京市昌平区宏福科技园综合楼6层</div>
      <div class="beian">京ICP备19006430号</div>
    </div>
  </div>
</template>
<script>
import Header from '@/components/Header'
import {nextTick, onMounted, reactive, ref} from "vue";
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'

export default {
  name: "Register",
  components: {Header},
  setup() {
    let userInfo = reactive({
      phone: '',
      code: '',
      password: '',
      password2: '',
      isCheck: true
    })
    let store = useStore();
    let router = useRouter();
    //点击获取验证码
    let getCode = async () => {
      try {
        //发送vuex获取验证码
        if (userInfo.phone) {
          let result = await store.dispatch('getCode', userInfo.phone);
          userInfo.code = result
        }
      } catch (error) {
        alert(error.message)
      }
    }


    //1.element-plus校验
    let ruleForm = ref(null);
    onMounted(()=>{
    })
    //自定义校验密码
    const validatePass = (rule, value, callback) => {
      console.log(rule,value,callback)
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {

        if (userInfo.password !== '') {
          ruleForm.value.validateField('password2')
        }

        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请重新输入密码'))
      } else if (value !== userInfo.password) {
        callback(new Error("两次密码不相同!"))
      } else {
        callback()
      }
    }

    //2.创建校验规则  这里写prop后定义的名字
    let rules = reactive({
      phone:[
        {
          required: true,
          message: '请填写手机号码',
          trigger: 'blur',
        },
        {
          min: 11,
          max: 11,
          message: '请填写11位数的手机号码',
          trigger: 'blur',
        },
      ],
      code:[
        {
          required: true,
          message: '请填写验证码',
          trigger: 'blur',
        },
        {
          min: 6,
          max: 6,
          message: '请填写6位数的验证码',
          trigger: 'blur',
        },
      ],
      password:[{ validator: validatePass, trigger: 'blur' }],
      password2:[{ validator: validatePass2, trigger: 'blur' }],
      isCheck:[{
        required: true,
        message: '这里必须同意！',
        trigger: 'blur',
      }]
    })

    //点击注册
    let userRegister = () => {
      ruleForm.value.validate(async (valid) => {
        if (valid) {
          alert('submit!')
          try {
            let phone = userInfo.phone;
            let password = userInfo.password;
            let code = userInfo.code;
            let res = await store.dispatch('userRegister',{phone,code,password})
            console.log(res)
            await router.push('/login')
          } catch (error) {
            alert('注册失败！'+error.message)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      });

    }
    return {userInfo, getCode, userRegister, validatePass2, validatePass, ruleForm, rules}
  }
}
</script>

<style lang="less" scoped>
.register-container {
  .register {
    width: 1200px;
    height: 445px;
    border: 1px solid rgb(223, 223, 223);
    margin: 0 auto;


    h3 {
      background: #ececec;
      margin: 0;
      padding: 6px 15px;
      color: #333;
      border-bottom: 1px solid #dfdfdf;
      font-size: 20.04px;
      line-height: 30.06px;

      span {
        font-size: 14px;
        float: right;

        a {
          color: #e1251b;
        }
      }
    }

    div:nth-of-type(1) {
      margin-top: 40px;
    }

    .content {
      padding-left: 390px;
      margin-bottom: 18px;
      position: relative;

      label {
        font-size: 14px;
        width: 96px;
        text-align: right;
        display: inline-block;
      }

      .el-input {
        width: 270px;
        height: 38px;

        box-sizing: border-box;

        outline: none;
        //border: 1px solid #999;
      }

      img {
        vertical-align: sub;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .controls {
      text-align: center;
      position: relative;

      input {
        vertical-align: middle;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .btn {
      text-align: center;
      line-height: 36px;
      margin: 17px 0 0 55px;

      button {
        outline: none;
        width: 270px;
        height: 36px;
        background: #e1251b;
        color: #fff !important;
        display: inline-block;
        font-size: 16px;
      }
    }
  }

  .copyright {
    width: 1200px;
    margin: 0 auto;
    text-align: center;
    line-height: 24px;

    ul {
      li {
        display: inline-block;
        border-right: 1px solid #e4e4e4;
        padding: 0 20px;
        margin: 15px 0;
      }
    }
  }
}
</style>