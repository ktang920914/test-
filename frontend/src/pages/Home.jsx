import React from 'react'
import useStore from '../store'
import { Link } from 'react-router-dom'
import { Button } from 'flowbite-react'

const Home = () => {

    const currentUser = useStore(state => state.currentUser)
    const setCurrentUser = useStore(state => state.setCurrentUser)

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/auth/signout', {
                method: 'POST',
            })
            const data = await res.json()
            if(data.success === false){
                console.log(data.message)
            }
            if(data.success !== false){
                setCurrentUser(null)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

  return (
    <div>
        <div className='flex flex-col items-center gap-2 justify-center mb-5'>
            <div className=''>
            <h1 className='text-3xl'>Welcome to the MERN PAGE</h1>
            </div>
            <div>
            {!currentUser && (
            <Link to='/sign-in'>
            <p className='text-blue-500 font-bold'>Sign in to get more info</p>
            </Link>
            )}
            </div>
        </div>
        {currentUser && (
        <>
        <div className='flex flex-col gap-4'>
        <h1 className='text-center font-bold'>Welcome, Dear</h1>
        <div className='flex flex-col text-center gap-2'>
        <p>{currentUser.username}</p>
        <p>{currentUser.email}</p>
        <Link to='/profile'>
        <p className='font-extrabold text-teal-500'>Edit profile</p>
        </Link>
        <div className='flex items-center justify-center mx-auto'>
        <Button onClick={handleSignout}>Sign out</Button>
        </div>
        </div>
        </div>
        </>
        )
        }
    </div>
  )
}

export default Home