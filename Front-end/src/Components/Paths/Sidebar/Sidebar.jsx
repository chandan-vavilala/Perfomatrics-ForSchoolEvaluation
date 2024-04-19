import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUsers, faCog, faBars, faTimes, faFileUpload, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import "../../Cascade Styling/superadmin.css";
import "./Sidebar.css";


const Sidebar = ({ isOpen, toggle, role, userfName, userlName, UserImage }) => {
  const location = useLocation();

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'close'}`}>
      <div className="toggle-icon" onClick={toggle}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </div>
      {isOpen && (
        <div className="menu-list">
          <ul>
            {/* Render the sidebar items based on the user's role */}
            {role === 'super-admin' && (
              <>
                <Link to="/profile" className={`link ${location.pathname === '/profile' ? 'active' : ''}`}>
                  <li className="p-4 hover:bg-gray-500">
                    <div className="menu-item">
                      <img
                        src={UserImage}
                        className="user-image mr-2"
                        alt="User"
                        style={{ width: '5em', height: '5em', borderRadius: '50%', backgroundColor: 'white'}}
                      />
                      <span style={{ color: 'white',maxWidth:'80px' }}>{userfName} {userlName}</span>
                    </div>
                  </li>
                </Link>
                <Link to="/superadmin" className={`link ${location.pathname === '/superadmin' ? 'active' : ''}`}>
                  <li className="p-4 hover:bg-gray-500">
                    <div className="menu-item">
                      <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" size="2x" style={{ color: 'white' }} />
                      <span style={{ color: 'white' }}>Dashboard</span>
                    </div>
                  </li>
                </Link>
                {/* Add more sidebar items based on roles */}
                <Link to="/schools" className={`link ${location.pathname === '/schools' ? 'active' : ''}`}>
                  <li className="p-4 hover:bg-gray-700">
                    <div className="menu-item">
                      <FontAwesomeIcon icon={faGraduationCap} className="mr-2" size="2x" style={{ color: 'white' }} />
                      <span style={{ color: 'white' }}>Schools</span>
                    </div>
                  </li>
                </Link>
                <Link to="/users" className={`link ${location.pathname === '/users' ? 'active' : ''}`}>
                  <li className="p-4 hover:bg-gray-700">
                    <div className="menu-item">
                      <FontAwesomeIcon icon={faUsers} className="mr-2" size="2x" style={{ color: 'white' }} />
                      <span style={{ color: 'white' }}>Users</span>
                    </div>
                  </li>
                </Link>

                <Link to="/Fileupload" className={`link ${location.pathname === '/Fileupload' ? 'active' : ''}`}>
                  <li className="p-4 hover:bg-gray-700">
                    <div className="menu-item">
                      <FontAwesomeIcon icon={faFileUpload} className="mr-2" size="2x" style={{ color: 'white' }} />
                      <span style={{ color: 'white' }}>File Upload</span>
                    </div>
                  </li>
                </Link>
              </>
            )}
            {role === 'admin' && (
              <>
                <Link to="/profile" className={`link ${location.pathname === '/profile' ? 'active' : ''}`}>
                  <li className="p-4 hover:bg-gray-500">
                    <div className="menu-item">
                      <img
                        src={UserImage}
                        className="user-image mr-2"
                        alt="User"
                        style={{ width: '4em', height: '4em', borderRadius: '50%', backgroundColor: 'white'}}
                      />
                      <span style={{ color: 'white' }}>{userfName} {userlName}</span>
                    </div>
                  </li>
                </Link>
                <Link to="/admin" className={`link ${location.pathname === '/admin' ? 'active' : ''}`}>
                  <li className="p-4 hover:bg-gray-500">
                    <div className="menu-item">
                      <FontAwesomeIcon icon={faTachometerAlt} className="mr-2" size="2x" style={{ color: 'white' }} />
                      <span style={{ color: 'white' }}>Dashboard</span>
                    </div>
                  </li>
                </Link>
                {/* Add more sidebar items based on roles */}
                <Link to="/schools" className={`link ${location.pathname === '/schools' ? 'active' : ''}`}>
                  <li className="p-4 hover:bg-gray-700">
                    <div className="menu-item">
                      <FontAwesomeIcon icon={faGraduationCap} className="mr-2" size="2x" style={{ color: 'white' }} />
                      <span style={{ color: 'white' }}>Schools</span>
                    </div>
                  </li>
                </Link>
                <Link to="/users" className={`link ${location.pathname === '/users' ? 'active' : ''}`}>
                  <li className="p-4 hover:bg-gray-700">
                    <div className="menu-item">
                      <FontAwesomeIcon icon={faUsers} className="mr-2" size="2x" style={{ color: 'white' }} />
                      <span style={{ color: 'white' }}>Users</span>
                    </div>
                  </li>
                </Link>
      
              </>
            )}
            {role === 'faculty' && (
              <>
                <Link to="/profile" className={`link ${location.pathname === '/profile' ? 'active' : ''}`}>
                  <li className="p-4 hover:bg-gray-500">
                    <div className="menu-item">
                      <img
                        src={UserImage}
                        className="user-image mr-2"
                        alt="User"
                        style={{ width: '5em', height: '5em', borderRadius: '50%', backgroundColor: 'white'}}
                      />
                      <span style={{ color: 'white' }}>{userfName} {userlName}</span>
                    </div>
                  </li>
                </Link>
              

          
                <Link to="/schools" className={`link ${location.pathname === '/schools' ? 'active' : ''}`}>
                  <li className="p-4 hover:bg-gray-700">
                    <div className="menu-item">
                      <FontAwesomeIcon icon={faGraduationCap} className="mr-2" size="2x" style={{ color: 'white' }} />
                      <span style={{ color: 'white' }}>Schools</span>
                    </div>
                  </li>
                </Link>
    
              </>
            )}
          </ul>
        </div>
      )}
      {!isOpen && (
        <div className="closed-menu-icons">
          {/* Render the sidebar icons based on user role */}
          {role === 'super-admin' && (
             <>
             <div className="menu-item">
               <Link to="/profile" className={`link ${location.pathname === '/profile' ? 'active' : ''}`}>
                 <img
                   src={UserImage}
                   className="user-image mr-2"
                   alt="User"
                   style={{ width: '4em', height: '4em', borderRadius: '50%', backgroundColor: 'white', margin:'9px'}}
                 />
                 <p style={{ color: 'white', textAlign:'center',maxWidth:'80px' }}>{userfName}</p>
               </Link>
             </div>
             <div className="menu-item">
               <Link to="/superadmin" className={`link ${location.pathname === '/superadmin' ? 'active' : ''}`}>
                 <FontAwesomeIcon icon={faTachometerAlt} className="menu-icon" size="2x" style={{ color: 'white', margin:'25px' }} />
               </Link>
             </div>
             <div className="menu-item">
               <Link to="/schools" className={`link ${location.pathname === '/schools' ? 'active' : ''}`}>
                 <FontAwesomeIcon icon={faGraduationCap} className="menu-icon" size="2x" style={{ color: 'white', margin:'20px' }} />
               </Link>
             </div>
             <div className="menu-item">
               <Link to="/users" className={`link ${location.pathname === '/users' ? 'active' : ''}`}>
                 <FontAwesomeIcon icon={faUsers} className="menu-icon" size="2x" style={{ color: 'white', margin:'20px' }} />
               </Link>
             </div>

              <div className="menu-item">
                <Link to="/fileupload" className={`link ${location.pathname === '/fileupload' ? 'active' : ''}`}>
                  <FontAwesomeIcon icon={faFileUpload} className="menu-icon" size="2x" style={{ color: 'white', margin:'30px'}} />
                </Link>
              </div>
            </>
          )}

          {role === 'admin' && (
            <>
              <div className="menu-item">
                <Link to="/profile" className={`link ${location.pathname === '/profile' ? 'active' : ''}`}>
                  <img
                    src={UserImage}
                    className="user-image mr-2"
                    alt="User"
                    style={{ width: '4em', height: '4em', borderRadius: '50%', backgroundColor: 'white', margin:'9px 9px 0px 9px'}}
                  />
                  <p style={{ color: 'white', textAlign:'center' }}>{userfName}</p>
                </Link>
              </div>
              <div className="menu-item">
                <Link to="/admin" className={`link ${location.pathname === '/admin' ? 'active' : ''}`}>
                  <FontAwesomeIcon icon={faTachometerAlt} className="menu-icon" size="2x" style={{ color: 'white', margin:'25px' }} />
                </Link>
              </div>
              <div className="menu-item">
                <Link to="/schools" className={`link ${location.pathname === '/schools' ? 'active' : ''}`}>
                  <FontAwesomeIcon icon={faGraduationCap} className="menu-icon" size="2x" style={{ color: 'white', margin:'20px' }} />
                </Link>
              </div>
              <div className="menu-item">
                <Link to="/users" className={`link ${location.pathname === '/users' ? 'active' : ''}`}>
                  <FontAwesomeIcon icon={faUsers} className="menu-icon" size="2x" style={{ color: 'white', margin:'20px' }} />
                </Link>
              </div>

            </>
          )}

          {role === 'faculty' && (
            <>
            <div className="menu-item">
              <Link to="/profile" className={`link ${location.pathname === '/profile' ? 'active' : ''}`}>
                <img
                  src={UserImage} 
                  className="user-image mr-2"
                  alt="User"
                  style={{ width: '4em', height: '4em', borderRadius: '50%', backgroundColor: 'white', margin:'9px'}}
                />
               <p style={{ color: 'white', textAlign:'center' }}>{userfName}</p>
              </Link>
            </div>

            <div className="menu-item">
              <Link to="/schools" className={`link ${location.pathname === '/schools' ? 'active' : ''}`}>
                <FontAwesomeIcon icon={faGraduationCap} className="menu-icon" size="2x" style={{ color: 'white', margin:'20px' }} />
              </Link>
            </div>
 
          </>
          )}

        </div>
      )}
    </div>
  );
};

export { Sidebar };

