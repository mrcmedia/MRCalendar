import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { RotatingLines } from 'react-loader-spinner';

const BirthdayContainer = ({summary , stDate , description , id , type}) => {


  const [isDelete , setIsDelete] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const handleDelete = () => {
    setIsDelete(true)
    setTimeout(() => {
      document.getElementById(`${id}-del`).classList.add('activepop');
    },[100])
  }

  useEffect(() => {
    if(isDelete)
    {
      document.getElementById(`${id}-del`).addEventListener('click' , closeDeletePop)
    }
  },[isDelete])

  function closeDeletePop(event)
  {
    if(event.target === this)
    {
      document.getElementById(`${id}-del`).classList.remove('activepop');
      document.getElementById(`${id}-del`).removeEventListener('click' , closeDeletePop)
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
    
    <div id={id} className='conts relative'>
      <div className='w-full flex-col lg:p-2 mt-5 relative max-h-[250px] flex min-h-fit items-center bg-slate-50'>
          <div className='p-3 overflow-y-scroll min-h-fit max-h-[250px] w-full'>
              <h1 className='text-4xl'>{summary}</h1>
              <p className='mt-1 mb-2'>Birthday : {stDate}</p>
              <h2 className='underline text-lg md:text-md '>about nipuna nishan</h2>
              <p>{description}</p>
          </div>
      </div>
      <div className='flex justify-end shadow-md w-full bg-slate-50'>
        <button className='hidden text-xs w-fit hover:bg-blue-600 rounded-tr hover:text-white transition duration-200 p-2' onClick={() => {window.location.href = `/Update?id=${id}&type=${type}&summary=${summary}&description=${description}&startDate=${stDate}`}}><i className="fa fa-edit pr-1" aria-hidden="true"></i>Update</button>
        <button className='text-xs w-fit hover:bg-red-600 rounded-tl hover:text-white transition  duration-200 p-2' onClick={handleDelete}><i className="fa fa-eraser pr-1" aria-hidden="true"></i>Delete</button>
      </div>

      {isDelete && (
          <div id={`${id}-del`} className=' absolute delete-popup top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-black/90'>
            <div className='w-[200px] p-3 bg-white rounded-lg'>
              <h1 className='text-lg text-red-500'>Delete</h1>
              <p className='text-xs'>Do you want to delete this?</p>
              <button onClick={HandleDelete} className='relative w-full bg-red-600 hover:bg-red-500 text-white p-1 rounded-sm mt-2'><i className="fa fa-trash pr-1" 
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

export default BirthdayContainer
