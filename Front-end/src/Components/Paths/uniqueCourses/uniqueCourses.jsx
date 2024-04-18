import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './uniqueCourses.css'

import { useParams } from 'react-router-dom';
import { firestore } from '../../../fbconfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Sidebar } from '../Sidebar/Sidebar';
import { auth } from '../../../fbconfig';
import { useNavigate } from 'react-router-dom';


const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');


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
        const fetchCourses = async () => {
            try {
                const response = await axios.post('http://localhost:5000/unique-courses');
                setCourses(response.data.uniqueCourses);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();

    }, []); // Empty dependency array ensures useEffect runs only once on component mount

    const handleSearchInputChange = event => {
        setSearchQuery(event.target.value);
    };

    // Filter courses based on search query
    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        <div className="container">
            <h1 className="title">Courses List</h1>
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                />
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
            </div>
            <table className="course-table">
                <thead>
                    <tr>
                        <th>Courses</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCourses
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(course => (
                            <tr key={course.id}>
                                <td>{course.name}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
  </div>
    );
};

export default CourseList;
