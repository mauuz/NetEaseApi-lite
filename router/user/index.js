const Router = require('koa-router')
const userRouter = new Router({prefix:'/user'})
//middleware
const { checkIfLogin,checkPage } = require('../../middleware/user')
//controller
const {getUserProfile,getMyList, getMyDailyRecommend,getLevelDetail,signIn,getMyFM,trashFm} = require('../../controller/user')

userRouter.get('/myplaylist',checkPage,checkIfLogin,getMyList)
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
module.exports = {userRouter}