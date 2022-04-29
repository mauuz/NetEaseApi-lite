const Router = require('koa-router')
const playListRouter = new Router({prefix:'/playlist'})
//middleware
const {checkId,getAllSongsFromId,getPlayList,getSongDetails} = require('../../middleware/playList')
const {checkIfLogin} = require('../../middleware/user')
//controller
const {getPlaylistDetail,createPlaylist,deletePlaylist} = require('../../controller/playList')

playListRouter.get('/',checkId,getPlayList,getAllSongsFromId,getSongDetails,getPlaylistDetail)

/**
 *
 name: ctx.request.body.name,
 privacy: ctx.request.body.privacy, //0 为普通歌单，10 为隐私歌单
 type: ctx.request.body.type || 'NORMAL', // NORMAL|VIDEO|SHARED
 * **/

playListRouter.get('/create',checkIfLogin,createPlaylist)

playListRouter.get('/delete',checkIfLogin,deletePlaylist)

module.exports = {playListRouter}


