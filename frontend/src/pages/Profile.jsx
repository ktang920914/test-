import { Label, TextInput, Alert } from 'flowbite-react'
import React, { useState } from 'react'
import useStore from '../store'
import { Button } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'

const Profile = () => {

    const currentUser = useStore(state => state.currentUser)
    const setCurrentUser = useStore(state => state.setCurrentUser)
    const [formData,setFormData] = useState({})
    const navigate = useNavigate()
    const [updateErrorMessage,setUpdateErrorMessage] = useState(null)
    const [updateSuccessMessage,setUpdateSuccessMessage] = useState(null)

    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    const handleBack = () => {
        navigate('/')
    }

    const handleDelete = async () => {
        try{
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
            method: 'DELETE',
        })
        const data = await res.json()
        if(data.success === false){
            console.log(data.message)
        }
        if(data.success !== false){
            setCurrentUser(null)
            navigate('/')
        }
        }catch(error){
            console.log(error.message)
        }
    }

    const handleSubmit = async (e) => {
        try{
        e.preventDefault()
        if(Object.keys(formData).length === 0){
            return setUpdateErrorMessage('No changes')
        }
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(formData),
        })
        const data = await res.json()
        if(data.success === false){
            setUpdateErrorMessage(data.message)
            setUpdateSuccessMessage(null)
        }
        if(data.success !== false){
            setUpdateSuccessMessage('Update Successfully')
            setUpdateErrorMessage(null)
            setCurrentUser(data)
        }
        }catch(error){
            console.log(error.message)
        }
    }

  return (
    <div className='min-h-screen max-w-full'>
        <h1 className='text-center font-bold text-3xl'>Profile</h1>
        <form onSubmit={handleSubmit}>
        <div className='flex items-center justify-center gap-2 max-w-sm mx-auto'>
            <Label value='username'/>
            <TextInput id='username' onChange={handleChange} defaultValue={currentUser.username}/>
        </div>
        <div className='flex items-center justify-center gap-2 max-w-sm mx-auto'>
            <Label value='email'/>
            <TextInput id='email' onChange={handleChange} defaultValue={currentUser.email}/>
        </div>
        <div className='flex items-center justify-center gap-2 max-w-sm mx-auto'>
            <Label value='password'/>
            <TextInput id='password' onChange={handleChange} type='password' defaultValue={currentUser.password} placeholder='password'/>
        </div>
        <div className='flex items-center justify-center gap-2 mt-3'>
        <Button onClick={handleBack} type='button'>Back</Button>
        <Button type='submit' gradientDuoTone='purpleToBlue'>Update</Button>
        <Button  onClick={handleDelete} type='button'>Delete</Button>
        </div>
        </form>
        {
        updateSuccessMessage && (
            <Alert className='flex items-center justify-center max-w-max mx-auto' color='success'>
                {updateSuccessMessage}
            </Alert>
        )
      }
      {
        updateErrorMessage && (
            <Alert className='flex items-center justify-center max-w-max mx-auto' color='failure'>
                {updateErrorMessage}
            </Alert>
        )
      }
    </div>
  )
}

export default Profile