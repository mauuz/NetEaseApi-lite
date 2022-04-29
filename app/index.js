const Koa = require('koa')

const KoaBody = require('koa-body')

const {loginRouter} = require('../router/login')
const {userRouter} = require('../router/user')
const {playListRouter} = require('../router/playList')

const app = new Koa()
//support form-data
app.use(KoaBody({multipart: true}))
app.use(loginRouter.routes())
app.use(userRouter.routes())
app.use(playListRouter.routes())

app.on('error', (ctx)=>{
    ctx.body='error'
})

module.exports ={app}
