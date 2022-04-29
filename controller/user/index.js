const {createRequest} = require('../../utils/netEaseCloudMusic/request')
class userController {
    async getUserProfile(ctx, next) {
        ctx.body= {
            status:'success',
            msg:ctx.state.userInfo
        }
    }
    /**
     *
     *一页10个歌单
     * **/
    async getMyList(ctx, next) {
        let page = ctx.query.page
        const data = {
            uid: ctx.state.userInfo.userId,
            limit: 10,
            offset: (page-1),
            includeVideo: true,
        }
        let myPlayList = await createRequest('POST', `https://music.163.com/api/user/playlist`, data, {
            crypto: 'weapi',
            cookie: {__csrf:ctx.cookies.get('__csrf'),MUSIC_U:ctx.cookies.get('MUSIC_U')}
        })
        console.log(myPlayList)
        ctx.body = {
            status:'success',
            msg: myPlayList.body

        }
    }

    async getMyDailyRecommend(ctx,next){
        const data = {}
        let dailySongs = await createRequest('POST',
            `https://music.163.com/api/v3/discovery/recommend/songs`,
            data,
            {
                crypto: 'weapi',
                cookie: {__csrf:ctx.cookies.get('__csrf'),MUSIC_U:ctx.cookies.get('MUSIC_U')}
            },)
        ctx.body = dailySongs.body.data
        console.log(dailySongs.body.data.dailySongs.length)
    }
}


module.exports = new userController()