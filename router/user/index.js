const Router = require('koa-router')
const userRouter = new Router({prefix:'/user'})
//middleware
const { checkIfLogin,checkPage } = require('../../middleware/user')
//controller
const {getUserProfile,getMyList} = require('../../controller/user')

userRouter.get('/myplaylist',checkPage,checkIfLogin,getMyList)
userRouter.get('/',checkIfLogin,getUserProfile)

module.exports = {userRouter}