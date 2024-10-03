import { Alert, Button, Label, TextInput } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'


const Signin = () => {
    
    const [formData,setFormData] = useState({})
    const [signinErrorMessage,setSigninErrorMessage] = useState(null)
    const [signinSuccessMessage,setSigninSuccessMessage] = useState(null)
    const navigate = useNavigate()
    const setCurrentUser = useStore(state => state.setCurrentUser)

    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    const handleSubmit = async (e) => {
        try{
        e.preventDefault()
        const res = await fetch('/api/auth/signin' , {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })
        const data = await res.json()
        if(data.success === false){
            setSigninErrorMessage(data.message)
            setSigninSuccessMessage(null)
        }
        if(data.success !== false){
            setSigninSuccessMessage(data.message)
            setSigninErrorMessage(null)
            setCurrentUser(data)
            navigate('/')
        }

        }catch(error){
            console.log(error.message)
        }
    }

  return (
    <div className='min-h-screen max-w-full'>
        <h1 className='text-3xl mx-auto text-center font-semibold'>Sign in</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex items-center gap-2 justify-center'>
          <Label value='Your email'/>
          <TextInput type='email' id='email' placeholder='email' onChange={handleChange}/>
        </div>
        <div className='flex items-center gap-2 justify-center'>
          <Label value='Your password'/>
          <TextInput type='password' id='password' placeholder='password' onChange={handleChange}/>
        </div>
        <div className='flex items-center justify-center'>
        <Button type='submit'>Sign in</Button>
        </div>
      </form>

      <Link to='/sign-up'>
      <p>Dont have an account, Sign up</p>
      </Link>

      {
        signinSuccessMessage && (
            <Alert className='flex items-center justify-center max-w-max mx-auto' color='success'>
                {signinSuccessMessage}
            </Alert>
        )
      }
      {
        signinErrorMessage && (
            <Alert className='flex items-center justify-center max-w-max mx-auto' color='failure'>
                {signinErrorMessage}
            </Alert>
        )
      }
    </div>
  )
}

export default Signin