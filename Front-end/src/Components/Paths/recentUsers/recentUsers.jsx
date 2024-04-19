import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../../../fbconfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './recentUsers.css'

import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Sidebar } from '../Sidebar/Sidebar';
import { auth } from '../../../fbconfig';
import { useNavigate } from 'react-router-dom';


function RecentUsersPage() {
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRecentUsers();
    }, []);

    const { uid } = useParams();
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const user = auth.currentUser;
          if (!user) {
            console.error(' User not logged in. ');
            navigate('/');
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
    }, [navigate]);
  

    const handleNameClick = (user) => {
      // Perform any additional actions here
      console.log('Clicked on user:', user);
      console.log(user.uid)
      navigate(`/profileedit/${user.uid}`);
    };

  
  
  
  
    const toggleSidebar = () => {
      setIsOpen(!isOpen);
    };
  


    async function fetchRecentUsers() {
        try {
            const today = new Date();
            const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
            const recentUsersQuerySnapshot = await getDocs(
                query(collection(firestore, "users"), where("timestamp", ">=", twoDaysAgo))
            );
            const recentUsersData = recentUsersQuerySnapshot.docs.map((doc) => doc.data());
            setRecentUsers(recentUsersData);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
            console.error("Error fetching recent users:", error);
        }
    }


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
          <Sidebar
          isOpen={isOpen}
          toggle={toggleSidebar}
          role={userDetails ? userDetails.role : ''}
          userfName={userDetails ? userDetails.FirstName : ''}
          userlName={userDetails ? userDetails.LastName : ''}
          UserImage={userDetails ? userDetails.Image : ''}
        />
      
          <div className="container" style={{marginTop:'40px'}}>
              <h1 className="title">Recent Users</h1>
              <ul className="course-list">
              {userDetails && userDetails.role === 'super-admin' ? (
    // If the user is a super-admin, display all recent users
    recentUsers.map((user, index) => (
        <li key={index} className="course-item" onClick={() => handleNameClick(user)}>
            <FontAwesomeIcon icon={faUser} className="course-icon" />
            <span className="course-name">{user.FirstName} {user.LastName}</span>
            <span className="course-role">Role: {user.role}</span>
            <span className="course-schoolId">SchoolId:: {user.SchoolId}</span>
            <span className="course-id">UID: {user.uid}</span>
        </li>
    ))
) : userDetails && userDetails.role === 'admin' ? (
    // If the user is an admin, display only their faculty users
    recentUsers
        .filter(user => user.SchoolId === userDetails.SchoolId)
        .map((user, index) => (
            <li key={index} className="course-item" onClick={() => handleNameClick(user)}>
                <FontAwesomeIcon icon={faUser} className="course-icon" />
                <span className="course-name">{user.FirstName} {user.LastName}</span>
                <span className="course-role">Role: {user.role}</span>
                <span className="course-schoolId">SchoolId:: {user.SchoolId}</span>
                <span className="course-id">UID: {user.uid}</span>
            </li>
        ))
) : (
    // If userDetails or role is not available, display a placeholder or handle as needed
    <div>No recent users to display.</div>
)}

              </ul>
          </div>
        </div>
    );
}

export default RecentUsersPage;


