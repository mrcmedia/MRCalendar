"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Header = () => {
    const [userLogo, setuserLogo] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        axios.get('/api/calendar/auth/get-user').then((response)=> {
            setuserLogo(response.data.picture)
            setUserName(response.data.name)
        })
    }, [])

    return (
    <div className='relative'>
        <div className='w-full hidden space-x-2 shadow-md relative lg:flex items-center h-[70px] p-1 md:p-3 '>
            <section className='relative flex-1'>
                <h1 className='text-2xl sm:text-4xl'>Calendar</h1>
                <p className='top-[-8px] relative text-xs sm:text-lg left-1 underline'>Mahinda Rajapaksha College Homagama.</p>
            </section>
            <h4 className='mr-2 text-sm hidden sm:block'>{userName}</h4>
            <img width={'45'} height={'45'} className='cursor-pointer w-[45px] sm:mr-0 sm:w-[50px] rounded-full' src={userLogo} alt="dp" />
        </div>
    </div>
  )
}

export default Header
