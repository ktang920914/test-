import { Alert, Button, Label, TextInput } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'

const Signup = () => {
    
    const [formData,setFormData] = useState({})
    const [signupErrorMessage,setSignupErrorMessage] = useState(null)
    const [signupSuccessMessage,setSignupSuccessMessage] = useState(null)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    const handleSubmit = async (e) => {
        try{
        e.preventDefault()
        const res = await fetch('/api/auth/signup' , {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })
        const data = await res.json()
        if(data.success === false){
            setSignupErrorMessage(data.message)
            setSignupSuccessMessage(null)
        }
        if(data.success !== false){
            setSignupSuccessMessage(data.message)
            setSignupErrorMessage(null)
            navigate('/sign-in')
        }

        }catch(error){
            console.log(error.message)
        }
    }

  return (
    <div className='min-h-screen max-w-full'>
        <h1 className='text-3xl mx-auto text-center font-semibold'>Sign up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex items-center gap-2 justify-center'>
          <Label value='Your username'/>
          <TextInput type='text' id='username'placeholder='Username' onChange={handleChange}/>
        </div>
        <div className='flex items-center gap-2 justify-center'>
          <Label value='Your email'/>
          <TextInput type='email' id='email' placeholder='email' onChange={handleChange}/>
        </div>
        <div className='flex items-center gap-2 justify-center'>
          <Label value='Your password'/>
          <TextInput type='password' id='password' placeholder='password' onChange={handleChange}/>
        </div>
        <div className='flex items-center justify-center'>
        <Button type='submit'>Sign up</Button>
        </div>
      </form>
    
        <Link to='/sign-in'>
      <p>Already have account, Sign in</p>
      </Link>

      {
        signupSuccessMessage && (
            <Alert className='flex items-center justify-center max-w-max mx-auto' color='success'>
                {signupSuccessMessage}
            </Alert>
        )
      }
      {
        signupErrorMessage && (
            <Alert className='flex items-center justify-center max-w-max mx-auto' color='failure'>
                {signupErrorMessage}
            </Alert>
        )
      }
    </div>
  )
}

export default Signup