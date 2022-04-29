class Success {
    successRes (msg){
        let res = {
            status:'success',
            msg:msg
        }
        return res
    }
}


module.exports = new Success()