import React, { useCallback, useState, useEffect } from 'react';
import axios from "axios";
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../../firebase';
import "../Button/button.css"
import { addDoc, collection, query, getDocs, doc, setDoc,getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { usePlaidLink } from 'react-plaid-link';

const PlaidLink = () => {
  const [user] = useAuthState(auth);
  const [token, setToken] = useState("");
  const [inst,setInst] = useState("")
  const [brand,setBrand] = useState()
  const apiUrl = process.env.REACT_APP_API_URL;

  var b ;
  var i ;

  useEffect(() => {
    const createLinkToken = async () => {
      const response = await fetch(`${apiUrl}/api/create_link_token`, {
        method: 'POST',
      });
      const { link_token } = await response.json();
      setToken(link_token);
    };
    
    createLinkToken();
  
  }, []);
  

  
  

  const onSuccess = useCallback((publicToken, metadata) => {
    const exchange = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/set_access_token`, {
          public_token: publicToken
        });
        
        
        const docRef = doc(db, `users/${user.uid}/accounts/${i}`);
       const docSnap = await getDoc(docRef);
       const response2 = await axios.get(`${apiUrl}/api/transactions`, {
        public_token: publicToken
      });

      const response3 = await axios.get(`${apiUrl}/api/balance`, {
        public_token: publicToken
      });
      
       
       
       if(!docSnap.exists()){
          
        
         await setDoc(doc(db,`users/${user.uid}/accounts`, i),{access_token: response.data.access_token,balance:response3.data.accounts[0].balances.available, transactions:
          response2.data.latest_transactions
        
      });
    
       }else{
    // await updateDoc(doc(db,`users/${user.uid}/accounts`, i),{accounts:arrayUnion({
    //       access_token: response.data.access_token,
    //     transactions:[],
    //     })
    //   });
      // console.log(ch)
       }
      //  setBrand("");
      //  setInst("");

        // const response2 = await axios.post(`${}/api/transactions', {
        //   public_token: publicToken
        // });

        // console.log(response2)
        // const link = {
        //   
        //   institution_name:,
        //   transactions: [{}],

        // }

        // const docRef = await setDoc(
        //   doc(db, `users/${user.uid}/linked_accounts`,response.data.access_token),link
        //     );
        setBrand(response.data)
        console.log(response2.data)
        console.log('User Data:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }




    }
    
       
      
    exchange();
  }, [user]);
const tell = () => {
  window.alert("Initiate Account Linking: When prompted to connect a bank account, use the following test credentials provided by Plaid: Username: user_good, Password: pass_good, Institution: Select Plaid Bank from the list of institutions.")
  open()
}
  const onEvent = useCallback((eventName, metadata) => {
    if(eventName === "SELECT_BRAND"){
      console.log("yes")
      setBrand(metadata.brand_name)
      b = metadata.brand_name
    }
    if(eventName === "SELECT_INSTITUTION"){
      setInst(metadata.institution_name)
      i = metadata.institution_name
    }
    console.log(eventName, metadata);
  }, []);

  const onExit = useCallback((error, metadata) => {
    console.log(error, metadata);
  }, []);

  const config = {
    token,
    onSuccess,
    onEvent,
    onExit,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <button className='btn btn-black' onClick={tell} disabled={!ready}>
      Connect a bank account
    </button>
  );
};

export default PlaidLink;
