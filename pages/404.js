import React from 'react'
import ErrorBody from './ErrorComps/ErrorBody'
import '../app/globals.scss'

const Custom404 = () => {
  return (
    <div>
      <ErrorBody code={404}/>
    </div>
  )
}

export default Custom404