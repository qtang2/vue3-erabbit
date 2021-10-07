<template>
  <LoginHeader>联合登录</LoginHeader>
  <section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container" v-else>
    <nav class="tab">
      <a
        @click="hasAccount = true"
        :class="{ active: hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a
        @click="hasAccount = false"
        :class="{ active: !hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId="unionId" />
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId="unionId" />
    </div>
  </section>

  <LoginFooter />
</template>

<script>
import { ref } from 'vue'
import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import CallbackBind from './components/callback-bind'
import CallbackPatch from './components/callback-patch'
import { userQQLogin } from '@/api/user'
import Message from '@/components/library/Message'
import QC from 'qc'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'PageCallback',
  components: { LoginHeader, LoginFooter, CallbackBind, CallbackPatch },
  setup () {
    const hasAccount = ref(true)
    // const nickname = ref(null)
    // const avatar = ref(null)
    // by default, user already registered and bind with QQ number
    // so get openId using QQ, then user openId to login to Xtx
    // if login succeed, then go to index page(means alreagy register and bind QQ)
    // if failed
    //   1. has xtx account, not bind,
    //   2. no xtx account and not bind
    const store = useStore()
    const router = useRouter()
    const isBind = ref(true)
    const unionId = ref(null)
    if (QC.Login.check()) {
      QC.Login.getMe((openId) => {
        unionId.value = openId
        // use openId to login to xtx
        userQQLogin(openId).then(data => {
          // succeed login to xtx
          const { id, account, nickname, avatar, token, mobile } = data.result

          store.commit('user/setUser', { id, account, nickname, avatar, token, mobile })
          // redirect to the page before
          router.push(store.state.user.redirectUrl)

          Message({ type: 'success', text: 'QQ 登录成功' })
        }).catch(e => {
          // failed login xtx
          // isBind false means QQ bot bind with xtx
          isBind.value = false
        })
      })
    }
    return { hasAccount, isBind, unionId }
  }
}
</script>

<style scoped lang='less'>
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center /
        100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
