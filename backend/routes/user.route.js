import express from 'express'
import { deleteUser, test, updateUser, getUsers } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyuser.js'

const router = express.Router()

router.get('/test' , test)
router.put('/update/:userId', verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser)
router.get('/getusers', getUsers)

export default router