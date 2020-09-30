const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/user')

const app = express()
const port = process.env.PORT || 3001

app.use(express.json())
app.use(userRouter)


app.listen(port, ()=>{
    console.log('server is up on port '+ port)
})