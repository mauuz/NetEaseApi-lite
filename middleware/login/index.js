const {createRequest} = require('../../utils/netEaseCloudMusic/request')
const QRCode = require('qrcode')
const fs = require('fs')
const createQrkey =async (ctx,next)=>{
    const data = {
        type: 1,
    }
    try {
        let res= await createRequest('POST', `https://music.163.com/weapi/login/qrcode/unikey`, data,
            {
                crypto: 'weapi',
            })
        if(res.status == 200){
            ctx.body = res.body
            await next()
        }
        else {
            ctx.body = {
                status: 'failed',
                msg:'Failed to create Qrcode'
            }
        }
    }catch (e) {
        ctx.body = {
            status: 'failed',
            msg:'Failed to create Qrcode'
        }
    }
}

const createQrCode = async (ctx,next)=>{
    const url = `https://music.163.com/login?codekey=${ctx.body.unikey}`
    try {
        let result =await QRCode.toDataURL(url)
        ctx.body={
            status: 'success',
            unikey: ctx.body.unikey,
            qrCode:result
        }
    }catch (e) {
        ctx.body = {
            status:'Failed',
            msg:'Failed to create Qrcode'
        }
    }
}

const cookieParser = async (ctx,next)=>{
    let cookie = ctx.state.cookie
    console.log(cookie)
    const processedCookie = {

    }
    cookie.forEach((a)=>{
        reg = /^MUSIC_U=(.*?);/i
        reg1 =/^__csrf=(.*?);/i
        let MUSIC_U = a.match(reg)
        let __csrf = a.match(reg1)
        MUSIC_U && Object.assign(processedCookie,{MUSIC_U:MUSIC_U[1]})
        __csrf && Object.assign(processedCookie,{__csrf:__csrf[1]})
    })
    ctx.state = {
        status:'success',
        msg:ctx.state.msg,
        cookie:processedCookie
    }
    console.log(ctx.state)
    next()

}

const checkQrcodeLoginStatus = async (ctx,next)=>{
    const uniKey=ctx.query.unikey
    if(uniKey){
        const data = {
            key:ctx.query.unikey,
            type: 1,
        }
        let cookie = await createRequest(
            'POST',
            `https://music.163.com/weapi/login/qrcode/client/login`,
            data,
            {
                crypto: 'weapi',
            })

        if(cookie.body.code === 803 ){
            ctx.state = {
                status:'success',
                msg:cookie.body.message,
                cookie:cookie.cookie
            }
            next()
        }else {
            ctx.body = {
                status:'failed',
                msg:cookie.body.message
            }
        }

    }else {
        ctx.body={
            status:'failed',
            msg:'missing unikey'
        }
    }


}

const checkPhoneCaptcha = async (ctx,next)=> {
    if(ctx.request.body.type == 0){
        const data = {
            ctcode: ctx.request.body.ctcode || '86',
            cellphone: ctx.request.body.phone,
            captcha: ctx.request.body.captcha,
        }
        try {
            let status = await createRequest(
                'POST',
                `https://music.163.com/weapi/sms/captcha/verify`,
                data,
                {
                    crypto: 'weapi',
                }
            )
            console.log(status)
            await next()

        } catch (e) {
            ctx.body = {
                status: 'failed',
                msg: e.body.message
            }
        }
    }else if(ctx.request.body.type == 1){
        await next()
    }else {
        ctx.body = {
            status: 'failed',
            msg: 'missing type'
        }
    }

}

const mobileLogin = async (ctx,next)=>{
    const crypto = require('crypto')
    const cookie = {
        os:'pc',
        appver:'2.9.7'
    }
    const data = {
        phone:ctx.request.body.phone,
        countrycode: ctx.request.body.countrycode || '86',
        captcha: ctx.request.body.captcha,
        [ctx.request.body.captcha ? 'captcha' : 'password']: ctx.request.body.captcha
            ? ctx.request.body.captcha
            : ctx.request.body.md5_password ||
            crypto.createHash('md5').update(ctx.request.body.password).digest('hex'),
        rememberLogin: 'true',
    }
    try {
        let result = await createRequest(
            'POST',
            `https://music.163.com/api/login/cellphone`,
            data,
            {
                crypto: 'weapi',
                ua: 'pc',
                cookie:cookie
            }
        )
        if(result.body.code == 200) {
            ctx.state = {
                status:'success',
                msg:result.body.profile,
                cookie:result.cookie
            }
            await next()
        }else {
            ctx.body = {
                status:'failed',
                msg:result.body.message || 'inlegal input'
            }
        }

    }catch (e) {
        ctx.body = {
            status:'failed',
            msg:'failed to login',
        }
    }

}


const autoRefreshLoginCookie = async(ctx,next)=> {
    let result = await createRequest(
        'POST',
        `https://music.163.com/weapi/login/token/refresh`,
        {},
        {
            crypto: 'weapi',
            ua: 'pc',
            cookie: {__csrf:ctx.cookies.get('__csrf'),MUSIC_U:ctx.cookies.get('MUSIC_U'),__remember_me:true}
        },
    )
    console.log(result)

}


module.exports = {createQrkey,createQrCode,checkQrcodeLoginStatus,cookieParser,checkPhoneCaptcha,mobileLogin,autoRefreshLoginCookie}