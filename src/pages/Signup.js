import React from 'react'
import Header from '../components/Header'

import SignComponent from '../components/SignupSignin/SignComponent'

function Signup() {
  return (
    <div>
      <Header/> 
      <div className='wrapper'>

        <SignComponent/>
      </div>
      </div>
  )
}

export default Signup