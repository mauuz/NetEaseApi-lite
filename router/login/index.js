const Router = require('koa-router')
const loginRouter = new Router({prefix:'/login'})
//middleware
const {checkIfLogin} = require('../../middleware/user')
const {createQrkey,createQrCode,checkQrcodeLoginStatus,cookieParser,checkPhoneCaptcha,mobileLogin,autoRefreshLoginCookie} = require('../../middleware/login')
//controller
const {qrLogin,sendMobilPhone,moblieLogin} = require('../../controller/login')
/**
 * @return uniKey
 * @return base64 img
 * **/
loginRouter.get('/',createQrkey,createQrCode)
/**
 *
 * @ {unikey} unikey
 * **/
loginRouter.get('/checkQrLogin',checkQrcodeLoginStatus,cookieParser,qrLogin)
/**
 * ctcode: ctx.request.body.ctcode || '86',
 * cellphone: ctx.request.body.phone,
 *
 * **/
loginRouter.post('/sentcaptcha',sendMobilPhone)

loginRouter.post('/mobilephoneLogin',checkPhoneCaptcha, mobileLogin,cookieParser,moblieLogin)

/**
 *
 * 自动更新cookie
 * **/
loginRouter.get('/refreshcookie',checkIfLogin,autoRefreshLoginCookie,cookieParser)

module.exports = {loginRouter}
