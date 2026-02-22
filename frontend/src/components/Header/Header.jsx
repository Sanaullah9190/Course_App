import React, { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import "./Header.css"

function Header() {


    const navigate = useNavigate()
    return (
            <div className="portal-header">
                <div className="header-content">
                    <h1>Campus <span>Circuit</span> Portal</h1>
                    <p>Access high-quality study materials, notes, and previous year papers.</p>
                    <p onClick={() => navigate("/")} style={{ cursor: "pointer", fontWeight: 'bolder' }}>Home</p>
                </div>
            </div>
        

    )
}

export default Header