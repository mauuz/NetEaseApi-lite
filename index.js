const {app} = require('./app')
const {APP_PORT} = require('./src/config')
app.listen(APP_PORT,()=>{
    console.log(`listening at http://localhost:${APP_PORT}`)
})
