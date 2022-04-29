const {createRequest} = require('../../utils/netEaseCloudMusic/request')
const {readCookie} = require('../../utils/cookieReader')
const {errorRes} = require('../../src/constant/error')
const {successRes} = require('../../src/constant/success')

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
                || {__csrf:ctx.request.body.cookies['__csrf'],MUSIC_U:ctx.request.body.cookies['MUSIC_U']}
                || {__csrf:ctx.query.cookies['__csrf'],MUSIC_U:ctx.query.body.cookies['MUSIC_U']}
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
                    || {__csrf:ctx.request.body.cookies['__csrf'],MUSIC_U:ctx.request.body.cookies['MUSIC_U']}
                    || {__csrf:ctx.query.cookies['__csrf'],MUSIC_U:ctx.query.cookies['MUSIC_U']}
            },)
        ctx.body = dailySongs.body.data
        console.log(dailySongs.body.data.dailySongs.length)
    }

    /**
     *
     "info": "60G音乐云盘免费容量$黑名单上限100",
     "progress": 0.1274,
     "nextPlayCount": 5000,
     "nextLoginCount": 150,
     "nowPlayCount": 637,
     "nowLoginCount": 150,
     "level": 8
     * **/
    async getLevelDetail (ctx,next){
        const data = {}
        try {
            let levedetail= await createRequest(
                'POST', `https://music.163.com/weapi/user/level`, data, {
                    crypto: 'weapi',
                    cookie: {__csrf:ctx.cookies.get('__csrf'),MUSIC_U:ctx.cookies.get('MUSIC_U')}
                            || {__csrf:ctx.request.body.cookies['__csrf'],MUSIC_U:ctx.request.body.cookies['MUSIC_U']}
                            || {__csrf:ctx.query.cookies['__csrf'],MUSIC_U:ctx.query.cookies['MUSIC_U']}
                }
            )
            ctx.body = {
                status:'success',
                msg:levedetail.body.data
            }
        }catch (e) {
            ctx.body = {
                status:'failed',
                msg:e.body.message
            }
        }
    }

    //签到
    async signIn(ctx,next){
        const data = {
            type: 1,
        }
        try {
            let result = await createRequest('POST', `https://music.163.com/weapi/point/dailyTask`, data, {
                crypto: 'weapi',
                cookie: readCookie(ctx)
            })
            ctx.body = {
                status:'success',
                msg:'success'
            }
        }catch (e) {
            ctx.body = {
                status:'failed',
                msg:e.body.msg
            }
        }

    }

    async getMyFM(ctx,next) {
        try {
            let FMlist = await createRequest(
                'POST',
                `https://music.163.com/weapi/v1/radio/get`,
                {},
                {
                    crypto: 'weapi',
                    cookie: readCookie(ctx)
                })
            console.log(FMlist)
            ctx.body = successRes(FMlist.body.data)
        }catch (e) {
            ctx.body = errorRes(e.body)
        }
    }

    async trashFm(ctx,next){
        const data = {
            songId: ctx.request.body.id,
        }
        try {
            let res = await createRequest(
                'POST',
                `https://music.163.com/weapi/radio/trash/add?alg=RT&songId=${
                    ctx.request.body.id
                }&time=${ctx.request.body.time || 25}`,
                data,
                {
                    crypto: 'weapi',
                    cookie: readCookie(ctx)
                }
            )
            if(res.body.code == 200 ){
                ctx.body = successRes('success')
            }
        }catch (e) {
            ctx.body = errorRes(e.body.message)
        }

    }
}


module.exports = new userController()