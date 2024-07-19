import React, { useEffect } from 'react'
import {useAuthState} from "react-firebase-hooks/auth"
import "./header.css"
import {auth} from "../../firebase"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
function Header() {
  const [user,loading] = useAuthState(auth);
const navigate = useNavigate();
  useEffect(() => {
    if (user){
      navigate("/dashboard")
    }
  }, [user,loading])
  
    function logout(){
      try{
       signOut(auth).then(()=> {
        toast.success("Logged out")
        navigate("/");
    
}).catch((error) => {
toast.error(error.message)
    });
  } catch (e){

  }
}
  return (
    <div className='navbar'><p className= 'logo'>Finance</p>
    <p className='link' onClick={logout}>Logout</p></div>
  )
}

export default Header