const Router = require('koa-router')
const loginRouter = new Router({prefix:'/login'})
//middleware
const {createQrkey,createQrCode,checkQrcodeLoginStatus,cookieParser} = require('../../middleware/login')
//controller
const {qrLogin} = require('../../controller/login')

loginRouter.get('/',createQrkey,createQrCode)
loginRouter.get('/checkQrLogin',checkQrcodeLoginStatus,cookieParser,qrLogin)
module.exports = {loginRouter}
