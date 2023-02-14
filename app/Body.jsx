import axios from 'axios';
import Hamburger from 'hamburger-react';
import React, { useState } from 'react'


import Container from './Container';
import Menu from './Menu';




const Body = () => {

  const [IsToggled , setIsToggled] = useState(false);
  
  

  const HandleMenu = (e) => {
    setIsToggled(e);
    if(window.innerWidth <= 1024)
    {
      document.querySelector("#mb-menu").classList.toggle('mbac')
    }
    else
    {
      document.querySelector("#menu").classList.toggle('active')
    }
  }

  const HandleLogOut = async () => {
    try
    {
      await axios.put('/api/calendar/auth/log-out');
      window.location.reload();
    }
    catch(err)
    {
      console.error(err);
    }
  }


  return (
    <div className='flex-1 w-full relative'>
      <section className='shadow-md text-white fixed md:absolute top-0 left-0 right-0 z-50 bg-blue-600 flex items-center'>
        <section className='flex-1 flex items-center'>
          <section className='block '><Hamburger size={'15'} toggled={IsToggled} onToggle={(toggle) => {HandleMenu(toggle)}}/>
          </section>
          <h2 className='p-1 sm:p-3 text-xl'>Calendar Operations.</h2>
        </section>
        <button onClick={HandleLogOut} className='p-3 hover:bg-white h-full transition duration-200 hover:text-black'><i className="fa fa-sign-out" aria-hidden="true"></i></button>
      </section>
      
      <div className='absolute hidden  top-0 left-0 right-0 bottom-0 lg:flex'>
        <div id='menu' className='not-open flex'>
          <Menu/>
        </div>
        <div className='hidden lg:block w-full h-full pt-12 relative lg:flex-1'>
          <Container/>
        </div>
      </div>
      <div id='mb-menu' className='fixed z-40 bg-white flex lg:hidden mobile-menu top-0 w-full h-[100vh]'>
        <Menu/>
      </div>
      <div className='lg:hidden absolute z-30 top-10 left-0 right-0 bottom-0'>
        <Container/>
      </div>
    </div>
  )
}

export default Body