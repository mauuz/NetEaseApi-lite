const {createRequest} = require('../../utils/netEaseCloudMusic/request')
class LoginController {
    async qrLogin(ctx,next) {
        ctx.body = {
            status:'success',
            msg:ctx.state.msg,
            cookie:ctx.state.cookie
        }
        ctx.cookies.set('__csrf',ctx.state.cookie['__csrf'])
        ctx.cookies.set('MUSIC_U',ctx.state.cookie['MUSIC_U'])
    }

    async sendMobilPhone(ctx,next) {
        const data = {
            ctcode: ctx.request.body.ctcode || '86',
            cellphone: ctx.request.body.phone,
        }
        try {
            let feedback = await createRequest('POST', `https://music.163.com/api/sms/captcha/sent`, data, {
                crypto: 'weapi'

            })
            if(feedback.body.code === 200){
                ctx.body = {
                    status:'success',
                    msg:'success'
                }
            }else {
                ctx.body = {
                    status:'failed',
                    msg:feedback.body.message
                }
            }

        }catch (e) {
            ctx.body = {
                'status':'failed',
                'msg':e.body.message
            }
        }
    }

    async moblieLogin(ctx, next) {
        ctx.body = {
            status:'success',
            msg:{
                userInfo:{
                    userId:ctx.state.msg.userId,
                    nickName:ctx.state.msg.nickname,
                    gender:ctx.state.msg.gender,
                    avatar:ctx.state.msg.avatarUrl,
                    bgImg:ctx.state.msg.backgroundUrl,
                    signature:ctx.state.msg.signature,
                    isVip:ctx.state.msg.vipType,
                    lastLoginTime:ctx.state.msg.lastLoginTime
                }
            },
            cookie:ctx.state.cookie
        }
        ctx.cookies.set('__csrf',ctx.state.cookie['__csrf'])
        ctx.cookies.set('MUSIC_U',ctx.state.cookie['MUSIC_U'])
    }



}
module.exports = new LoginController()