import React, { useState } from 'react'
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider } from "firebase/auth";
import {auth,db,provider} from "../../firebase"
import { toast } from 'react-toastify';
import "./sign.css"
import Input from '../input/input'
import Button from '../Button/button';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc,getDoc,collection } from 'firebase/firestore';
function SignComponent() {
 
  const [name,setName] = useState("")
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");
  const [loading,setLoading] = useState(false);
  const [login,setLogin] = useState(false);
  const navigate = useNavigate();

//   function signupWithEmail(){
// console.log(password);
// console.log(name);
// if(name!="" && email!="" && password!="" && confirm!=""){
//   if(password==confirm){
// console.log("pass 1")
// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     console.log("pass 2")
//     // Signed up 
//     const user = userCredential.user;
//     console.log(user);
//     toast.success("User Craeted")
//     setLoading(true);
//     setConfirm("");
//     setEmail("");
//     setPassword("");
//     setName("");
//     createDoc(user)
//     navigate("/dashboard");
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     console.log(error)
//     toast.error(errorMessage)
//     setLoading(false);
//     // ..
//   });

//   }else{
//     toast.error("Passwords do not match!")
//     setLoading(false);
//   }

//   }else{
//     toast.error("All fields are mandatory")
//     setLoading(false);
//   }
// }

async function signupWithEmail() {
  console.log(password);
  console.log(name);

  if (name !== "" && email !== "" && password !== "" && confirm !== "") {
    if (password === confirm) {
      try {
        console.log("pass 1");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("pass 2");

        // Signed up
        const user = userCredential.user;
        console.log(user);
        toast.success("User Created");
        setLoading(true);
        setConfirm("");
        setEmail("");
        setPassword("");
        setName("");
        await createDoc(user);
        navigate("/dashboard");
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        toast.error(errorMessage);
        setLoading(false);
      }
    } else {
      toast.error("Passwords do not match!");
      setLoading(false);
    }
  } else {
    toast.error("All fields are mandatory");
    setLoading(false);
  }
}

function loginWithEmail(){
  setLoading(true);
  if( email!="" && password!=""){
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    setEmail("");
    setPassword("");
    const user = userCredential.user;
    setLoading(false);
    navigate("/dashboard");
    toast.success("Welcome", email)
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage)
    setLoading(false);
  });
}else{
  toast.error("")
  setLoading(false);
}
}

async function createDoc(user){
  setLoading(true);
  if (!user) return;

const userRef = doc (db,
"users", user.uid);
const userData = await getDoc (userRef);

if (!userData.exists()) {
  const createdAt = new Date();
  try{

await setDoc(doc(db,"users",user.uid),{
  name: user.displayName ? user.displayName : name,
  email:user.email,
  photoURL : user.photoURL ? user.photoURL : "",
  createdAt:createdAt,
})

await setDoc(collection(db,`users/${user.uid}/accounts`),{});

setLoading(false);
  }catch(e){
    toast.error(e.message);
    setLoading(false);

  }
}else{
  //toast.error("Doc already exists");
  setLoading(false);
}


}
function googlesignin(){
  setLoading(true)
  try {
    signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    createDoc(user);
    setLoading(false)
    toast.success("SUCCESS");
    navigate("/dashboard");
    
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(error.message)
    // The email of the user's account used.
    // const email = error.customData.email;
    // // The AuthCredential type that was used.
    // const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  } catch (error) {
    toast.error(error.message)
    
  }

  
}
  return (
    <>
    { login ? (<div className='
    sign-wrapper'> <h2 className='title'>Log in to <span style={{color:"var(--theme)"}} >F.</span></h2>

    <form>
     
      <Input label={"Email"} type={"email"} state={email} setState={setEmail} placeholder={"user@something.com"}/>
      <Input label={"Password"} type={"password"} state={password} setState={setPassword} placeholder={"Password"}/>
 
     
      <Button disable={loading} text={loading ? "Loading...":"Log in Email and Password"}  onClick={loginWithEmail} blu={false}/>
      <p style={{textAlign:"center",margin:0}}>or</p>
      <Button disable={loading} text={loading ? "Loading...":"Log in with Google"} onClick={googlesignin} blu={true}/>
      <p style={{textAlign:"center",margin:0}} onClick={()=>setLogin(false)}>New Here? Register Here.</p>
      </form>
      </div>) 
      : (
    <div className='
    sign-wrapper'> <h2 className='title'>Sign Up on <span style={{color:"var(--theme)"}} >F.</span></h2>

    <form>
      <Input label={"Full Name"} state={name} setState={setName} placeholder={"Jonny boy"}/>
      <Input label={"Email"} type={"email"} state={email} setState={setEmail} placeholder={"user@something.com"}/>
      <Input label={"Password"} type={"password"} state={password} setState={setPassword} placeholder={"Password"}/>
      <Input label={"Confirm Password"} type={"password"} state={confirm} setState={setConfirm} placeholder={"Confirm"}/>
     
      <Button disable={loading} text={loading ? "Loading...":"Sign up using Email and Password"}  onClick={signupWithEmail} blu={false}/>
      <p style={{textAlign:"center",margin:0}}>or</p>
      <Button disable={loading} text={loading ? "Loading...":"Sign up with Google"} onClick={googlesignin} blu={true}/>
      <p style={{textAlign:"center",margin:0,cursor:"pointer"}} onClick={()=>setLogin(true) }>Already have an account, log in here.</p>
      </form>
      </div>
)}</>
  )
}

export default SignComponent;