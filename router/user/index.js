//userRouter
const Router = require('koa-router')
const userRouter = new Router({prefix:'/user'})
//middleware
const { checkIfLogin,checkPage } = require('../../middleware/user')
//controller
const {
    getUserProfile,getMyList, getMyDailyRecommend,getLevelDetail,signIn,
    getMyFM,trashFm,availableHistoryDateForDailySongs,getHistoryDailySongs,
    addSongToMyplaylist,delSongFromMyplaylist,intelligenceMode,likeSong,
    recentSong,recentPlayList,recentAlbum,subscribePlaylist
} = require('../../controller/user')


userRouter.get('/',checkIfLogin,getUserProfile)
userRouter.get('/dailyrecommend',checkIfLogin,getMyDailyRecommend)

/**
 *
 * 获取用户等级
 * **/
userRouter.get('/level',checkIfLogin,getLevelDetail)

/**
 *
 * web 签到
 * **/
userRouter.get('/signin',checkIfLogin,signIn)
/**
 * 私人FM
 * **/
userRouter.get('/myFM',checkIfLogin,getMyFM)
/**
 *
 * @params songId: ctx.request.body.id,
 * **/
userRouter.post('/myFM/trash',checkIfLogin,trashFm)

//我的歌单
userRouter.get('/myplaylist',checkPage,checkIfLogin,getMyList)
/**
 *
 * 获取有效历史日推的日期
 * **/
userRouter.get('/myplaylist/historydate',checkIfLogin,availableHistoryDateForDailySongs)

/**
 *
 * 获取历史指定日期日推歌曲
 * **/
userRouter.get('/myplaylist/historysong',checkIfLogin,getHistoryDailySongs)

/**
 *
 * 添加歌曲到指定歌单
 * @query pid 歌单id
 * @query tracks 歌曲id ，多个用逗号隔开
 * **/
userRouter.get('/myplaylist/add',checkIfLogin,addSongToMyplaylist)

/**
 *
 * 添加歌曲到指定歌单
 * @query pid 歌单id
 * @query tracks 歌曲id ，多个用逗号隔开
 * **/
userRouter.get('/myplaylist/del',checkIfLogin,delSongFromMyplaylist)

/**
 *
 *     songId: query.id,
 playlistId: query.pid,
 startMusicId: query.sid || query.id,
 count: query.count || 1,
 * **/
userRouter.get('/myplaylist/intelligenceMode',checkIfLogin,intelligenceMode)

/**
 * @params t 1：subscribe 0 ：unsubcribe
 * @params id 歌单 id
 * **/
userRouter.post('/myplaylist/subscribe',checkIfLogin,subscribePlaylist)



/**
 *@query id 歌曲id
 *@query like true/false
 * **/
userRouter.get('/myplaylist/like',checkIfLogin,likeSong)

//获取最近播放记录
userRouter.get('/recent/song',checkIfLogin,recentSong)
userRouter.get('/recent/playlist',checkIfLogin,recentPlayList)
userRouter.get('/recent/album',checkIfLogin,recentAlbum)


module.exports = {userRouter}