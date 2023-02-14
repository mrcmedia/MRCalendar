import React from 'react'
import { Raleway } from '@next/font/google';

export const title = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const ErrorBody = ({code}) => {
  return (
    <div className={`absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-slate-300 flex ${title.className}`}>
      <title>404 not found</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <h1 className='sm:text-3xl text-xl  mb-5 text-center'>There is nothing to see here ...</h1>
        <section className='flex mb-5 space-x-5 items-center'>
        <h1 className='text-5xl text-slate-400'><i className="fa fa-frown-o" aria-hidden="true"></i></h1>
        <p className='text-slate-400 capitalize text-4xl'>{code} not found</p>
        </section>
        <p className='text-slate-600'>contact:mediaunitmrc@gmail.com</p>
    </div>
  )
}

export default ErrorBody