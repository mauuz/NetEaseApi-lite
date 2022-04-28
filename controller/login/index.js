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
}
module.exports = new LoginController()