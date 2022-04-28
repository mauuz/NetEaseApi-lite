const Koa = require('koa')

const KoaBody = require('koa-body')

const {loginRouter} = require('../router/login')
const {userRouter} = require('../router/user')
const {playListRouter} = require('../router/playList')

const app = new Koa()
app.use(KoaBody())
app.use(loginRouter.routes())
app.use(userRouter.routes())
app.use(playListRouter.routes())

app.on('error', (ctx)=>{
    ctx.body='error'
})

module.exports ={app}
