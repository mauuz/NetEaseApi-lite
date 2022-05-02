const {createRequest} = require('../../utils/netEaseCloudMusic/request')
const {readCookie} = require('../../utils/cookieReader')
const {errorRes} = require('../../src/constant/error')
const {successRes} = require('../../src/constant/success')
class SongController {
    async getSongUrl(ctx,next){
        const data = {
            ids: '[' + ctx.query.id + ']',
            br: parseInt(ctx.query.br || 999000),
        }
        try {
            let url = await createRequest('POST',
                `https://interface3.music.163.com/eapi/song/enhance/player/url`,
                data,
                {
                    crypto: 'eapi',
                    cookie: (!'MUSIC_U' in readCookie(ctx))?{...readCookie(ctx),_ntes_nuid:crypto.randomBytes(16).toString('hex'),os:'pc'}:{...readCookie(ctx),os:'pc'},
                    url: '/api/song/enhance/player/url'
                })
            ctx.body = successRes(url.body)
        }catch (e) {
            ctx.body = successRes(e.body)
        }

    }

    async downloadSong(ctx,next){
        const data = {
            id: ctx.query.id,
            br: parseInt(ctx.query.br || 999000),
        }
        try{
            let url = await createRequest(
                'POST',
                `https://interface.music.163.com/eapi/song/enhance/download/url`,
                data,
                {
                    crypto: 'eapi',
                    cookie: readCookie(ctx),
                    url: '/api/song/enhance/download/url',
                }
            )
            ctx.body = url.body
        }catch (e) {
            ctx.body = e.body
        }

    }
}
module.exports = new SongController()