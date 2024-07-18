import React, { useState,useEffect } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import {collection,doc,getDocs} from 'firebase/firestore';
import { db, auth } from '../../firebase';
import {  useAuthState} from 'react-firebase-hooks/auth';
import Acclist from './acclist';


import ListItem from '@mui/material/ListItem';



import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';


export default function NestedList({accounts}) {
 const [user] = useAuthState(auth)
  const [open, setOpen] = React.useState(true);
  const [DocNames,setDocNames] = useState([]);
  const [st,setst] = useState(true)
  var arr = []

  useEffect(() => {
   
    const fetch = async () => {
        const querySnapshot = await getDocs(collection(db, `users/${user.uid}/accounts`));
    const names = querySnapshot.docs.map(doc => doc.id);
    const test = querySnapshot.docs.map(doc =>  ({name: doc.id, 
        data: doc.data()})
    );
    // const docs = querySnapshot.docs.map(doc => doc.data());
    // const data = docs.map((d) => d.transactions)
    // data.map((d) => d.map((i)=>{ console.log(i)}))
   const querysnapshot = await getDocs(collection(db, `users/${user.uid}/accounts`));
    let transactionsArray = [];
    const docs = querysnapshot.docs.map(doc => doc.data());
    console.log(docs)
    const data = test.map((d) => ({name: d.name, 
        transactions: d.data.transactions}))
    data.map((d) => {d.transactions.map((i) => { var obj = {
        type:"expense",
        date: i.date,
        amount: i.amount,
        tag:d.name,
        name:i.name,
      }
      
      transactionsArray.push(obj)
    })
      
     })
    //     d.map((i)
    // => { var obj = {
    //     type:"expense",
    //     date: i.transactions.date,
    //     amount: i.transactions.amount,
    //     tag:d.name,
    //     name:i.transactions.name,
    //   }
      
    //   transactionsArray.push(obj)
      
    //  })
     console.log(transactionsArray)
    
    setDocNames(test);
   
    
    }
    fetch();
    
  }, [])
  

  const handleClick = () => {
    setOpen(!open);
  };
  const  liist =  async () =>{
    const querySnapshot = await getDocs(collection(db, `users/${user.uid}/accounts`));
    const names = querySnapshot.docs.map(doc => doc.id);
   
    setDocNames(names);
  }

  return (
    <List
      sx={{ width: '100%', maxWidth: 460, bgcolor: 'background.paper',marginTop:3,marginLeft:3 }}
      component="nav"
      aria-labelledby="nested-list-subheader"
     
    >
     


      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <AccountBalanceIcon />
        </ListItemIcon>
        <ListItemText primary="Accounts" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
 {DocNames.map((name) => (

    <Acclist name={name.name} data={name.data}></Acclist>
 ))}
   

        


   
   
         


        </List>
      </Collapse>



    </List>
  );
}
