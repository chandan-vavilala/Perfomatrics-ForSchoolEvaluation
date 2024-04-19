import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, firestore } from '../../../fbconfig';
import { doc, getDoc } from 'firebase/firestore';
import DisplayCharts from './displaycharts';
import './displayContent.css'

const PAGE = {
  SELECT_COLLECTION: 'select_collection',
  COURSE: 'course',
  SECTION: 'section',
  ASSESSMENT: 'assessment',
  OUTCOME: 'outcome',
  OUTCOME_GRAPH: 'outcome_graph'
};

const DisplayFacultyContents = () => {
  const [page, setPage] = useState(PAGE.SELECT_COLLECTION);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [collections, setCollections] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState('');
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [section, setSection] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [learningOutcomes, setLearningOutcomes] = useState([]);
  const [outcomeRatings, setOutcomeRatings] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [courseArray, setCourseArray] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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
          setSelectedSchool(docSnap.data().SchoolId);
         // fetchCourses(docSnap.data().CourseIds); 
          console.log(docSnap.data().CourseIds);
          setSections(docSnap.data().SectionIds); 
          console.log(docSnap.data().SectionIds);
          setCourseArray(docSnap.data().CourseIds);
          console.log(courseArray);
        } else {
          console.error('User details not found.');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();

    const fetchCollections = async () => {
      try {
        const response = await axios.get('http://localhost:5000/collections');
        console.log(response.data.collections)
        setCollections(response.data.collections);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchCollections();
  }, []);

  const handleCollectionSelect = async () => {
    try {
      const user = auth.currentUser;
      const docSnap = await getDoc(doc(firestore, 'users', user.uid));
      const coursesArray = docSnap.data().CourseIds
      const response = await axios.post('http://localhost:5000/coursesArray', { collection: selectedCollection,  courses: coursesArray });
    //  const { courses } = response.data; // Destructure courses from response.data
      setCourses(response.data.courses);
      console.log(response.data.courses) // Set the courses state
      setPage(PAGE.COURSE); // Move setPage here to ensure it's called after setting the state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchSections = async (courseId) => {
    try {
      const response = await axios.post('http://localhost:5000/sectionsArray', {collection: selectedCollection, course: courseId, sectionIds: sections });
      setSection(response.data.sections)
      // console.log(response.data.sections);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchData = async (endpoint, data) => {
    try {
      const response = await axios.post(`http://localhost:5000/${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return null;
    }
  };
  
  const handleCourseClick = async (courseId) => {
    setSelectedCourse(courseId);
    setPage(PAGE.SECTION);
    console.log(courseId);
    console.log("HI")
    fetchSections(courseId);
  };


  const handleSectionClick = async (sectionId) => {
    setSelectedSection(sectionId);
    setPage(PAGE.ASSESSMENT);
    try {
      const response = await axios.post('http://localhost:5000/assessments', {collection: selectedCollection, school: selectedSchool, course: selectedCourse, section: sectionId });
      setAssessments(response.data.assessments);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const handleAssessmentClick = async (assessmentId) => {
    setSelectedAssessment(assessmentId);
    setPage(PAGE.OUTCOME);
    try {
      const response = await axios.post('http://localhost:5000/learning-outcomes', {collection: selectedCollection, school: selectedSchool, course: selectedCourse, section: selectedSection, assessment: assessmentId });
      setLearningOutcomes(response.data.learningOutcomes);
    } catch (error) {
      console.error('Error fetching learning outcomes:', error);
    }
  };

  const handleOutcomeClick = async (outcomeId) => {
    setSelectedOutcome(outcomeId);
    setPage(PAGE.OUTCOME_GRAPH);
    try {
      const response = await axios.post('http://localhost:5000/outcome-ratings', {collection: selectedCollection, school: selectedSchool, course: selectedCourse, section: selectedSection, assessment: selectedAssessment, outcome: outcomeId });
      setOutcomeRatings(response.data.outcomeRatingsCount);
    } catch (error) {
      console.error('Error fetching outcome ratings:', error);
    }
  };

  const handleBackClick = () => {
    switch (page) {
      case PAGE.SECTION:
        setPage(PAGE.COURSE);
        break;
      case PAGE.ASSESSMENT:
        setPage(PAGE.SECTION);
        break;
      case PAGE.OUTCOME:
        setPage(PAGE.ASSESSMENT);
        break;
      case PAGE.COURSE:
        setPage(PAGE.SELECT_COLLECTION);
        break;
      case PAGE.OUTCOME_GRAPH:
       setPage(PAGE.OUTCOME)
      default:
        break;
    }
  };

  const renderPageContent = () => {
    switch (page) {
      case PAGE.SELECT_COLLECTION:
        return (
          <div className="semester-container">
            <h2 className="semester-heading">Select Semester</h2>
            {collections.length > 0 ? (
              <>
                <select className="semester-select" onChange={(e) => setSelectedCollection(e.target.value)}>
                <option value="">Select Semester</option>



                  {collections
                    .slice() // Make a copy of the array to avoid mutating the original
                    .sort((a, b) => {
                      const yearA = parseInt(a.split('-')[0]);
                      const yearB = parseInt(b.split('-')[0]);
                      return yearA - yearB;
                    })
                    .map((sortedCollection, index) => (
                      <option key={index} value={sortedCollection}>
                        {sortedCollection}
                      </option>
                    ))}



                </select>
                <button className="semester-button" onClick={handleCollectionSelect}>Select</button>
              </>
            ) : (
              <p>No files uploaded. Please upload data files.</p>
            )} 
          </div>
        );
      case PAGE.COURSE:
        return (
          <div>
            <h2 style={{textAlign:'center'}}>COURSES</h2>
            <div className='card-container'>
              {courses.map((course, index) => (
                <div className='card' key={index}   style={{height:'250px'}} onClick={() => handleCourseClick(course._id)}>
                   <div className='card-content'>
                      {/* Main content goes here */}
                    </div>
                  <div className='course-name-container'>
                      <h4>{course.name}</h4>
                    </div>
                </div>
              ))}
            </div>
          </div>
        );
      case PAGE.SECTION:
        return (
          <div>
            <h3 style={{textAlign:'center'}}>SECTIONS</h3>
            <div className='card-container'>
              {section.map((sec, index) => (
                <div className='card' key={index}  style={{height:'250px'}} onClick={() => handleSectionClick(sec._id)}>
                  <div className='card-content'>
                      {/* Main content goes here */}
                    </div>
                  <div className='course-name-container'>
                      <h4>{sec.name}</h4>
                    </div>
                </div>
              ))}
            </div>
          </div>
        );
      case PAGE.ASSESSMENT:
        return (
          <div>
            <h3 style={{textAlign:'center'}}>ASSESSMENTS</h3>
            <div className='card-list-container'>
              {assessments.map((assessment, index) => (
                <div className='assessment-box' key={index}   style={{height:''}} onClick={() => handleAssessmentClick(assessment._id)}>
                  
                  
                      <h4 className='assessment-text'>{assessment.name}</h4>
                </div>
              ))}
            </div>
          </div>
        );
      case PAGE.OUTCOME:
        return (
          <div>
            <h3 style={{textAlign:'center'}}>LEARNING OUTCOMES</h3>
            <div className='card-list-container'>
              {learningOutcomes.map((outcome, index) => (
                <div className='outcome-box' key={index}  style={{height:''}} onClick={() => handleOutcomeClick(outcome._id)}>
                   
                 
                      <h4 className="outcome-text">{outcome.name}</h4>
                </div>
              ))}
            </div>
          </div>
        );
        case PAGE.OUTCOME_GRAPH:
          return (
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
            <h3>Outcome Graph</h3>
            <DisplayCharts data={outcomeRatings} />
          </div>
          
          );
      default:
        return null;
    }
  };

  return (
    <div style={{marginTop:'-100px',marginLeft:'-25px',marginRight:'25px'}}>

      {page !== PAGE.SELECT_COLLECTION && <button className="backButton" onClick={handleBackClick}>Back</button>}
      {renderPageContent()}

    </div>
  );
}

export default DisplayFacultyContents;

