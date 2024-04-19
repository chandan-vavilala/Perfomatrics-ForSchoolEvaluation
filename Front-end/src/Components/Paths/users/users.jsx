import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../../../fbconfig';
import { collection, getDocs, getDoc, doc, deleteDoc, updateDoc, addDoc, setDoc, Timestamp } from 'firebase/firestore';
import { Sidebar } from '../Sidebar/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUserPlus, faXmark, faEdit } from '@fortawesome/free-solid-svg-icons';
import { getAuth, createUserWithEmailAndPassword, updateProfile, deleteUser } from "firebase/auth";
import { storage } from '../../../fbconfig';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadString, getDownloadURL, uploadBytes } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { serverTimestamp } from "firebase/firestore";
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './addUsers.scss'; 
import axios from 'axios';




export default function Users() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const navigate = useNavigate();
    const[selectedSchoolId,setSelectedSchoolId] = useState();
    const[selectedCourseIds,setSelectedCourseIds] = useState([])
    const [selectedSections, setSelectedSections] = useState([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    designation: '',
    school: '',
    image: '',
    email: '',
    password: '',
    schoolId: '',
    sectionIds: [],
    courseIds: [],
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map(doc => doc.data());
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error('User not logged in.');
          return;
        }
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserDetails(userData);
        } else {
          console.error('User details not found.');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, []);

  const handleToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const deleteUserHandler = async (uid) => {
    try {
      const userRef = doc(firestore, "users", uid);
      await deleteDoc(userRef);
      console.log(`Document with UID ${uid} deleted successfully.`);
      setUsers(users.filter(user => user.uid !== uid));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const togglePopup = () => {
    setFormData({
      firstName: '',
      lastName: '',
      role: '',
      designation: '',
      school: '',
      image: '',
      email: '',
      password: '',
      schoolId: '',
      sectionIds: [],
      courseIds: [],
    });
    setSelectedSchool('');
    setSelectedSchoolId('');
   
    setSelectedSection('');
    setSections([]);
    setCourses([]);
    setSelectedSections([]);
    setSelectedCourseIds([]);
    setIsPopupOpen(!isPopupOpen);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleArrayChange = (event) => {
    const { name, value } = event.target;
    const valuesArray = value.split(',').map(val => Number(val.trim()));
    setFormData({
      ...formData,
      [name]: valuesArray || [],
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageFile: file,
          image: '',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const enableAccount = async (userId) => {
    try {
      await updateDoc(doc(firestore, 'users', userId), {
        disabled: false
      });
      console.log('User account enabled');
      setUsers(users.map(user => {
        if (user.uid === userId) {
          return { ...user, disabled: false };
        }
        return user;
      }));
    } catch (error) {
      console.error('Error enabling user account:', error);
    }
  };

  const disableAccount = async (userId) => {
    try {
      await updateDoc(doc(firestore, 'users', userId), {
        disabled: true
      });
      console.log('User account disabled');
      setUsers(users.map(user => {
        if (user.uid === userId) {
          return { ...user, disabled: true };
        }
        return user;
      }));
    } catch (error) {
      console.error('Error disabling user account:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.designation ||
      !formData.role ||
      !formData.email ||
      !formData.password
      // !formData.school ||
      // !formData.schoolId
    ) {
      document.getElementById("errorMessage").innerText = "Please fill in all fields";
      return;
    }
  
    document.getElementById("errorMessage").innerText = " ";

    try {
      let downloadURL = formData.image;

      if (formData.imageFile) {
        const fileName = `${formData.lastName}.jpeg`;
        const storageRef = ref(storage, `Profile Pictures/${formData.school}/${fileName}`);
        const metadata = {
          contentType: 'image/jpeg'
        };

        const uploadTaskSnapshot = await uploadBytes(storageRef, formData.imageFile, metadata);
        console.log('Uploaded');


        downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
      }

      const authResult = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const { user } = authResult;
      await setDoc(doc(firestore, 'users', user.uid), {
        uid: user.uid,
        Email: formData.email,
        FirstName: formData.firstName,
        LastName: formData.lastName,
        role: formData.role,
        Designation: formData.designation,
        School: formData.school,
        SchoolId: formData.schoolId,
        Image: downloadURL || "https://firebasestorage.googleapis.com/v0/b/nwmsu-assessmentviewer.appspot.com/o/Profile%20Pictures%2Fdefault.jpeg?alt=media&token=5866e39e-5f8b-4960-b9cb-1320e268ca0c" ,
        timestamp: serverTimestamp(),
        CourseIds: formData.courseIds,
        SectionIds: formData.sectionIds,
      });
      console.log('User created and data saved:', user);
      setFormData({
        firstName: '',
        lastName: '',
        role: '',
        designation: '',
        school: '',
        image: '',
        email: '',
        password: '',
        sectionIds: [],
        courseIds: []
      });
      togglePopup();
    } catch (error) {
      console.error('Error creating user and saving data:', error);
    }
  };





  const handleNameClick = (user) => {
    console.log('Clicked on user:', user);
    console.log(user.uid)
    navigate(`/profileedit/${user.uid}`);
  };

  const filteredUsers = users.filter(user => {
    return ((user.FirstName ?? '').toLowerCase().includes(filter.toLowerCase()) ||
      (user.LastName ?? '').toLowerCase().includes(filter.toLowerCase()) ||
      (user.role ?? '').toLowerCase().includes(filter.toLowerCase()) ||
      (user.Designation ?? '').toLowerCase().includes(filter.toLowerCase()) ||
      (user.Department ?? '').toLowerCase().includes(filter.toLowerCase()) ||
      (user.School ?? '').toLowerCase().includes(filter.toLowerCase())) &&
      (user.role === 'faculty' && user.SchoolId === userDetails?.SchoolId || userDetails?.role === 'super-admin');
  });

  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get('http://localhost:5000/schools1');
        setSchools(response.data.schools);
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };

    fetchSchools();
  }, []);


  const fetchCourses = async (schoolId) => {
    try {
      const response = await axios.post('http://localhost:5000/courses1', { school: schoolId });
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchSections = async (schoolId, courseIds) => {
    try {
      const response = await axios.post('http://localhost:5000/sectionsArray1', { school: schoolId, courses: courseIds });
      setSections(response.data.sections);
      console.log({sections});
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };
  
  
  
  const handleSchoolChange = (event) => {
    const selectedSchoolId = event.target.value;
    const selectedSchool = schools.find(school => school._id === Number(selectedSchoolId))
    console.log("Selected school:", selectedSchoolId, selectedSchool);
    console.log(schools)
    console.log("Selected School ID:", selectedSchoolId);
    schools.forEach(school => console.log("School ID:", school._id));

    // Update the selected school ID and name
    setSelectedSchoolId(Number(selectedSchoolId));
  
    // Update the formData with selected school ID and name, clearing courseIds and sectionIds
    setFormData({
      ...formData,
      schoolId: selectedSchoolId ? parseInt(selectedSchoolId) : '', 
      school: selectedSchool.name ,
      courseIds: [], // Clear courseIds
      sectionIds: [] // Clear sectionIds
    });
  
    // Fetch courses for the selected school
    fetchCourses(parseInt(selectedSchoolId.split('-')[0], 10));
  
    // Reset other related state variables
    setSelectedCourse('');
    setSelectedSection('');
    setSections([]);
    setCourses([]);
    setSelectedSections([]);
    setSelectedCourseIds([]);
  };
  



 
  const handleCourseChange = async (event, courseId) => {
    const isChecked = event.target.checked;
    let updatedCourseIds;
  
    // Toggle the selection of the course
    if (isChecked) {
      // If the course is not already selected, add it to the selectedCourseIds array
      updatedCourseIds = [...selectedCourseIds, courseId];
    } else {
      // If the course is already selected, remove it from the selectedCourseIds array
      updatedCourseIds = selectedCourseIds.filter(id => id !== courseId);
    }
  
    // Update the selectedCourseIds state
    setSelectedCourseIds(updatedCourseIds);
  
    // Use the updated state value of selectedCourseIds to update formData
    setFormData((prevFormData) => ({
      ...prevFormData,
      courseIds: isChecked
        ? [...prevFormData.courseIds, courseId]
        : prevFormData.courseIds.filter(id => id !== courseId),
    }));
  
    // Fetch sections only for the updated selected courses
    await fetchSections(parseInt(selectedSchool.split('-')[0], 10), updatedCourseIds);
  };
  
  



  

  const handleSectionChange = (event, sectionId) => {
    const isChecked = event.target.checked;
    console.log('Previous FormData:', formData);
    console.log('Selected Section ID:', sectionId);
    console.log('Is Checked:', isChecked);
  
    setFormData((prevFormData) => {
      if (isChecked) {
        // If the section is checked and not already in the formData, add it
        if (!prevFormData.sectionIds.includes(sectionId)) {
          const updatedSectionIds = [...prevFormData.sectionIds, sectionId];
          console.log('Updated FormData (Section Added):', { ...prevFormData, sectionIds: updatedSectionIds });
          return { ...prevFormData, sectionIds: updatedSectionIds };
        }
      } else {
        // If the section is unchecked, remove it from the formData
        const updatedSectionIds = prevFormData.sectionIds.filter(id => id !== sectionId);
        console.log('Updated FormData (Section Removed):', { ...prevFormData, sectionIds: updatedSectionIds });
        return { ...prevFormData, sectionIds: updatedSectionIds };
      }
  
      // If no changes are made, return the previous state
      return prevFormData;
    });
  };
  
  
  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }} className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'} flex-grow p-10`}>
      <Sidebar isOpen={isSidebarOpen} toggle={handleToggle} role={userDetails ? userDetails.role : ''} userfName={userDetails ? userDetails.FirstName : ''} userlName={userDetails ? userDetails.LastName : ''} UserImage={userDetails ? userDetails.Image : 'https://firebasestorage.googleapis.com/v0/b/nwmsu-assessmentviewer.appspot.com/o/Profile%20Pictures%2Fdefault.jpeg?alt=media&token=5866e39e-5f8b-4960-b9cb-1320e268ca0c'} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <div className='divheader' >
          <input
            type="text"
            placeholder="Search..."
            value={filter}
            onChange={handleFilterChange}
            className='searchbar'
            style={{ padding: '8px', marginRight: '10px', marginLeft: '0px' }}
          />
          <button className='addUserBtn' onClick={() => setFilter('')} style={{ padding: '8px',backgroundColor:'lightgray' }}>Clear</button>
          {userDetails && (userDetails.role === 'super-admin' || userDetails.role === 'admin') && (
            <button className='addUserBtn' onClick={togglePopup}>
              <FontAwesomeIcon icon={faUserPlus} size="lg" /> Add new User
            </button>
          )}
        </div>

        <div className={`popup ${isPopupOpen ? 'open' : 'closed'}`}>
          <div className="popup-content">
            <button className='close-btn' onClick={togglePopup}><FontAwesomeIcon icon={faXmark} size='xl' />  Close    </button>
            <h2>Add New User</h2>
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-group">
                <label htmlFor="">
                  <h3>Profile Picture</h3>  
                  {formData.imageFile ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={URL.createObjectURL(formData.imageFile)}
                        alt="Preview"
                        style={{ width: '200px', height: '200px', borderRadius: '70px', cursor: 'pointer' }}
                      />
                      <div style={{ position: 'absolute', bottom: '5px', right: '5px' }}>
                        <FontAwesomeIcon icon={faEdit} style={{ color: 'white', backgroundColor: 'black', borderRadius: '50%', padding: '5px', cursor: 'pointer' }} onClick={() => document.getElementById('image').click()} />
                      </div>
                    </div>
                  ) : (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={formData.image || "https://firebasestorage.googleapis.com/v0/b/nwmsu-assessmentviewer.appspot.com/o/Profile%20Pictures%2Fdefault.jpeg?alt=media&token=5866e39e-5f8b-4960-b9cb-1320e268ca0c"}
                        alt="Profile Picture"
                        style={{ width: '100px', height: '100px', borderRadius: '70px', cursor: 'pointer' }}
                      />
                      <div style={{ position: 'absolute', bottom: '1px', right: '1px' }}>
                        <FontAwesomeIcon icon={faEdit} style={{ color: 'white', backgroundColor: 'black', borderRadius: '50%', padding: '5px', cursor: 'pointer' }} onClick={() => document.getElementById('image').click()} />
                      </div>
                    </div>
                  )}
                </label>
                <input type="file" id="image" name="image" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
              </div>

              <div className="form-group">
                <div className="input-group">
                  <label htmlFor="firstName">First Name:</label>
                  <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label htmlFor="lastName">Last Name:</label>
                  <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <div className="input-group">
                  <label htmlFor="email">Email:</label>
                  <input type="text" id="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label htmlFor="password">Password:</label>
                  <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="role">Role:</label>
                <select id="role" name="role" value={formData.role} onChange={handleChange}>
                  {userDetails && userDetails.role === 'super-admin' && (
                    <>
                      <option value="">Select Role</option>
                      <option value="super-admin">Super Admin</option>
                      <option value="admin">Admin</option>
                      <option value="faculty">Faculty</option>
                    </>
                  )}
                  {userDetails && userDetails.role === 'admin' && (
                    <>
                    <option value="">Select Role</option>
                    <option value="faculty">Faculty</option>
                    </>
                  )}
                </select>
              </div>
              

              <div className="form-group">

                <label htmlFor="designation">Designation:</label>
                <select id="designation" name="designation" value={formData.designation} onChange={handleChange}>
                  <option value="">Select Designation</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Professor">Professor</option>
                  <option value="Developer">Developer</option>
                </select>
              </div>
              {
                  formData.role !== 'super-admin' ? (
                    <>
                 
                      <div className='form-group'>
                        <label htmlFor="school">School Data</label>
                        <div className='select-wrapper'>
                          <select id='school' onChange={handleSchoolChange} value={selectedSchool.name}>
                            {userDetails && userDetails.role === 'super-admin' ? (
                              <>
                                <option value="">Select School</option>
                                {schools.sort((a, b) => a.name.localeCompare(b.name)).map((school) => (
                                  <option key={school._id} value={Number(school._id)}>
                                    {school._id}-{school.name}
                                  </option>
                                ))}
                              </>
                            ) : (
                              <>
                                <option value="">Select School</option>
                                <option value={Number(userDetails && userDetails.SchoolId)}>{userDetails && userDetails.SchoolId}-{userDetails && userDetails.School}</option>
                              </>
                            )}
                          </select>
                        </div>

                              
                        {formData.role !== 'admin' && (
                          <>
                            <div className='form-group-1' style={{borderTopRightRadius:'0px',borderTopLeftRadius:'0px'}}>
                              <label>Courses</label>
                              {courses.map((course, index) => (
                                <div key={index} className="checkbox-option">
                                  <input
                                    type="checkbox"
                                    id={`courseCheckbox${index}`}
                                    value={course._id}
                                    checked={selectedCourseIds.includes(course._id)}
                                    onChange={(e) => handleCourseChange(e, course._id)}
                                  />
                                  <label htmlFor={`courseCheckbox${index}`}>{course._id}-{course.name}</label>
                                </div>
                              ))}
                            </div>

                            <div className='form-group-1' style={{borderTopRightRadius:'0px',borderTopLeftRadius:'0px', justifyItems:'center'}}>
                              <label>Sections</label>
                              {sections.map((section) => (
                                <div key={section._id} className="checkbox-option">
                                  <input
                                    type="checkbox"
                                    id={`sectionCheckbox${section._id}`} // Unique ID for each checkbox
                                    value={section._id}
                                    checked={formData.sectionIds.includes(section._id)}
                                    onChange={(event) => handleSectionChange(event, section._id)} // Pass section ID to the event handler 
                                  />
                                  <label htmlFor={`sectionCheckbox${section._id}`}>{section.name}</label>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      { /* If user is super-admin, set formData.school to "Learning and Teaching Center" */ }
                      { formData.school = "Learning and Teaching Center" }
                    </>
                  )
                }



              <div className="form-group" style={{height:'60px'}}>
                <button type="submit" className="btn-submit">Submit</button>
                {/* <button type="button" className="btn-cancel" onClick={togglePopup}>Cancel</button> */}
                <p id="errorMessage" style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}></p>
              </div>
            </form>
          </div>
        </div>


        <table className="styled-table" style={{marginTop:'100px',marginLeft:'40px',marginRight:'40px',maxWidth:'90%',alignSelf:'center'}}>
          <thead style={{borderRadius:'50%'}}>
            <tr style={{height : '60px'}}>
              <th>Profile Picture</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Designation</th>
              <th>Department/School</th>
              <th>View</th>
              <th>Enable/Disable</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.uid} className='user-row'>
                <td><img src={user.Image || "https://firebasestorage.googleapis.com/v0/b/nwmsu-assessmentviewer.appspot.com/o/Profile%20Pictures%2Fdefault.jpeg?alt=media&token=5866e39e-5f8b-4960-b9cb-1320e268ca0c"} onClick={() => handleNameClick(user)} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50px' }} /></td>
                <td>{user.FirstName}</td>
                <td>{user.LastName}</td>
                <td>{user.Email}</td>
                <td>{user.role}</td>
                <td>{user.Designation}</td>
                <td>{user.School}</td>

                <td> <button className='view-btn' onClick={() => handleNameClick(user)}  style={{borderRadius:'30%',backgroundColor:'gray',textAlign:'center'}}> <FontAwesomeIcon icon={faUser} size="lg" /> </button> </td>

                <td style={{textAlign:'center'}}>
                      {user.disabled ? (
                        <button onClick={() => enableAccount(user.uid)} className='enable-btn' style={{backgroundColor:'blue'}}>Enable</button>
                      ) : (
                        <button onClick={() => disableAccount(user.uid)} className='disable-btn' style={{backgroundColor:'orange'}}>Disable</button>
                      )
                  }
                </td>

                <td style={{textAlign:'center'}}>  <button className='delete-btn' onClick={() => deleteUserHandler(user.uid)}><FontAwesomeIcon icon={faTrash} size="lg" /></button> </td> 
                   
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
}

