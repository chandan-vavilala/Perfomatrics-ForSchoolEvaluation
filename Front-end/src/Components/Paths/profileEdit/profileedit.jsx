import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../../../fbconfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Sidebar } from '../Sidebar/Sidebar';
import { auth } from '../../../fbconfig';
import { useNavigate } from 'react-router-dom';
import { faEdit, faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAuth, updateEmail } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../fbconfig';
import './profileedit.css';
import axios from 'axios';

const ProfileEditPage = () => {
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

  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const[selectedSchoolId,setSelectedSchoolId] = useState();
  const[selectedCourseIds,setSelectedCourseIds] = useState([])
  const [selectedSections, setSelectedSections] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(firestore, 'users', uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUser(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [uid]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

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

  const handleEdit = async (field, value) => {
    try {
      let parsedValue = value;
      if (field === 'SectionIds' || field === 'CourseIds') {
        // Split the input value by commas and convert each part to a number
        parsedValue = value.split(',').map(num => Number(num.trim()));
      }
      if (field === 'SchoolId'){
        parsedValue = Number(value)
      }
      const userRef = doc(firestore, 'users', uid);
      await updateDoc(userRef, {
        [field]: parsedValue
      });
      setUser({ ...user, [field]: parsedValue });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleEditImage = async () =>{
    try {
      // Open file picker dialog
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.click();
  
      // Listen for file selection
      fileInput.addEventListener('change', async (event) => {
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
  
        // Update the Image field in Firestore with the new image URL
        const userRef = doc(firestore, 'users', uid);
        await updateDoc(userRef, {
          Image: downloadURL,
        });
  
        // Update local state with the new image URL
        setUser({ ...user, Image: downloadURL });
      });
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };
  
  const fetchSections = async (schoolId, courseIds) => {
    try {
      const response = await axios.post('http://localhost:5000/sectionsArray1', { school: schoolId, courses: courseIds });
      setSections(response.data.sections);
      console.log({sections});
      return response.data.sections; // Return the sections data
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleSchoolChange = (event) => {
    const selectedSchoolId = event.target.value;
    const selectedSchool = schools.find(school => school._id === Number(selectedSchoolId));
  
    setSelectedSchoolId(Number(selectedSchoolId));
  
    setFormData({
      ...formData,
      schoolId: selectedSchoolId ? parseInt(selectedSchoolId) : '', 
      school: selectedSchool.name,
      courseIds: [],
      sectionIds: []
    });
  
    // Fetch courses for the selected school
    fetchCourses(parseInt(selectedSchoolId.split('-')[0], 10))
      .then(() => {
        setSelectedCourseIds(userDetails.courseIds || []);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });
    
    // Fetch sections for the selected school
    fetchSections(selectedSchoolId, userDetails.courseIds || [])
      .then(() => {
        setSelectedSections(userDetails.sectionIds || []);
      })
      .catch(error => {
        console.error('Error fetching sections:', error);
      });
    
    setSelectedCourse('');
    setSelectedSection('');
  };
  
  const fetchCourses = async (schoolId) => {
    try {
      const response = await axios.post('http://localhost:5000/courses1', { school: schoolId });
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCourseChange = async (event, courseId) => {
    const isChecked = event.target.checked;
  
    let updatedCourseIds;
    if (isChecked) {
      updatedCourseIds = [...selectedCourseIds, courseId];
    } else {
      updatedCourseIds = selectedCourseIds.filter(id => id !== courseId);
    }
  
    setSelectedCourseIds(updatedCourseIds);
  
    // Clear selected sections when a course is selected or deselected
    setSelectedSections([]);
  
    fetchSections(selectedSchoolId, updatedCourseIds)
      .then((sectionsData) => {
        const sectionIds = sectionsData.map(section => section._id);
        // setSelectedSections(sectionIds);
      })
      .catch(error => {
        console.error('Error fetching sections:', error);
      });
  
    user.CourseIds = updatedCourseIds;
  };
  

  const handleSectionChange = (event, sectionId) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      if (!selectedSections.includes(sectionId)) {
        setSelectedSections([...selectedSections, sectionId]);
      }
    } else {
      setSelectedSections(selectedSections.filter(id => id !== sectionId));
    }

    setFormData({
      ...formData,
      sectionIds: selectedSections,
    });
  };

  const editchangescoursesandschools = async (uid, selectedSchoolId, courseIds, sectionIds) => {
    try {
      console.log(selectedSchoolId)
      const selectedSchool = schools.find(school => school._id === Number(selectedSchoolId))

      console.log(selectedSchool.name)

      const userRef = doc(firestore, 'users', uid);
      await updateDoc(userRef, {
        School: selectedSchool.name,
        SchoolId: Number(selectedSchool._id),
        CourseIds: courseIds,
        SectionIds: sectionIds,
      });
      console.log('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  if (!user || !userDetails) {
    return <div>Loading...</div>;
  }
    
  
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        isOpen={isOpen}
        toggle={toggleSidebar}
        role={userDetails ? userDetails.role : ''}
        userfName={userDetails ? userDetails.FirstName : ''}
        userlName={userDetails ? userDetails.LastName : ''}
        UserImage={userDetails ? userDetails.Image : ''}
      />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: '',
        //   margin: '-10px -10px -10px 50px',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft:'0px',
          backgroundColor: 'gray',
          backgroundSize: 'cover',
          backgroundAttachment: '',
          color:'white',
          background: "linear-gradient(to bottom right, #196b3b, #00ef8b)",
        }}
      >

        <div
          style={{
            width: '700px',
            height: '700px',
            backgroundColor: 'lightgray',
            padding: '20px',
            borderRadius: '80px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            border:'5px solid white',
            justifySelf:'center',
            marginLeft:'100px',
            background: "linear-gradient(to bottom right, #196b3b, #00ef8b)",
          }}
        >
          
          <div style={{ position: 'relative', marginRight: '20px' }}>
            <button
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                zIndex: '999',
                padding: '10px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                color: 'white',
                border: 'none',
                marginBottom:'-5px',
                marginRight:'250px',  
               
              }}
              onClick={() => handleEditImage()}
            >
              <FontAwesomeIcon icon={faEdit} className='editButton' />
            </button>
            <img
              src={user.Image || "https://firebasestorage.googleapis.com/v0/b/nwmsu-assessmentviewer.appspot.com/o/Profile%20Pictures%2Fdefault.jpeg?alt=media&token=5866e39e-5f8b-4960-b9cb-1320e268ca0c"}
              alt="User"
              style={{
                borderRadius: '50%',
                height: '300px',
                width: '300px',
                marginTop: '0px',
                marginLeft: '-170px',
                border: '5px solid white',
              }}
            />
          </div>

          <div style={{ flex: 1, overflowY: 'auto',marginTop:'60px' }}>
            <p>Email : {user.Email} ( {user.role} )</p>
            <EditableLabel label="First Name" value={user.FirstName} onEdit={(value) => handleEdit('FirstName', value)} />
            <EditableLabel label="Last Name" value={user.LastName} onEdit={(value) => handleEdit('LastName', value)} />
            <EditableLabel label="Designation" value={user.Designation} onEdit={(value) => handleEdit('Designation', value)} />
          
              
            <div className=''>
              <label htmlFor="school">School Data</label>
              <div className='select-wrapper'>
                <select
                  id='school'
                  onChange={handleSchoolChange}
                  value={selectedSchool.name}
                  disabled={!isEditing}
                >
                  {userDetails && userDetails.role === 'super-admin' ? (
                   <>
                    <option value="">{user.SchoolId}-{user.School}</option> 
                    
                    {schools.sort((a, b) => a.name.localeCompare(b.name)).map((school) => (
                      <option key={school._id} value={Number(school._id)}>
                        {school._id}-{school.name}
                      </option>
                    ))}
                  </>
                  ):(
                    <option value={Number(user.SchoolId)}>{user.SchoolId}-{user.School}</option> 
                  )}
                </select>
              </div>
            </div>


            <div className='' style={{margin:'10px'}}>
              <div className='select-wrapper' style={{ height: '80px', width: '450px', overflowY: 'auto' }}>
                <label>Courses Enrolled: </label>
                {isEditing && selectedSchoolId ? (
                  // Render courses based on selected school when editing is enabled and a school is selected
                  courses.map((course, index) => (
                    <div key={index} className="checkbox-option">
                      <input
                        type="checkbox"
                        id={`courseCheckbox${index}`}
                        value={course._id}
                        checked={selectedCourseIds.includes(course._id)}
                        onChange={(e) => handleCourseChange(e, course._id)}
                        disabled={!isEditing}
                      />
                      <label htmlFor={`courseCheckbox${index}`}>{course._id}-{course.name}</label>
                    </div>
                  ))
                ) : (
                  // Render courses assigned to the user when not editing or no school is selected
                  user.CourseIds && user.CourseIds.map((courseId, index) => (
                    <div key={index} className="lister">

                      <label htmlFor={`courseCheckbox${index}`}>{courseId}</label>
                    </div>
                  ))  
                )}
              </div>
            </div>

            <div className='' style={{margin:'10px', justifyItems: 'center' }}>
              <div className='select-wrapper' style={{ height: '80px', width: '450px', overflowY: 'auto' }}>
              <label>Sections Enrolled: </label>
                {isEditing && selectedSchoolId ? (
                  // Render sections based on selected courses when editing is enabled and a school is selected
                  sections.map((section) => (
                    <div key={section._id} className="checkbox-option">
                      <input
                        type="checkbox"
                        id={`sectionCheckbox${section._id}`}
                        value={section._id}
                        checked={selectedSections.includes(section._id)}
                        onChange={(event) => handleSectionChange(event, section._id)}
                        disabled={!isEditing}
                      />
                      <label htmlFor={`sectionCheckbox${section._id}`}>{section.name}</label>
                    </div>
                  ))
                ) : (
                  // Render sections assigned to the user when not editing or no school is selected
                  user.SectionIds && user.SectionIds.map((sectionId, index) => (
                    <div key={sectionId} className="lister">
                      <label htmlFor={`sectionCheckbox${index}`}>{sectionId}</label>
                    </div>
                  ))
                )}
              </div>
            </div>




            <button
              style={{ height: '30px', width: '150px', backgroundColor: 'pink' }}
              onClick={async () => {
                if (isEditing) {
                  // Fetch courses and sections synchronously
                  await fetchCourses(selectedSchoolId);
                  await fetchSections(selectedSchoolId, selectedCourseIds);

                  // Update courses and sections state variables immediately
                   setCourses([...courses]);
                   setSections([...sections]);

                  // Save changes
                  editchangescoursesandschools(uid, selectedSchoolId, selectedCourseIds, selectedSections);
                }
                 setIsEditing(!isEditing);
              }}
            >
              {isEditing ? "Save" : "Edit School Data"}
            </button>
            


            <p>UID: {user.uid}</p>
          </div>
        </div>
      </div>
     </div>
  );
};

const EditableLabel = ({ label, value, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleSave = () => {
    onEdit(editedValue);
    setEditing(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'normal', marginBottom : '10px' }}>
     <div className="label-container">
        <div className="label" style={{marginLeft:'0px'}}>{label}:</div>
     </div>

      <div style={{ display: 'flex',justifyItems:'flex-start' }}>
        {editing ? (
          <>
            <input
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              style={{ marginBottom: '20px' }}
            />
            <button onClick={handleSave} style={{marginLeft:'50px', borderRadius:'5px',border:'2px solid black'}}>Save</button>
          </>
        ) : (
          <>
            <div>{value}</div>
            <button onClick={() => setEditing(true)} style={{marginLeft:'20px',borderRadius:'5px',border:'2px solid black'}}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileEditPage;
