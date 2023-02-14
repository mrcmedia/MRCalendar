import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import Clock from 'react-live-clock';
import { RotatingLines } from 'react-loader-spinner';
const SriLanka = require('get-srilanka-districts-cities');
import { getDate  , getDateTime} from '@/utils/GetDateTimeString';
import {setCookie , getCookie} from 'cookies-next';


const Menu = () => {

    const [Load, setLoad] = useState(false);
  const [customFilter, setCustomFilter] = useState(getCookie('today-filter') || false);

  const [date] = useState(new Date().toLocaleString("en-LK", {timeZone: "Asia/Colombo", dateStyle:'long'}));
  const [DayOfWeek] = useState(new Date().toLocaleString("en-LK", {timeZone: "Asia/Colombo", weekday:'long'}));
  const [userLogo, setuserLogo] = useState('');
  const [userName, setUserName] = useState('');

  const EventForm = useForm();
  const BirthdayForm = useForm();

  const [SlCities, setSlCities] = useState([])
  const [dates , setDates] = useState('');
  const [datesTimes , setDatesTimes] = useState('');

  useEffect(() => {
    async function get()
    {
      await axios.get('/api/calendar/auth/get-user').then((response)=> {
        setuserLogo(response.data.picture)
        setUserName(response.data.name)
      })
    }
    get();
  }, [])

  useEffect(() => {
    setDates(getDate(new Date(Date.parse(date))))
    setDatesTimes(getDateTime(new Date()))
  },[])

  const handleEventSubmit = async (event) => {
    setLoad(true);
    try
    {
      const response = await axios.post('/api/calendar/operations/create-event',event)
      document.getElementById('eventForms').reset();
      setLoad(false);
      // console.log(response);
      EventForm.reset();
    }
    catch(err)
    {
      setLoad(false);
      console.error(err.response);
    }
  }

  const handleBirthdaySubmit = async (event) => {
    setLoad(true);
    try
    {
      const response = await axios.post('/api/calendar/operations/create-birthday',event)
      document.getElementById('birthdayForms').reset();
      setLoad(false);
      // console.log(response.data);
      BirthdayForm.reset();
    }
    catch(err)
    {
      setLoad(false);
      console.error(err.response);
    }

    console.log(event);

  }


  useEffect(() => {
    if(SlCities.length == 0)
    {
      SriLanka.provinceList()[0].map((provices) => {
        SriLanka.getDistrictList(provices)[0].map((cities) => {
          setSlCities(SlCities => [...SlCities , cities]);
        })
      })
    }
  }, [SlCities])


  const HandleFilter = (event) => {
    setCookie(event.target.name, event.target.value , {maxAge: 2147483647});
  }

  const HandleFilterChecked = (event) => {
    setCookie(event.target.name, event.target.checked , {maxAge: 2147483647});
    setCustomFilter(event.target.checked)
  }

  return (
    <div className='mt-11 sm:mt-12 shadow-2xl pb-10 md:pb-0 overflow-scroll'>
        <section className='w-full  bg-blue-600 text-white shadow-xl'>
          <section className='flex items-center p-4 sm:p-0'>
            <section className=' px-3 mt-1 flex-1 sm:mt-3 w-full flex flex-col'>
                <Clock
                format={'HH:mm'}
                className="text-4xl sm:text-5xl"
                ticking={true} />
                <h1 className='text-xl sm:text-3xl'>{DayOfWeek}</h1>
                <h1 className='text-sm sm:text-xl relative bottom-2 mb-1 sm:mb-3'>{date}</h1>
            </section>
            <section className='lg:hidden flex flex-col items-center justify-center pr-3'>
            <img src={userLogo} width={'45'} height={'45'} className='w-[45px] sm:mr-0 sm:w-[50px] rounded-full' alt="dp" />
              <p>{userName}</p>
            </section>
          </section>
        </section>
        <section className='p-3 w-full'>
            <h2 className='text-lg'>Filters</h2>
            <section className='flex relative space-x-2 items-center'>
              <input checked={customFilter} onChange={HandleFilterChecked} id='today-filter' name='today-filter' className='relative outline-none bottom-[1px]' type="checkbox"/>
              <label className='cursor-pointer' htmlFor="today-filter">Realtime Events And Birthdays</label>
            </section>
            {!customFilter && <section className='flex flex-col'>
              <label htmlFor="datefrom">From :</label>
              <input defaultValue={getCookie('filter-date-From') ? getCookie('filter-date-From') : dates } name={'filter-date-From'} onChange={HandleFilter} className='bg-white outline-slate-200 outline rounded-sm w-full transition-shadow mt-1 focus:shadow-sm focus:outline-blue-500 mb-3 outline-1 p-1 px-3 text-sm' type="date" id='datefrom' />

              <label htmlFor="datefrom">To :</label>
              <input defaultValue={getCookie('filter-date-To') ? getCookie('filter-date-To') : dates } name={'filter-date-To'} onChange={HandleFilter} className='bg-white outline-slate-200 outline rounded-sm w-full transition-shadow mt-1 focus:shadow-sm focus:outline-blue-500 mb-3 outline-1 p-1 px-3 text-sm' type="date" id='dateTo' />

            </section>}
          </section>
        <section className='py-5 w-full shadow-md bg-slate-50'>
          <h1 className='text-center text-md'>Add Event</h1>
          <form id='eventForms' onSubmit={EventForm.handleSubmit(handleEventSubmit)} className='w-[90%] mx-auto'>
            <label className='text-sm' htmlFor="summary">Summary :</label>
            <input name='summary' {...EventForm.register('summary', {required:true})} placeholder='Summary' type="text" className='bg-white outline-slate-200 outline rounded-sm w-full transition-shadow mt-1 focus:shadow-sm focus:outline-blue-500 mb-3 outline-1 p-1 px-3 text-sm' id='summary' />
            {EventForm.formState.errors.summary && <p className='text-sm w-full text-red-600 mb-3'>summary required! (this is like a title)</p>}

            <label className=' bg-white text-sm' htmlFor="description">Description :</label>
            <textarea {...EventForm.register('description', {required:true})} name='description' placeholder='Description' className='bg-white outline-slate-200 mb-3 outline rounded-sm w-full transition-shadow mt-1 focus:shadow-sm focus:outline-blue-500 outline-1 p-1 px-3 text-sm' id='description' />
            {EventForm.formState.errors.description && <p className='text-sm w-full text-red-600 mb-3'>Description about event required!</p>}

            <label className='bg-white text-sm' htmlFor="startDate">Start Date & Time : </label>
            <input {...EventForm.register('startDate', {required:true})}  name='startDate' defaultValue={datesTimes} type="datetime-local" className='bg-white mb-3 outline-slate-200 outline rounded-sm w-full transition-shadow mt-1 focus:shadow-sm focus:outline-blue-500 outline-1 p-1 px-3 text-sm' id='startDate' />
            {EventForm.formState.errors.startDate && <p className='text-sm w-full text-red-600 mb-3'>Starting Date required!</p>}

            <label className='bg-white text-sm' htmlFor="endDate">End Date & Time : </label>
            <input {...EventForm.register('endDate', {required:true})} name='endDate' defaultValue={datesTimes} type="datetime-local" className='bg-white mb-3 outline-slate-200 outline rounded-sm w-full transition-shadow mt-1 focus:shadow-sm focus:outline-blue-500 outline-1 p-1 px-3 text-sm' id='endDate' />
            {EventForm.formState.errors.endDate && <p className='text-sm w-full text-red-600 mb-3'>Ending Date required!</p>}

            <label className='bg-white text-sm' htmlFor="location">Location :</label>
            <select defaultValue='Pitipana Homagama, Sri Lanka' {...EventForm.register('location', {required:true})} name='location' className='bg-white outline-slate-200 mb-3 outline rounded-sm w-full transition-shadow mt-1 focus:shadow-sm focus:outline-blue-500 outline-1 p-1 px-3 text-sm' id="location">
            <option value={'Pitipana Homagama, Sri Lanka'}>Pitipana Homagama, Sri Lanka</option>
              {SlCities.length > 0 && SlCities.map((itemss) => {
                return (<option key={`${Math.random()} ${itemss} `} value={`${itemss}, Sri Lanka`}>{itemss}, Sri Lanka</option>)
              })}
            </select>
            {EventForm.formState.errors.location && <p className='text-sm w-full text-red-600 mb-3'>Location required!</p>}
            <button className=' w-full p-2 bg-blue-600 text-white rounded-sm hover:bg-blue-500 active:bg-blue-700'>Add Event</button>
          </form>
          {Load && <span className='absolute top-0 left-0 right-0 z-50 bottom-0 flex items-center justify-center bg-black/80'>
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="96"
              visible={true}
            />
          </span>}
        </section>
        <p className='bg-white text-center mt-3 text-slate-400'> ------ OR ------ </p>
        <h1 className='bg-white text-center text-md mt-5'>Add Birthday</h1>
        <form id='birthdayForms' onSubmit={BirthdayForm.handleSubmit(handleBirthdaySubmit)} className='bg-white w-[90%] mx-auto my-5'>
            <label className='bg-white text-sm' htmlFor="birthdayPerson">Bidthday Boy / Girl Name :</label>
            <input {...BirthdayForm.register('birthdayPerson', {required:true})} name='birthdayPerson' type="text" placeholder='Happy Birthday' className='bg-white outline-slate-200 outline rounded-sm w-full transition-shadow mt-1 mb-3 focus:shadow-sm focus:outline-blue-500 outline-1 p-1 px-3 text-sm' id='birthdayPerson' />
            {BirthdayForm.formState.errors.birthdayPerson && <p className='text-sm w-full text-red-600 mb-3'>Person Name / Post required!</p>}

            <label className='bg-white text-sm' htmlFor="birthdaydescription">Who is he/her :</label>
            <textarea {...BirthdayForm.register('birthdaydescription', {required:true})} name='birthdaydescription' placeholder='teacher security' className='bg-white outline-slate-200 outline mb-3 rounded-sm w-full transition-shadow mt-1 focus:shadow-sm focus:outline-blue-500 outline-1 p-1 px-3 text-sm' id='birthdaydescription' />
            {BirthdayForm.formState.errors.birthdaydescription && <p className='text-sm w-full text-red-600 mb-3'>Some description required!</p>}

            <label className='bg-white text-sm' htmlFor="dateofbirth">Date Of Birth : </label>
            <input {...BirthdayForm.register('dateofbirth', {required:true})} defaultValue={dates}  name='dateofbirth' type="date" className=' outline-slate-200 mb-3 bg-white outline rounded-sm w-full transition-shadow mt-1 focus:shadow-sm focus:outline-blue-500 outline-1 p-1 px-3 text-sm' id='dateofbirth' />
            {BirthdayForm.formState.errors.dateofbirth && <p className='text-sm w-full text-red-600 mb-3'>Date of Birth required!</p>}
            <button className='w-full p-2 bg-blue-600 text-white rounded-sm hover:bg-blue-500 active:bg-blue-700'>Add Birthday</button>
          </form>
      </div>
  )
}

export default Menu