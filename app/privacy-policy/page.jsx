import React from 'react'
import '../globals.scss'

const page = () => {
  return (
    <div className='w-[100vw] items-center justify-center h-[100vh] flex bg-slate-100'>
        <div className='w-[90%] md:w-1/2 xl:w-1/3 h-fit p-5 bg-white drop-shadow-md'>
            <h1 className='mb-2 text-lg text-slate-900'>Privacy and Policies.</h1>
            <hr className='mb-3'/>

            <p className='underline underline-offset-2 text-slate-500 mb-5'>mrc calendar.</p>

            <p className='text-slate-600'>We are using this calendar as an todo/ events viewer in our school. In this website we are accesing users' profile picture email address and name for identify purposes.</p>

            <hr className='mt-3'/>

            <p className='mt-5 text-slate-600'>And we are also accessing users primary <u>google calendar</u> as get store delete your calendar events and we are viewing your primary google calendar events in our website</p>
        </div>
    </div>
  )
}

export default page