import React from 'react';
import { auth, firestore } from './fbconfig.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import Admin from './Components/Dashboards/Admin.jsx'
import Faculty from './Components/Dashboards/faculty.jsx'
import SuperAdmin from './Components/Dashboards/Superadmin.jsx'
import Index from './Components/Login/Index.jsx'
import Profile from './Components/Paths/profile/profile.jsx'
import Fileupload from './Components/Paths/fileUpload/fileupload.jsx';
import Settings from './Components/Paths/settings/settings.jsx'
import Users from './Components/Paths/users/users.jsx'
import Schools from './Components/Paths/schools.jsx'
import './Components/Login/authenticate.json'
import PrivateRoutes from './Components/Login/privateRoutes.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfileEditPage from './Components/Paths/profileEdit/profileedit.jsx';
import UniqueCourses from './Components/Paths/uniqueCourses/uniqueCourses.jsx';
import UniqueAssessments from './Components/Paths/uniqueAssessments/uniqueAssessments.jsx';
import RecentUsers from './Components/Paths/recentUsers/recentUsers.jsx'

// import Assessment from './Components/Paths/Assessment.jsx'; 
// import 'bootstrap/dist/css/bootstrap.min.css';
import { doc, getDoc } from 'firebase/firestore';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Assessment from '../../Back-end/model.js';


function App() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docSnap = await getDoc(doc(firestore, 'users', user.uid));
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.error('User data not found.');
        }
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Index />} path="/" />
          {/* <Route element = {<DisplayData/>} path = "/DisplayData" /> */}
          {/* <Route element={<Admin />} path="/admin" />
          <Route element={<SideBar />} path="/sidebar" />
          <Route element={<SuperAdmin />} path="/super-admin" /> */}
          {userData && (
            <Route
              path="/faculty"
              element={
                <PrivateRoutes
                  allowedRoles={['admin', 'faculty', 'super-admin']}
                  user={userData}
                >
                  <Faculty />
                </PrivateRoutes>
              }
            />
          )}
          {userData && (
            <Route
              path="/admin"
              element={
                <PrivateRoutes
                  allowedRoles={['admin', 'super-admin']}
                  user={userData}
                >
                  <Admin />
                </PrivateRoutes>
              }
            />
          )}
          {userData && (
            <Route
              path="/superadmin"
              element={
                <PrivateRoutes
                  allowedRoles={['super-admin']}
                  user={userData}
                >
                  <SuperAdmin/>
                </PrivateRoutes>
              }
            />
          )}
          {userData && (
            <Route
              path="/fileupload"
              element={
                <PrivateRoutes
                  allowedRoles={['super-admin']}
                  user={userData}
                >
                  <Fileupload/>
                </PrivateRoutes>
              }
            />
          )}
          {userData && (
            <Route
              path="/profile"
              element={
                <PrivateRoutes
                  allowedRoles={['super-admin','admin','faculty']}
                  user={userData}
                >
                  <Profile/>
                </PrivateRoutes>
              }
            />
          )}
           {userData && (
            <Route
              path="/settings"
              element={
                <PrivateRoutes
                  allowedRoles={['super-admin','admin','faculty']}
                  user={userData}
                >
                  <Settings/>
                </PrivateRoutes>
              }
            />
          )}
          {userData && (
            <Route
              path="/users"
              element={
                <PrivateRoutes
                  allowedRoles={['super-admin','admin']}
                  user={userData}
                >
                  <Users/>
                </PrivateRoutes>
              }
            />
          )}
          {userData && (
            <Route
              path="/schools"
              element={
                <PrivateRoutes
                  allowedRoles={['super-admin','admin','faculty']}
                  user={userData}
                >
                  <Schools/>
                </PrivateRoutes>
              }
            />
          )}
          {userData && (
            <Route
              path="/profileedit/:uid"
              element={
                <PrivateRoutes
                  allowedRoles={['super-admin','admin']}
                  user={userData}
                >
                  <ProfileEditPage/>
                </PrivateRoutes>
              }
            />
          )}
          {userData && (
            <Route
              path="/uniqueCourses"
              element={
                <PrivateRoutes
                  allowedRoles={['super-admin']}
                  user={userData}
                >
                  <UniqueCourses/>
                </PrivateRoutes>
              }
            />
          )}
          {userData && (
            <Route
              path="/uniqueAssessments"
              element={
                <PrivateRoutes
                  allowedRoles={['super-admin']}
                  user={userData}
                >
                  <UniqueAssessments/>
                </PrivateRoutes>
              }
            />
          )}
           {userData && (
            <Route
              path="/recentUsers"
              element={
                <PrivateRoutes
                  allowedRoles={['super-admin','admin']}
                  user={userData}
                >
                  <RecentUsers/>
                </PrivateRoutes>
              }
            />
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;