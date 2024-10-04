import React, { useEffect, useState } from 'react'
import useStore from '../store'
import { Link } from 'react-router-dom'
import { Button, Modal } from 'flowbite-react'

const Home = () => {

    const currentUser = useStore(state => state.currentUser)
    const setCurrentUser = useStore(state => state.setCurrentUser)
    const [users,setUsers] = useState([])
    const [totalUsers,setTotalUsers] = useState(0)
    const [userIdToDelete,setUserIdToDelete] = useState('')
    const [showModal,setShowModal] = useState(false)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/user/getusers')
                const data = await res.json()
                if(data.success !== false){
                    setUsers(data.users)
                    setTotalUsers(data.totalUsers)
                }
                
            } catch (error) {
                console.log(error.message)
            }
        }

        fetchUsers()
    },[currentUser])

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

    const handleDelete = async () => {
        setShowModal(false)
        try{
        if(userIdToDelete === currentUser._id){
            return
        }
        const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
            method: 'DELETE',
        })
        const data = await res.json()
        if(data.success === false){
            console.log(data.message)
        }
        if(data.success !== false){
            setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete))
            setTotalUsers(prev => prev - 1)
        }
        }catch(error){
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
            <p className='text-blue-500 font-bold'>Sign in to delete and update</p>
            </Link>
            )}
            </div>
            {
                users.length > 0 && (
                <ul className='flex flex-col items-center justify-center'>
                {users.map((user) => (
                <li key={user._id}>
                <span className='mr-1'>{user.username}</span>
                <span>{user.email}</span>
                <span onClick={() => {
                    setShowModal(true)
                    setUserIdToDelete(user._id);
                }} className='ml-1 border border-gray-500 
                border-2 font-bold text-gray-500 cursor-pointer
                 hover:text-red-500'>Delete</span>
                </li>
                ))}
                </ul>
            )
            }

            <span>{`Total users : ${totalUsers}`}</span>
        </div>

        <Modal show={showModal} onClose={() => setShowModal(false)}
            popup size='md'>
        <Modal.Header />
        <Modal.Body>
            <h3>Are you sure want to delete</h3>
            <div className='flex items-center justify-center gap-4'>
                <Button onClick={handleDelete} color='failure'>
                    Delete
                </Button>
                <Button color='gray' onClick={() =>setShowModal(false)}>
                    Cancel
                </Button>
            </div>
            
        </Modal.Body>
        </Modal>
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