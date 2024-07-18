import React from 'react'
import "./button.css"
function Button({disable,text,onClick,blu}) {
  return (
    <div className={blu ? "btn btn-blue" : "btn"} onClick={onClick} disabled={disable}>{text}</div>
  )
}

export default Button