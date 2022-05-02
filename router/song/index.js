const Router = require('koa-router')
const songRouter = new Router({prefix:'/song'})
//middleware
const {  } = require('../../middleware/song')
//controller
const {getSongUrl,downloadSong} = require('../../controller/song')

songRouter.get('/url',getSongUrl)
songRouter.get('/download',downloadSong)
module.exports = {songRouter}