"use client";
import React, { useState } from 'react'
import axios from 'axios';
import { RotatingLines } from 'react-loader-spinner';

const Body = () => {

  const [isLoad, setIsLoad] = useState(false);
  const handleSignIn = () => {
    setIsLoad(true)
    axios.get('/api/calendar/auth').then((response) => {
      window.location.href = response.data.url;
    });
  }
  return (
    <div className='absolute top-0 left-0 bottom-0 right-0 bg-slate-50 flex items-center justify-center'>
        <section className='md:w-1/2 py-10 w-[80%] bg-white lg:w-1/4 h-fit p-5 rounded-md drop-shadow-lg '>
            <h1 className='text-center text-xl mb-5'>Welcome To MRC Calander</h1>
            <button onClick={() => handleSignIn()} className='bg-blue-600 relative text-white hover:bg-blue-500
             w-full mt-1 p-3 rounded-sm'><i className="fa fa-google-plus pr-3" aria-hidden="true"></i>Continue With Google
             
             {isLoad && <span className='absolute bg-blue-600 top-0 left-0 right-0 bottom-0 flex items-center justify-center'><RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="26"
              visible={true}
            /><p className='ml-2'>please wait...</p></span>}
             </button>
        </section>
    </div>
  )
}
export default Body