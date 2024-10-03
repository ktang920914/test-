import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import userRoute from './routes/user.route.js'
import authRoute from './routes/auth.route.js'

const app = express()
dotenv.config()
app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.MONGO)
.then(() => console.log('Mongodb is connected'))
.catch((err) => console.log(err))

app.use('/api/user' , userRoute)
app.use('/api/auth', authRoute)

app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`)
})

app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})