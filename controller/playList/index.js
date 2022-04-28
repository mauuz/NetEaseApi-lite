class PlaylistController {
    async getPlaylistDetail(ctx,next) {
        ctx.body = ctx.state.playList
    }
}
module.exports = new PlaylistController()