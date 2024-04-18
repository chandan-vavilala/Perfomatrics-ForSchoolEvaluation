import React, { useState, useEffect } from 'react';
import {Sidebar} from './Sidebar/Sidebar'; // Import the Sidebar component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from '../../fbconfig';
import { doc, getDoc } from 'firebase/firestore';
import { DisplayContent } from './contentDisplays/displaycontents';
import DisplayAdminContent from './contentDisplays/displayAdminContents';
import DisplayFacultyContent from './contentDisplays/displayFacultyContents'


import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS file
import '../Cascade Styling/superadmin.css'; // Import your custom CSS file


export default function Schools() {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error('User not logged in.');
          navigate('/'); // Redirect to login page if user is not logged in
          return;
        }
  
        const docSnap = await getDoc(doc(firestore, 'users', user.uid));
  
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
          setUserRole(docSnap.data().role); // Assuming the user role is stored in 'role' field
        } else {
          console.error('User details not found.');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
  
    fetchUserDetails();
  }, [navigate]);




  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };


  return (
    <div className="flex">
      {/* Integrating the Sidebar component */}
      <Sidebar isOpen={isOpen} toggle={toggleSidebar} role={userDetails ? userDetails.role : ''} userfName={userDetails ? userDetails.FirstName : ''} userlName={userDetails ? userDetails.LastName : ''} UserImage={userDetails ? userDetails.Image : 'https://firebasestorage.googleapis.com/v0/b/nwmsu-assessmentviewer.appspot.com/o/Profile%20Pictures%2Fdefault.jpeg?alt=media&token=5866e39e-5f8b-4960-b9cb-1320e268ca0c'}  />
      <div className={`main-content ${isOpen ? 'sidebar-open' : 'sidebar-closed'} flex-grow p-10`}>
        <div className="header flex justify-between items-center mb-4">
        
        {/* <div className="divheader">
            
           <input
            type="text"
            placeholder="Search..."
            value={filter}
            onChange={handleFilterChange}
            style={{ padding: '8px', marginRight: '10px', marginLeft:'0px'}}
          />
          <button onClick={() => setFilter('')} style={{ padding: '8px',marginRight:'30px' }}>Clear</button>
       </div>
         */}
        
        </div>

        <div className="cards-container flex flex-wrap gap-4"  style={{ justifyContent: 'flex-start',marginLeft: '50px',marginTop: '150px' }}>
        
         {userRole === 'super-admin' && (
             <>
             <DisplayContent/>
            </>
          )}

          {userRole === 'admin' && (
            <>
              <DisplayAdminContent/>
            </>
          )}

          {userRole === 'faculty' && (
            <>
             <div className="flex">
        <Sidebar isOpen={isOpen} toggle={toggleSidebar} role={userDetails ? userDetails.role : ''} userfName={userDetails ? userDetails.FirstName : ''} userlName={userDetails ? userDetails.LastName : ''} UserImage={userDetails ? userDetails.Image : ''}  />      <div className={`main-content ${isOpen ? 'sidebar-open' : 'sidebar-closed'} flex-grow p-10`}>
        <div className="header flex justify-between items-center mb-4">
          
          <div className="divheader">
              {userDetails && <h2 style={{ marginRight: '40px' }}>{userDetails.FirstName} {userDetails.LastName}</h2>}
          </div>
          </div>
          <div style={{marginTop:''}}> <DisplayFacultyContent/>  </div>  
          </div>
    </div>
          </>
          )}
        </div>
      </div>
    </div>
  );


}

