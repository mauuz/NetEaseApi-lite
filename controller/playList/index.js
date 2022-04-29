const {createRequest} = require('../../utils/netEaseCloudMusic/request')
const {readCookie} = require('../../utils/cookieReader')
const {errorRes} = require('../../src/constant/error')
const {successRes} = require('../../src/constant/success')

class PlaylistController {
    async getPlaylistDetail(ctx,next) {
        ctx.body = ctx.state.playList
    }
    async createPlaylist(ctx,next) {
        const data = {
            name: ctx.query.name,
            privacy: ctx.query.privacy || 10, //0 为普通歌单，10 为隐私歌单
            type: ctx.query.type || 'NORMAL', // NORMAL|VIDEO|SHARED
        }
        try {
            let result = await createRequest('POST', `https://music.163.com/api/playlist/create`, data, {
                crypto: 'weapi',
                cookie: {...readCookie(ctx),os:'pc'},

            })
            ctx.body = successRes(result.body)
        }catch (e) {
            ctx.body = e.body.message
        }
    }
    async deletePlaylist(ctx,next){
        const data = {
            ids: '[' + ctx.query.id + ']',
        }
        try {
            let res = await createRequest('POST', `https://music.163.com/weapi/playlist/remove`, data, {
                crypto: 'weapi',
                cookie: {...readCookie(ctx),os:'pc'},
            })
            if(res.body.code == 200){
                ctx.body = successRes('success')
            }else {
                ctx.body = errorRes('failed')
            }

        }catch (e) {
            ctx.body = errorRes(e.body.message)
        }

    }
}
module.exports = new PlaylistController()