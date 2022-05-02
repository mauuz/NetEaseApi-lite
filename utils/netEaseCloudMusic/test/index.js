const axios = require('axios')
const {weapi,eapi} = require('../../netEaseCloudMusic/index')
const { URLSearchParams} = require('url')
const { createRequest } = require('../request')

const cookie=  [
    'MUSIC_A_T=1504978463706; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/neapi/feedback; HTTPOnly',
    'MUSIC_A_T=1504978463706; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/openapi/clientlog; HTTPOnly',
    'MUSIC_A_T=1504978463706; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/eapi/feedback; HTTPOnly',
    'MUSIC_A_T=1504978463706; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/wapi/clientlog; HTTPOnly',
    'MUSIC_U=45c1d33df7361d3b6daadd7886a920f182561d091f4d25d503ae6f8689e48a37993166e004087dd332437b52543afe27b79a2e12922c428997887d856db2004d6c13d6e634a991e3a0d2166338885bd7; Max-Age=15552000; Expires=Tue, 25 Oct 2022 04:53:29 GMT; Path=/; HTTPOnly',
    'MUSIC_R_T=1504978478427; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/api/feedback; HTTPOnly',
    'MUSIC_SNS=; Max-Age=0; Expires=Thu, 28 Apr 2022 04:53:29 GMT; Path=/',
    'NMTID=00OF-ikJny7rLpngEqml4RPnKuyBAQAAAGAboRc4g; Max-Age=315360000; Expires=Sun, 25 Apr 2032 04:53:29 GMT; Path=/;',
    'MUSIC_R_T=1504978478427; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/wapi/feedback; HTTPOnly',
    'MUSIC_R_T=1504978478427; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/eapi/clientlog; HTTPOnly',
    'MUSIC_A_T=1504978463706; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/neapi/clientlog; HTTPOnly',
    'MUSIC_R_T=1504978478427; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/neapi/clientlog; HTTPOnly',
    'MUSIC_A_T=1504978463706; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/wapi/feedback; HTTPOnly',
    'MUSIC_A_T=1504978463706; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/weapi/clientlog; HTTPOnly',
    'MUSIC_R_T=1504978478427; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/weapi/feedback; HTTPOnly',
    'MUSIC_A_T=1504978463706; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/api/feedback; HTTPOnly',
    'MUSIC_R_T=1504978478427; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/eapi/feedback; HTTPOnly',
    'MUSIC_R_T=1504978478427; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/neapi/feedback; HTTPOnly',
    'MUSIC_R_T=1504978478427; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/api/clientlog; HTTPOnly',
    'MUSIC_A_T=1504978463706; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/api/clientlog; HTTPOnly',
    'MUSIC_R_T=1504978478427; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/wapi/clientlog; HTTPOnly',
    'MUSIC_R_T=1504978478427; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/openapi/clientlog; HTTPOnly',
    'MUSIC_R_T=1504978478427; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/weapi/clientlog; HTTPOnly',
    'MUSIC_A_T=1504978463706; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/weapi/feedback; HTTPOnly',
    '__csrf=041bb900974aa672f6c17aeea7825eeb; Max-Age=1296010; Expires=Fri, 13 May 2022 04:53:39 GMT; Path=/;',
    'MUSIC_A_T=1504978463706; Max-Age=2147483647; Expires=Tue, 16 May 2090 08:07:36 GMT; Path=/eapi/clientlog; HTTPOnly'
]

const cookie1 = {
    '__csrf':'041bb900974aa672f6c17aeea7825eeb',
    'MUSIC_A_T':'1504978463706'
}

const headers = {
    'Accept': '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Referer': 'http://music.163.com',
    'Host': 'music.163.com',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/602.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/602.1'
}

const searchKeyPreview = async (keyWords)=> {
    const data = {
        s: keyWords || '',
        csrf_token: ''
    }
    axios({
        withCredentials: true,
        headers: headers,
        method: 'post',
        url: 'https://music.163.com/weapi/search/suggest/web',
        data:new URLSearchParams(weapi(data)).toString()

    }).then((res) => {
        console.log(res.data.result)
    })
}
const search = async (keyWords,type,limit)=>{
    const data = {
        s: keyWords,
        type: type || 1, // 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
        limit: limit || 30,
        offset: 0,
    }
    axios({
        withCredentials: true,
        headers: headers,
        method: 'post',
        url: 'https://music.163.com/weapi/search/get',
        data:new URLSearchParams(weapi(data)).toString()

    }).then((res) => {
        console.log(res.data.result)

    })
}
const mostPopular = async (type)=>{
    const data = {
        areaId: type || 0, // 全部:0 华语:7 欧美:96 日本:8 韩国:16
        // limit: query.limit || 100,
        // offset: query.offset || 0,
        total: true,
    }

    createRequest('POST','https://music.163.com/weapi/v1/discovery/new/songs',data,
        {
            crypto: 'weapi',
        }).then(res=>console.log(res.body))


}


