const {createRequest} = require('../../utils/netEaseCloudMusic/request')
const getPlayList = async (ctx,next)=>{
    const data = {
        id: ctx.query.id,
        n: 100000,
        s: 8,
    }
    let songIdList = await createRequest('POST', `https://music.163.com/api/v6/playlist/detail`, data, {
        crypto: 'api',
        cookie: {__csrf:ctx.cookies.get('__csrf'),MUSIC_U:ctx.cookies.get('MUSIC_U')}
    })
    if(songIdList.body.playlist.trackIds){
        ctx.state.playList = songIdList.body.playlist.trackIds
        await next()
    }else {
        ctx.body= {
            status:'failed',
            msg:'failed to get playlist,you may login first'
        }
    }

}

const getAllSongsFromId = async (ctx,next)=>{
    let ids =''
    for(let i=0;i<ctx.state.playList.length;i++){
        if(i<ctx.state.playList.length-1){
            ids +=ctx.state.playList[i].id+','
        }else {
            ids +=ctx.state.playList[i].id
        }

    }
    ctx.state.playList=ids
    await  next()
}

const checkId= async (ctx,next)=>{
    reg = /^[0-9]*$/
    if(ctx.query.id){
        if(reg.test(ctx.query.id)){
            console.log('pass')
            await next()
        }else {
            ctx.body = {
                status:'failed',
                msg:'inlegal params'
            }
        }
    }else {
        ctx.body = {
            status:'failed',
            msg:'inlegal params'
        }
    }

}

const getSongDetails = async (ctx,next)=>{
    let ids = ctx.state.playList.split(/\s*,\s*/)
    const data = {
        c: '[' + ids.map((id) => '{"id":' + id + '}').join(',') + ']',
    }
    console.log(data)
    let songDetails = await createRequest('POST','https://music.163.com/api/v3/song/detail',data,
        {
            crypto: 'weapi',
            cookie: {__csrf:ctx.cookies.get('__csrf'),MUSIC_U:ctx.cookies.get('MUSIC_U')}
        })
    ctx.state.playList = songDetails
    await next()
}



module.exports = {getPlayList,checkId,getAllSongsFromId,getSongDetails}