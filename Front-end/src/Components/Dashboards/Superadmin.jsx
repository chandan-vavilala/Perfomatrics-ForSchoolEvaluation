import React, { useState, useEffect } from 'react';
import {Sidebar} from '../Paths/Sidebar/Sidebar'; // Assuming Sidebar.js is in the same directory
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { auth, firestore } from '../../fbconfig';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, updateProfile, deleteUser } from "firebase/auth";
import {DisplayContent} from '../Paths/contentDisplays/displaySuperadminContents';
import Widget from '../Paths/widgets/widget';



export default function SuperAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [filter, setFilter] = useState('');
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error('User not logged in.');
          return;
        }

        const docSnap = await getDoc(doc(firestore, 'users', user.uid));

        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.error('User details not found.');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };



  return (
      <div>
          <Sidebar isOpen={isOpen} toggle={toggleSidebar} role={userDetails ? userDetails.role : ''} userfName={userDetails ? userDetails.FirstName : ''} userlName={userDetails ? userDetails.LastName : ''} UserImage={userDetails ? userDetails.Image : ''}  />
          <div className='divheader'>
            {userDetails && <h2 style={{marginRight:'30px'}}>{userDetails.FirstName} {userDetails.LastName}</h2>}
          </div>

         <div className="widget-space">
          <Widget type="users" />
          <Widget type="recentUsers" />
        </div> 
        
      </div>
 
  );


}

