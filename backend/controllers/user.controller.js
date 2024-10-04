import { errorHandler } from "../utils/error.js"
import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'

export const test = (req,res,next) => {
    res.json({message: 'test api is running'})
}

export const updateUser = async (req,res,next) => {
    try {
        if(req.user.id !== req.params.userId){
            return next(errorHandler(403, 'You are not allowed to update'))
        }
        
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }
        
        const {username,email} = req.body

        const userName = await User.findOne({username})
        if(userName){
            return next(errorHandler(400, 'Username already used'))
        }

        const Email = await User.findOne({email})
        if(Email){
        return next(errorHandler(400, 'Email is already exists'))
        }

        const updateUser = await User.findByIdAndUpdate(req.params.userId,
            {
                $set: 
                {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password 
                }
            },{new:true}
        )

        const {password:pass,...rest} = updateUser._doc
        res.status(201).json(rest)
        
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req,res,next) => {
    try {
        if(!req.user.id && req.user.id !== req.params.userId){
            return next(errorHandler(403 , 'You are not allowed to delete'))
        }

    await User.findByIdAndDelete(req.params.userId)
    res.status(200).json({message: 'User is deleted'})
    } catch (error) {
        next(error)
    }
}

export const getUsers = async (req,res,next) => {
    try {
        const users = await User.find()

        const allUsersWithoutPassword = users.map((user) => {
            const {password, ...rest} = user._doc
            return rest
        })

        const totalUsers = await User.countDocuments()

        res.status(200).json({
            users: allUsersWithoutPassword,
            totalUsers
        })
    } catch (error) {
        next(error)
    }
}