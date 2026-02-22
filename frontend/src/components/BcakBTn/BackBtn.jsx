import React from 'react'
import {useNavigate} from 'react-router-dom'
import './BackBtn.css';



function BackBtn() {
  const navigate = useNavigate()
  return (
        <p className='back_btn' onClick={()=>navigate(-1)}> 🔙</p>
    
  )
}

export default BackBtn