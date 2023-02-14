"use client";
import axios from "axios";
import { useEffect } from "react";
import Body from "./Body"
import Header from "./Header"
export default function Home() {

  useEffect(() => {

    async function getting()
    {
      try
      {
        await axios.get('/api/calendar/auth/verify-cookie')
        console.log('already logeed in');
        window.location.href = "/";

      }
      catch(err){}
    }
    
  },[])


  return (
    <div className="relative w-[100vw] h-[100vh]">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      <Header/>
      <Body/>
    </div>
  )
}