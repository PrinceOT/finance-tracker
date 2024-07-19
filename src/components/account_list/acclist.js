import React from 'react'
import { ListItemIcon } from '@mui/material'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import {ListItem} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import {IconButton} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ListItemText from '@mui/material/ListItemText'
import { db, auth } from '../../firebase';
import {  useAuthState} from 'react-firebase-hooks/auth';
import {collection,doc,getDocs,deleteDoc} from 'firebase/firestore';

function Acclist({name,data}) {
const [user] = useAuthState(auth)
    
    
    const refresh = async () => {

    }
    const del = async () => {
 if(window.confirm("are you sure you want to delete this link account from your finance tracker?")){
    
    await deleteDoc(doc(db, `users/${user.uid}/accounts`, `${name}`));
 }else{

 }
    }
  
  return (
    <ListItem sx={{ pl: 4 }} 
    
 secondaryAction={
    <ListItem  sx={{ width: '100%', gap: 3}}>
    <IconButton edge="end" aria-label="comments" >
      <RefreshIcon  sx={{fontSize:35}}/>
    </IconButton>
    <IconButton edge="end" aria-label="comments" onClick={del}>
      <DeleteIcon sx={{fontSize:35}}/>
    </IconButton>
    </ListItem>
   
  }
 
 disablePadding> 
     
            <ListItemIcon>
              <CreditCardIcon />
            </ListItemIcon>
            <ListItemText primary={name} /></ListItem>
)
    
}

export default Acclist;