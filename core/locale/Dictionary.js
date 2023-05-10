import localeConfig from "../config/Locale.js"

const Dictionary = Object.freeze({
  "success": {
    "en": "success",
    "id": "sukses",
    "es": "éxito",
    "hi": "सफलता",
    "ru": "успех",
    "pt": "sucesso",
    "zh": "成功",
    "ja": "成功"
  },
  "failed": {
    "en": "failed",
    "id": "gagal",
    "es": "fracaso",
    "hi": "विफल",
    "ru": "не удалось",
    "pt": "fracasso",
    "zh": "失败",
    "ja": "失敗"
  },
  "error": {
    "en": "error",
    "id": "kesalahan",
    "es": "error",
    "hi": "त्रुटि",
    "ru": "ошибка",
    "pt": "erro",
    "zh": "错误",
    "ja": "エラー"
  },
  "now": {
    "en": "now",
    "id": "sekarang",
    "es": "ahora",
    "hi": "अभी",
    "ru": "сейчас",
    "pt": "agora",
    "zh": "现在",
    "ja": "今"
  },
  "yesterday": {
    "en": "yesterday",
    "id": "kemarin",
    "es": "ayer",
    "hi": "कल",
    "ru": "вчера",
    "pt": "ontem",
    "zh": "昨天",
    "ja": "昨日"
  },
  "tomorrow": {
    "en": "tomorrow",
    "id": "besok",
    "es": "mañana",
    "hi": "कल",
    "ru": "завтра",
    "pt": "amanhã",
    "zh": "明天",
    "ja": "明日"
  },
  "wrongPassword": {
    "en": "wrong password",
    "id": "kata sandi salah",
    "es": "contraseña incorrecta",
    "hi": "गलत पासवर्ड",
    "ru": "неправильный пароль",
    "pt": "senha incorreta",
    "zh": "密码错误",
    "ja": "間違ったパスワード"
  },
  "accountSuspended": {
    "en": "account suspended",
    "id": "akun ditangguhkan",
    "es": "cuenta suspendida",
    "hi": "खाता निलंबित कर दिया गया है",
    "ru": "аккаунт заблокирован",
    "pt": "conta suspensa",
    "zh": "帐户暂停",
    "ja": "アカウントが一時停止"
  },
  "accountBlocked": {
    "en": "account suspended",
    "id": "akun diblokir",
    "es": "cuenta bloqueada",
    "hi": "खाता अवरुद्ध",
    "ru": "аккаунт заблокирован",
    "pt": "conta bloqueada",
    "zh": "账户被封锁",
    "ja": "アカウントがブロックされました"
  },
  "loginSuccess": {
    "en": "login success",
    "id": "berhasil masuk",
    "es": "Inicio de sesión exitoso",
    "hi": "लॉगिन की सफलता",
    "ru": "успешный вход в систему",
    "pt": "sucesso de login",
    "zh": "登录成功",
    "ja": "ログイン成功"
  },
  "registerSuccess": {
    "en": "register success",
    "id": "berhasil daftar",
    "es": "registro exitoso",
    "hi": "सफलता दर्ज करें",
    "ru": "зарегистрируйте успех",
    "pt": "registrar sucesso",
    "zh": "注册成功",
    "ja": "登録成功"
  },
})

/**
 * Translate language to locale base on Dictionary
 * @param {*} key 
 * @param {*} locale 
 * @returns 
 */
const Translate = (key, locale) => {
  return Dictionary[key] && Dictionary[key][locale ?? localeConfig.defaultLocale] || key
}

export default Translate
export { Dictionary }