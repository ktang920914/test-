import User from '../models/user.model.js'
import { errorHandler } from '../utils/error.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const signup = async (req,res,next) => {
    try {
    const {username, email, password} = req.body

    if(!username || !email || !password ||
    username === '' || email === '' || password === ''){
        return next(errorHandler(400, 'All fields are required'))
    }

    const userName = await User.findOne({username})
    if(userName){
        return next(errorHandler(400, 'Username is already exists'))
    }

    const Email = await User.findOne({email})
    if(Email){
        return next(errorHandler(400, 'Email is already exists'))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)

    const newUser = User({
        username,
        email,
        password: hashedPassword
    })

    await newUser.save()
    res.status(201).json({message: 'Sign up successfully'})

    }catch(error){
        next(error)
    }
}

export const signin = async (req,res,next) => {
    try {
    const {email, password} = req.body
    
    if(!email || !password || email === '' || password === ''){
        return next(errorHandler(400, 'All fields are required'))
    }

    const validUser = await User.findOne({email})
    if(!validUser){
        return next(errorHandler(404, 'User not found'))
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if(!validPassword){
        return next(errorHandler(400, 'Invalid credentials'))
    }

    const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)
    const {password:pas,...rest} = validUser._doc

    res.cookie('access_token' , token , {
        httpOnly: true
    })
    res.status(200).json(rest)

    }catch(error){
        next(error)
    }
}

export const signout = async (req,res,next) => {
    try{
    res.clearCookie('access_token')
    res.status(200).json('Sign out successfully')
    }catch(error){
        next(error)
    }
}