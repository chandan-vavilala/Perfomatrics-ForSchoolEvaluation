import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faSearch, faTachometerAlt, faCog, faBars, faTimes, faGraduationCap, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faAlignLeft, faSearch} from '@fortawesome/free-solid-svg-icons';
import DisplayFacultyContents from "../Paths/contentDisplays/displayFacultyContents";
import { auth, firestore } from '../../fbconfig';
import { doc, getDoc } from 'firebase/firestore';
import {Sidebar} from '../Paths/Sidebar/Sidebar'; // Import Sidebar component


export default function Faculty() {
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
    <div className="flex">
        <Sidebar isOpen={isOpen} toggle={toggleSidebar} role={userDetails ? userDetails.role : ''} userfName={userDetails ? userDetails.FirstName : ''} userlName={userDetails ? userDetails.LastName : ''} UserImage={userDetails ? userDetails.Image : ''}  />      <div className={`main-content ${isOpen ? 'sidebar-open' : 'sidebar-closed'} flex-grow p-10`}>
        <div className="header flex justify-between items-center mb-4">
          
          <div className="divheader">
              {userDetails && <h2 style={{ marginRight: '40px' }}>{userDetails.FirstName} {userDetails.LastName}</h2>}
          </div>



          </div>

          <div style={{marginTop:'100px'}}> <DisplayFacultyContents/>  </div>
            
          </div>
    </div>
  );
}