const getMusicUrl = async (id,br)=>{
    const data = {
        ids: '[' + id + ']',
        br: parseInt(br || 999000),
    }
    const url = '/api/song/enhance/player/url'

    axios({
        withCredentials: true,
        headers: headers,
        method: 'post',
        url: 'https://interface3.music.163.com/eapi/song/enhance/player/url',
        data:new URLSearchParams(eapi(url,data)).toString()

    }).then((res) => {
        console.log(res.data)

    })
}

const getLyric = async (id)=>{
    const data = {
        id: id,
        lv: -1,
        kv: -1,
        tv: -1,
    }
    axios({
        withCredentials: true,
        headers: headers,
        method: 'post',
        url: 'https://music.163.com/api/song/lyric',
        data:new URLSearchParams(data).toString()

    }).then((res) => {
        console.log(res.data)

    })
}


const getSongDetails = async (ids)=>{
    ids = ids.split(/\s*,\s*/)
    const data = {
        c: '[' + ids.map((id) => '{"id":' + id + '}').join(',') + ']',
    }

    createRequest('POST','https://music.163.com/api/v3/song/detail',data,
        {
            crypto: 'weapi',
        }).then(res=>console.log(res.body))


}

const createQrkey =async ()=>{
    const data = {
        type: 1,
    }
    let res= await createRequest('POST', `https://music.163.com/weapi/login/qrcode/unikey`, data,
            {
                crypto: 'weapi',

            })
    console.log(res)
}

const QRCode = require('qrcode')
const fs = require('fs')
const createQrCode = async (unikey)=>{
    const url = `https://music.163.com/login?codekey=${unikey}`
    let result =await QRCode.toDataURL(url)
    let base64Data = result.replace(/^data:image\/\w+;base64,/, "")
    let dataBuffer = Buffer.from(base64Data, 'base64');
    fs.writeFile("image.jpg", dataBuffer, (err)=> {

    })

}
const checkQrcodeLogin = async (unikey)=>{
    const data = {
        key:unikey,
        type: 1,
    }
    let cookie = await createRequest(
        'POST',
        `https://music.163.com/weapi/login/qrcode/client/login`,
        data,
        {
            crypto: 'weapi',
        })
    console.log(cookie.cookie)
}

const getUserDetail = async (userId,cookie)=>{
    createRequest('POST',
        `https://music.163.com/weapi/v1/user/detail/${userId}`,
        {},
        {
            crypto: 'weapi',
            cookie: cookie,

        },)
}
const getAccount = async (cookie)=>{
    const data = {}

    let userId = await createRequest ('POST', `https://music.163.com/api/nuser/account/get`, data, {
        crypto: 'weapi',
        cookie: cookie
    })
    console.log(userId)
}

const loginStatus = async (cookie)=>{
    const data = {}
    let status = await createRequest( 'POST',
        `https://music.163.com/weapi/w/nuser/account/get`,
        data,
        {
            crypto: 'weapi',
            cookie: cookie,

        })
    console.log(status)
}
// createQrkey()
// createQrCode('d3be3a33-3e7a-4891-95d1-ece52f841f88')
// checkQrcodeLogin('d3be3a33-3e7a-4891-95d1-ece52f841f88')

// getAccount(cookie)
// getUserDetail('')

// loginStatus(cookie)
getMusicUrl('1343946237',123123)
//getAccount(cookie2)
//
// function cookieParser(cookie){
//     const processedCookie = {
//
//     }
//     cookie.forEach((a)=>{
//         reg = /^MUSIC_U=(.*?);/i
//         reg1 =/^__csrf=(.*?);/i
//         let MUSIC_U = a.match(reg)
//         let __csrf = a.match(reg1)
//         MUSIC_U && Object.assign(processedCookie,{MUSIC_U:MUSIC_U[1]})
//         __csrf && Object.assign(processedCookie,{__csrf:__csrf[1]})
//     })
//     return processedCookie
// }
