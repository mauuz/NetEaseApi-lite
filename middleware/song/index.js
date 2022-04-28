const {createRequest} = require('../../utils/netEaseCloudMusic/request')
const getSongDetails = async (ctx,next)=>{
    ids = ids.split(/\s*,\s*/)
    const data = {
        c: '[' + ids.map((id) => '{"id":' + id + '}').join(',') + ']',
    }

    let songDetails = await createRequest('POST','https://music.163.com/api/v3/song/detail',data,
        {
            crypto: 'weapi',
        })

    console.log('歌单详情',songDetails)
}
module.exports = {getSongDetails}