//userMiddleware
const {createRequest} = require ('../../utils/netEaseCloudMusic/request')

const checkIfLogin = async (ctx,next)=>{
    const data = {}
    //检查登陆状态
    let status = await createRequest( 'POST',
        `https://music.163.com/weapi/w/nuser/account/get`,
        data,
        {
            crypto: 'weapi',
            cookie: {__csrf:ctx.cookies.get('__csrf'),MUSIC_U:ctx.cookies.get('MUSIC_U')}
        })
    try {
        if(status.body.account){
            ctx.state.userInfo = {
                userId:status.body.profile.userId,
                nickName:status.body.profile.nickname,
                gender:status.body.profile.gender,
                avatar:status.body.profile.avatarUrl,
                bgImg:status.body.profile.backgroundUrl,
                signature:status.body.profile.signature,
                isVip:status.body.profile.vipType,
                lastLoginTime:status.body.profile.lastLoginTime
            }
            await next()
        }else {
            ctx.body = {
                status:'failed',
                msg:'please login first'
            }
        }
    }catch (e) {
        throw new Error(e)
    }
}

const checkPage = async (ctx,next)=>{
    reg = /^[0-9]*$/
    if(ctx.query.page){
        if(reg.test(ctx.query.page)){
            await next()
        }else {
            ctx.body = {
                status:'failed',
                msg:'inlegal params'
            }
        }
    }else {
        ctx.body = {
            status:'failed',
            msg:'inlegal params'
        }
    }

}


module.exports = {
    checkIfLogin,checkPage
}
