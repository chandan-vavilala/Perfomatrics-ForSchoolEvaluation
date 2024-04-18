import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';
import { Sidebar } from '../Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../../../fbconfig';
import { doc, getDoc } from 'firebase/firestore';
import '../settings/settings.css';

const SettingsPage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [settings, setSettings] = useState({
    setting1: false,
    setting2: false,
    setting3: false,
    setting4: false,
  });
  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const navigate = useNavigate();

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

  const handleToggle = (setting) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [setting]: !prevSettings[setting],
    }));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You can also store the dark mode preference in local storage for persistence
    localStorage.setItem('darkMode', !darkMode);
  };

  useEffect(() => {
    // Check local storage for dark mode preference on component mount
    const isDarkModeEnabled = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkModeEnabled);
  }, []);

  return (
    <div
      style={{ display: 'flex' }}
      className={`main-content ${
        isOpen ? 'sidebar-open' : 'sidebar-closed'
      } flex-grow p-10 ${darkMode ? 'dark-mode' : ''}`}
    >
      <Sidebar
        isOpen={isOpen}
        toggle={toggleSidebar}
        role={userDetails ? userDetails.role : ''}
        userfName={userDetails ? userDetails.FirstName : ''}
        userlName={userDetails ? userDetails.LastName : ''}
        UserImage={
          userDetails
            ? userDetails.Image
            : 'https://firebasestorage.googleapis.com/v0/b/nwmsu-assessmentviewer.appspot.com/o/Profile%20Pictures%2Fdefault.jpeg?alt=media&token=5866e39e-5f8b-4960-b9cb-1320e268ca0c'
        }
      />
      <div style={{ flex: 1, marginLeft: '50px', padding: '20px' }}>
        <h1>Settings</h1>
        <table style={{ width: '80%' }}>
          <tbody>
            <tr>
              <td>Push Notification:</td>
              <td>
                <Switch
                  checked={settings.setting1}
                  onChange={() => handleToggle('setting1')}
                />
              </td>
            </tr>
            <tr>
              <td>Email Notifications:</td>
              <td>
                <Switch
                  checked={settings.setting2}
                  onChange={() => handleToggle('setting2')}
                />
              </td>
            </tr>
            <tr>
              <td>Dark Theme:</td>
              <td>
                <Switch
                  checked={darkMode}
                  onChange={toggleDarkMode}
                />
              </td>
            </tr>
            <tr>
              <td>Authentication:</td>
              <td>
                <Switch
                  checked={settings.setting4}
                  onChange={() => handleToggle('setting4')}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettingsPage;
