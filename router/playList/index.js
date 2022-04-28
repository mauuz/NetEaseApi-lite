const Router = require('koa-router')
const playListRouter = new Router({prefix:'/playlist'})
//middleware
const {checkId,getAllSongsFromId,getPlayList,getSongDetails} = require('../../middleware/playList')
//controller
const {getPlaylistDetail} = require('../../controller/playList')

playListRouter.get('/',checkId,getPlayList,getAllSongsFromId,getSongDetails,getPlaylistDetail)

module.exports = {playListRouter}


