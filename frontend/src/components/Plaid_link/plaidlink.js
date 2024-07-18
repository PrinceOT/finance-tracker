// import React, { useCallback, useState } from 'react';
// import axios from "axios";
// import {  useAuthState} from 'react-firebase-hooks/auth';
// import { db,auth } from '../../firebase';
// import "../Button/button.css"
// import { addDoc, collection,query,getDocs,doc,setDoc } from 'firebase/firestore';

// import {
//   usePlaidLink,
//   PlaidLinkOnSuccess,
//   PlaidLinkOnEvent,
//   PlaidLinkOnExit,
//   PlaidLinkOptions,
// } from 'react-plaid-link';

// const PlaidLink = () => {
//   const [user] = useAuthState(auth) ;
//    const [token, setToken] = useState("");

//   // get a link_token from your API when component mounts
//   React.useEffect(() => {
//     const createLinkToken = async () => {
//       const response = await fetch('http://localhost:3001/api/create_link_token', {
//         method: 'POST',
//       });


      
//       const { link_token } = await response.json();
//       setToken(link_token);
//     };
//     createLinkToken();
//   }, []);

//   const onSuccess = useCallback<PlaidLinkOnSuccess>((publicToken, metadata) => {
//     // send public_token to your server
//     // https://plaid.com/docs/api/tokens/#token-exchange-flow
// const exchange = async () => {
//    try {
      
//      const response = await axios.post('http://localhost:3001/api/set_access_token', {
//       public_token: publicToken
//      });

//      await setDoc(doc(db,"link",user.uid),{
//       accesstoken: response.data.access_token,
//       itemId: response.data.item_id
//     })
 
//     console.log('User Data:', response.data);
//      return response.data;
//    } catch (error) {
//      console.error('Error fetching user data:', error);
//    }
  
  
// }
//     exchange();
//   }, []);
//   const onEvent = useCallback<PlaidLinkOnEvent>((eventName, metadata) => {
//     // log onEvent callbacks from Link
//     // https://plaid.com/docs/link/web/#onevent
//     console.log(eventName, metadata);
//   }, []);
//   const onExit = useCallback<PlaidLinkOnExit>((error, metadata) => {
//     // log onExit callbacks from Link, handle errors
//     // https://plaid.com/docs/link/web/#onexit
//     console.log(error, metadata);
//   }, []);

//   // const config: PlaidLinkOptions = {
//   //   token,
//   //   onSuccess,
//   //   onEvent,
//   //   onExit,
//   // };

//   const handler = Plaid.create({
//     token: 'GENERATED_LINK_TOKEN',
//     onSuccess: (public_token, metadata) => {},
//     onLoad: () => {},
//     onExit: (err, metadata) => {},
//     onEvent: (eventName, metadata) => {},
//   });

//   const {
//     open,
//     ready,
    
//     // error,
//     // exit
//   } = usePlaidLink(config);

//   return (
//     <button className='btn btn-black' onClick={() => open()} disabled={!ready}>
//       Connect a bank account
//     </button>
//   );
// };

// export default PlaidLink;