const readCookie = (ctx)=>{
    return {__csrf:ctx.cookies.get('__csrf'),MUSIC_U:ctx.cookies.get('MUSIC_U')}
        || {__csrf:ctx.request.body.cookies['__csrf'],MUSIC_U:ctx.request.body.cookies['MUSIC_U']}
        || {__csrf:ctx.query.cookies['__csrf'],MUSIC_U:ctx.query.cookies['MUSIC_U']}
}

module.exports = {readCookie}