import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { RotatingLines } from 'react-loader-spinner';

const EventContainer = ({summary , description , stDate , location , endDate , id , type}) => {

  const [isDelete , setIsDelete] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const handleDelete = () => {
    setIsDelete(true)
    setTimeout(() => {
      document.getElementById(id).classList.add('activepop');
    },[100])
  }

  useEffect(() => {
    if(isDelete)
    {
      document.getElementById(id).addEventListener('click' , closeDeletePop)
    }
  },[isDelete])

  function closeDeletePop(event)
  {
    if(event.target === this)
    {
      document.getElementById(id).classList.remove('activepop');
      document.getElementById(id).removeEventListener('click' , closeDeletePop)
      
      setTimeout(() => {
        setIsDelete(false);
      },[300])
    }
  }

  const HandleDelete = (async () => {
    setIsLoad(true);
    try
    {
      const response = await axios.get(`/api/calendar/operations/delete-event?id=${id}`);
      window.location.reload();
      setIsLoad(false);
    }
    catch(err)
    {
      console.log(err.response);
      setIsLoad(false);
    }

  })

  return (
    <div id={`${id}-main`} className='conts w-full mt-5 flex flex-col relative items-center sm:bg-slate-50 bg-slate-50 shadow-md'>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <div className='p-10 flex-1 lg:p-20 xl:py-30 xl:px-52 overflow-y-scroll w-full'>
            <h1 className='text-4xl md:text-5xl capitalize mb-3'>{summary}</h1>
            <section className='sm:flex block items-center justify-start md:justify-between'>
                <p>Event Starts : {stDate}</p>
                <p>Event Ends : {endDate}</p>
            </section>
            <p className='text-xs'>Location : {location}</p>
            <h2 className='underline text-lg py-2 font-semibold'>ABOUT EVENT</h2>
            <p>{description}</p>
        </div>
        <div className='flex justify-end w-full'>
          <button className=' hidden text-xs w-fit hover:bg-blue-600 rounded-tr hover:text-white transition duration-200 p-2' onClick={() => {window.location.href = `/Update?id=${id}&type=${type}&summary=${summary}&description=${description}&startDate=${stDate}&endDate=${endDate}&location=${location}`}}><i className="fa fa-edit pr-1" aria-hidden="true"></i>Update</button>
          <button onClick={handleDelete} className='text-xs w-fit hover:bg-red-600 rounded-tl hover:text-white transition duration-200 p-2'><i className="fa fa-eraser pr-1 " aria-hidden="true"></i>Delete</button>
        </div>

        {isDelete && (
          <div id={id} className='absolute delete-popup top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-black/90'>
            <div className='w-[200px] p-3 bg-white rounded-lg'>
              <h1 className='text-lg text-red-500'>Delete</h1>
              <p className='text-xs'>Do you want to delete this?</p>
              <button onClick={HandleDelete} className='relative w-full hover:bg-red-500 bg-red-600 text-white p-1 rounded-sm mt-2'><i className="fa fa-trash pr-1" 
              aria-hidden="true"></i>Delete
              

              {isLoad && <span className='absolute bg-red-700 top-0 left-0 right-0 bottom-0 flex items-center justify-center'>
                <RotatingLines
                strokeColor="white"
                strokeWidth="5"
                animationDuration="0.75"
                width="20"
                visible={true}
                /><p className='pl-2'>deleting ...</p></span>}
              </button>
            </div>
          </div>
        )}
    </div>
  )
}

export default EventContainer