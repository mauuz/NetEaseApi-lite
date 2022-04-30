//userController
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

    /**
     *
     *         "data": {
            "dates": [
                "2022-04-29",
                "2022-02-27"
            ],
            "purchaseUrl": "https://music.163.com/prime/m/purchase?luxury=1&situation=dailyHistory",
            "description": "您已尊享查看60天内近5次历史日推的特权",
            "noHistoryMessage": "黑胶VIP可查看近期5次历史记录，明天再来就会有哦"
        }
     * **/
    async availableHistoryDateForDailySongs(ctx,next){
        const data = {}
        try {
            let dateList = await createRequest(
                'POST',
                `https://music.163.com/api/discovery/recommend/songs/history/recent`,
                data,
                {
                    crypto: 'weapi',
                    cookie: {...readCookie(ctx),os:'ios'}

                },
            )
            if(dateList.body.code == 200){
                ctx.body = successRes(dateList.body.data)
            }else {
                ctx.body = errorRes('failed to get history')
            }

        }catch (e) {
            ctx.body = errorRes(e.body.message)
        }
    }

    /**
     *
     * @query date:2022-1-2
     *
     * **/
    async getHistoryDailySongs(ctx,next){
        const data = {
            date: ctx.query.date || '',
        }
        try {
            let songList = await createRequest(
                'POST',
                `https://music.163.com/api/discovery/recommend/songs/history/detail`,
                data,
                {
                    crypto: 'weapi',
                    cookie: {...readCookie(ctx),os:'ios'},
                },
            )
            ctx.body = successRes(songList.body.data)

        }catch (e) {
            ctx.body = errorRes(e.body.message)
        }


    }

    async addSongToMyplaylist(ctx,next){
        const tracks = ctx.query.tracks.split(',') || ''
        const data = {
            op: 'add',
            pid: ctx.query.pid, // 歌单id
            trackIds: JSON.stringify(tracks), // 歌曲id
            imme: 'true',
        }

        try {
            let res = await createRequest(
                'POST',
                `https://music.163.com/api/playlist/manipulate/tracks`,
                data,
                {
                    crypto: 'weapi',
                    cookie: {...readCookie(ctx), os: 'pc'}
                },
            )
            console.log(res)
            if(res.body.code == 200) {
                ctx.body = successRes(res.body)
            }else {
                ctx.body = errorRes(res.body.message)
            }


        }catch (e) {
            ctx.body = errorRes(e.body.message)
        }
    }

    async delSongFromMyplaylist(ctx,next){

        const tracks = ctx.query.tracks.split(',') || ''
        const data = {
            op: 'del',
            pid: ctx.query.pid, // 歌单id
            trackIds: JSON.stringify(tracks), // 歌曲id
            imme: 'true',
        }

        try {
            let res = await createRequest(
                'POST',
                `https://music.163.com/api/playlist/manipulate/tracks`,
                data,
                {
                    crypto: 'weapi',
                    cookie: {...readCookie(ctx), os: 'pc'}
                },
            )
            console.log(res)
            if(res.body.code == 200) {
                ctx.body = successRes(res.body)
            }else {
                ctx.body = errorRes(res.body.message)
            }


        }catch (e) {
            ctx.body = errorRes(e.body.message)
        }
    }

    //心动模式 返回不止一首歌，会有几百首
    async intelligenceMode(ctx,next){
        const data = {
            songId: ctx.query.id,
            type: 'fromPlayOne',
            playlistId: ctx.query.pid,
            startMusicId: ctx.query.sid || ctx.query.id,
            count: ctx.query.count || 1,
        }
        try {
            let recommendSongList =await createRequest(
                'POST',
                `https://music.163.com/weapi/playmode/intelligence/list`,
                data,
                {
                    crypto: 'weapi',
                    cookie: readCookie(ctx),
                }
            )

            ctx.body = successRes(recommendSongList.body.data)
            console.log(ctx.body.msg.length)
        }catch (e) {
            ctx.body = errorRes(e.body)
        }

    }

    async likeSong(ctx,next){
        ctx.query.like = ctx.query.like == 'false' ? false : true
        const data = {
            alg: 'itembased',
            trackId: ctx.query.id,
            like: ctx.query.like,
            time: '3',
        }
        try {
            let res=await createRequest('POST', `https://music.163.com/api/radio/like`, data, {
                crypto: 'weapi',
                cookie: {...readCookie(ctx),os:'pc',appver: '2.9.7'},
            })
            ctx.body = res.body
        }catch (e) {
            ctx.body = errorRes(e.body.message)
        }

    }
}


module.exports = new userController()