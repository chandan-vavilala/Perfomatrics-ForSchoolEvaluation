import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../../../fbconfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons'; 
import { Link, useNavigate, useParams } from 'react-router-dom';
import {Sidebar} from '../Sidebar/Sidebar';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

import { storage } from '../../../fbconfig';

export default function ProfilePage() {
  const [userRole, setUserRole] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error('User not logged in.');
          navigate('/');
          return;
        }
  
        const docSnap = await getDoc(doc(firestore, 'users', user.uid));
  
        if (docSnap.exists()) {
          setUser(docSnap.data());
          setUserDetails(docSnap.data());
          setUserRole(docSnap.data().role); 
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


  const handleEditImage = async () => {
    try {
      // Fetch the current user
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('User not logged in.');
        navigate('/');
        return;
      }
      
      // Fetch the UID of the current user
      const uid = currentUser.uid;
  
      // Open file picker dialog
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.click();
  
      // Listen for file selection
      const handleChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
  
        // Upload new image to Firebase Storage
        const fileName = `${user.LastName}.jpeg`; // Adjust the file name as needed
        const storageRef = ref(storage, `Profile Pictures/${user.School}/${fileName}`);
        const metadata = {
          contentType: 'image/jpeg',
        };
        await uploadBytes(storageRef, file, metadata);
  
        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);
  
        console.log("Image Uploaded and link retrieved.");
  
        // Update the Image field in Firestore with the new image URL
        if (uid) {
          const userRef = doc(firestore, 'users', uid); // Updated reference to 'users'
          await updateDoc(userRef, {
            Image: downloadURL,
          });
  
          console.log("Image uploaded successfully.");
  
          // Update local state with the new image URL
          setUserDetails({ ...userDetails, Image: downloadURL }); // Update userDetails state
        } else {
          console.error('User ID (uid) is undefined.');
        }
  
        // Remove the event listener after handling the file change
        fileInput.removeEventListener('change', handleChange);
      };
  
      fileInput.addEventListener('change', handleChange);
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };
  
  

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUserDetails(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };





const changePassword = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user)
    if (!user) {
      console.error('No user authenticated.');
      return;
    }

    // Reauthenticate the user
    const email = prompt('Enter your email:');
    const password = prompt('Enter your current password:');
    if (!email || !password) {
      console.error('Email or password not provided.');
      return;
    }

    const credential = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(user, credential);
    console.log('User reauthenticated successfully.');

    // Prompt the user for a new password
    const newPassword = prompt('Enter your new password:');
    if (!newPassword) {
      console.error('No new password provided.');
      return;
    }

    // Update the password
    await updatePassword(user, newPassword);
    alert("Password updated successfully.");
    console.log("Password updated successfully.");
  } catch (error) {
    console.error('Error updating password:', error.message);
    alert("Error updating password. Please try again.");
  }
};


  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar isOpen={isOpen} toggle={toggleSidebar} role={userDetails ? userDetails.role : ''} userfName={userDetails ? userDetails.FirstName : ''} userlName={userDetails ? userDetails.LastName : ''} UserImage ={userDetails ? userDetails.Image : ''} />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: "linear-gradient(to bottom right, #196b3b, #00ef8b)",
        }}
      >
        <div
          style={{
            width: '100%',  
            maxWidth: '500px',
            height: 'auto',
            backgroundColor: 'lightgray',
            padding: '20px',
            borderRadius: '20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            alignItems: 'center',
            justifyContent: 'center',
            border: '#b3d5ff 5px solid',
            background: "linear-gradient(to bottom right, #196b3b, #00ef8b)",
            alignItems:'auto',
          }}
        >
          <div style={{ flex: 0.4 }}>
            <div style={{ textAlign: 'center', marginTop: '10px'}}>
              {userDetails ? (
                <>
                  <div style={{ position: 'relative', marginBottom:'20px' }}>
                    <button
                      style={{
                        position: 'absolute',
                        bottom: '0px',
                        right: '10px',
                        zIndex: '999',
                        padding: '5px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        color: 'white',
                        border: 'none',
                        marginBottom:'-5px',
                        marginRight:'0px',
                        backgroundColor:"red",
                      }}
                      onClick={() => handleEditImage()}
                    >
                      <FontAwesomeIcon icon={faEdit} className='editButton' style={{color:'white',height:'25px'}}/>
                    </button>
                    <img
                      src={userDetails.Image}
                      alt="User"
                      style={{
                        borderRadius: '50%',
                        width: '150px',
                        height: '150px',
                        marginTop: '-100px',
                        border: '5px solid white',
                      }}
                    />
                  </div>
                  <h2 style={{ color: 'white' }}>{userDetails.FirstName} {userDetails.LastName}</h2>
                  <h5 style={{ color: 'white' }}>{userDetails.Designation}</h5>
                  <p style={{ color: 'white' }}>{userDetails.Email}</p>
                  <p style={{ color: 'white' }}>{userDetails.School}</p>
                  <button onClick={handleLogout} className="logout-button">
                    <Link to="/" className="logout-link">Logout</Link>
                  </button>
                  <button onClick={changePassword} className='logout-button' style={{marginLeft:'10px'}}>Change Password</button>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
