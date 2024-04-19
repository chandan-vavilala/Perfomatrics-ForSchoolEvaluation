import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../../../fbconfig';
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';
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

const DisplayAdminContent = () => {
  const [page, setPage] = useState(PAGE.SELECT_COLLECTION); // Initialize with PAGE.SELECT_COLLECTION
  const [selectedCollection, setSelectedCollection] = useState('');
  const [collections, setCollections] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [learningOutcomes, setLearningOutcomes] = useState([]);
  const [outcomeRatings, setOutcomeRatings] = useState([]);
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
          setUserDetails(docSnap.data());
          setSelectedSchool(docSnap.data().SchoolId)
          console.log(selectedSchool)
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
      const response = await axios.post('http://localhost:5000/Coursedata', { collection: selectedCollection,  school: selectedSchool });
      const { courses } = response.data; // Destructure courses from response.data
      setCourses(courses); // Set the courses state
      setPage(PAGE.COURSE); // Move setPage here to ensure it's called after setting the state
    } catch (error) {
      console.error('Error fetching data:', error);
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
    try {
      const data = { collection: selectedCollection, school: selectedSchool, course: courseId };
    const response = await fetchData('sections', data);
    if (response) setSections(response.sections);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleSectionClick = async (sectionId) => {
    setSelectedSection(sectionId);
    setPage(PAGE.ASSESSMENT);
    const data = { collection: selectedCollection, school: selectedSchool, course: selectedCourse, section: sectionId };
    const response = await fetchData('assessments', data);
    if (response) setAssessments(response.assessments);
  };

  const handleAssessmentClick = async (assessmentId) => {
    setSelectedAssessment(assessmentId);
    setPage(PAGE.OUTCOME);
    const data = { collection: selectedCollection, school: selectedSchool, course: selectedCourse, section: selectedSection, assessment: assessmentId };
    const response = await fetchData('learning-outcomes', data);
    if (response) setLearningOutcomes(response.learningOutcomes);
  };

  const handleOutcomeClick = async (outcomeId) => {
    setSelectedOutcome(outcomeId);
    setPage(PAGE.OUTCOME_GRAPH);
    const data = { collection: selectedCollection, school: selectedSchool, course: selectedCourse, section: selectedSection, assessment: selectedAssessment, outcome: outcomeId };
    const response = await fetchData('outcome-ratings', data);
    if (response) setOutcomeRatings(response.outcomeRatingsCount);
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
        setOutcomeRatings([]);
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

  const renderFilteredSections = () => {
    return sections
      .filter(section => section.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((section, index) => (
        <div key={index} className="card" style={{ height: '250px' }} onClick={() => handleSectionClick(section._id)}>
          <div className='card-content'>
            {/* Main content goes here */}
          </div>
          <div className="course-name-container">
            <h4 className=''>{section.name}</h4>
          </div>
        </div>
      ));
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
          <div className='divheader'>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <h2 style={{ textAlign: 'center' }}>COURSES</h2>
          <div className="card-container">
            {courses
              .filter(course => course.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((course, index) => (
                <div key={index} className="card" style={{ height: '250px' }} onClick={() => handleCourseClick(course._id)}>
                  <div className='card-content'>
                    {/* Main content goes here */}
                  </div>
                  <div className="course-name-container">
                    <h4 className=''>{course.name}</h4>
                  </div>
                </div>
              ))}
          </div>
        </div>
      );
      
      case PAGE.SECTION:
        case PAGE.SECTION:
        return (
          <div>
            <div className='divheader'>
              <input
                type="text"
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <h3 style={{ textAlign: 'center' }}>SECTIONS</h3>
            <div className="card-container">
              {renderFilteredSections()}
            </div>
          </div>
        );
        case PAGE.ASSESSMENT:
          return (
            <div>
              <div className='divheader'>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='searchbar'
                />
              </div>
              <h3 style={{ textAlign: 'center' }}>ASSESSMENTS</h3>
              <div className="card-list-container">
                {assessments
                  .filter(assessment => assessment.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((assessment, index) => (
                    <div key={index} className="assessment-box" onClick={() => handleAssessmentClick(assessment._id)}>
                      <h4 className="assessment-text">{assessment.name}</h4>
                    </div>
                  ))}
              </div>
            </div>
          );    
      case PAGE.OUTCOME:
        return (
          <div>
            <div className='divheader'>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='searchbar'
              />
            </div>
            <h3 style={{ textAlign: 'center' }}>LEARNING OUTCOMES</h3>
            <div className="card-list-container">
              {learningOutcomes
                .filter(outcome => outcome.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((outcome, index) => (
                  <div key={index} className="outcome-box" onClick={() => handleOutcomeClick(outcome._id)}>
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
    <div style={{marginTop:'-80px',marginLeft:'0px',marginRight:'25px'}}>

      {page !== PAGE.SELECT_COLLECTION && <button className="backButton" onClick={handleBackClick}>Back</button>}
      {renderPageContent()}
    </div>
  );
      }


export default DisplayAdminContent;