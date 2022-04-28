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
module.exports = {createQrkey,createQrCode,checkQrcodeLoginStatus,cookieParser}