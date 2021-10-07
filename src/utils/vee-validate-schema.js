import { userCheckAccount } from '@/api/user'
export default {
  account (value) {
    // non-empty
    if (!value) return '请输入用户名或手机号'
    // start with letter and 6-20 chars
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6到20个'
    return true
  },
  async accountApi (value) {
    // non-empty
    if (!value) return '请输入用户名或手机号'
    // start with letter and 6-20 chars
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6到20个'

    // check account is unique or not
    const { result } = await userCheckAccount(value)
    if (result.valid) return '用户名已存在'

    return true
  },
  password (value) {
    // non-empty
    if (!value) return '请输入密码'
    // 6-24 chars
    if (!/^\w{6,24}$/.test(value)) return '6到24个字符'
    return true
  },
  rePassword (value, { form }) {
    if (!value) return '请输入密码'
    if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
    // 校验密码是否一致  form表单数据对象
    if (value !== form.password) return '两次输入的密码不一致'
    return true
  },
  mobile (value) {
    if (!value) return '请输入手机号'
    if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式错误'
    return true
  },
  code (value) {
    if (!value) return '请输入验证码'
    if (!/^\d{6}$/.test(value)) return '验证码是6个数字'
    return true
  },
  isAgree (value) {
    if (!value) return '请勾选同意用户协议'
    return true
  }
}
