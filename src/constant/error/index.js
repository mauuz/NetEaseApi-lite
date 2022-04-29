class Error {
    errorRes (msg){
        let res = {
            status:'failed',
            msg:msg
        }
        return res
    }
}


module.exports = new Error()