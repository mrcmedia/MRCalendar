"use client";
import React, { useEffect, useState } from 'react'
import { InfinitySpin, MutatingDots, ProgressBar, Puff, ThreeDots, Triangle } from 'react-loader-spinner';
import axios from 'axios';
import Header from './Header';
import Body from './Body';
import { setCookie } from 'cookies-next';


const page = () => {
  const [Verrified, setVerrified] = useState(false)
  useEffect(() => {
    axios.get('/api/calendar/auth/verify-cookie' ,).then((response)=> {
      setVerrified(response.data.verrified)
      setCookie('today-filter' , true);

    }).catch((error) => {
      console.error(error);
      window.location.href = "/signin";
    })
  },[])
  if(!Verrified)
  {
    return (
      <div className="relative flex items-center justify-center w-[100vw] h-[100vh] bg-slate-900">
        <section className='md:w-1/2 relative h-fit p-3 flex flex-col items-center'>
          <img className='w-[50%] lg:w-[20%]' src="https://github.com/Nishan46/DBMS-frontend/blob/Nishan/src/assets/MRC%20PNG.png?raw=true" alt="scl-logo" />
          <h1 className='text-white text-3xl md:text-4xl'>MRC Calendar</h1>
          <h2 className='text-slate-100 text-2xl md:text-3xl'>Welcome</h2>
          <span className='w-full flex items-center justify-center'>
            <ProgressBar
              width="80"
              ariaLabel="progress-bar-loading"
              wrapperStyle={{}}
              wrapperClass="progress-bar-wrapper"
              borderColor = '#F4442E'
              barColor = '#51E5FF'
            />
          </span>
        </section>
      </div>
    )
  }
  else
  {
    return (
      <div className="relative w-[100vw] flex flex-col h-[100vh]">
        <Header/>
        <Body/>
      </div>
    )
  }
}

export default page

