  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import DisplayCharts from './displaycharts';
  import '../../Cascade Styling/superadmin.css';
  import './displayContent.css'
  const PAGES = {
    SELECT_COLLECTION: 'select_collection',
    SCHOOL: 'school',
    COURSE: 'course',
    SECTION: 'section',
    ASSESSMENT: 'assessment',
    OUTCOME: 'outcome',
    OUTCOME_GRAPH: 'outcome_graph'
  };
  
  export function DisplayContent() {
    const [page, setPage] = useState(PAGES.SELECT_COLLECTION);
    const [selectedCollection, setSelectedCollection] = useState('');
    const [collections, setCollections] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedAssessment, setSelectedAssessment] = useState('');
    const [selectedOutcome, setSelectedOutcome] = useState('');
    const [uniqueSchools, setUniqueSchools] = useState([]);
    const [courses, setCourses] = useState([]);
    const [sections, setSections] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [learningOutcomes, setLearningOutcomes] = useState([]);
    const [outcomeRatings, setOutcomeRatings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
  
    useEffect(() => {
      const fetchCollections = async () => {
        try {
          const response = await axios.get('http://localhost:5000/collections');
          setCollections(response.data.collections);
        } catch (error) {
          console.error('Error fetching collections:', error);
        }
      };
  
      fetchCollections();
    }, []);
  
    const handleCollectionSelect = async () => {
      setPage(PAGES.SCHOOL);
      try {
        const response = await axios.post('http://localhost:5000/data', { collection: selectedCollection });
        setUniqueSchools(response.data.uniqueSchools);
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
  
    const handleSchoolClick = async (schoolId) => {
      setSelectedSchool(schoolId);
      setPage(PAGES.COURSE);
      const data = { collection: selectedCollection, school: schoolId };
      const response = await fetchData('courses', data);
      if (response) setCourses(response.courses);
    };
  
    const handleCourseClick = async (courseId) => {
      setSelectedCourse(courseId);
      setPage(PAGES.SECTION);
      const data = { collection: selectedCollection, school: selectedSchool, course: courseId };
      const response = await fetchData('sections', data);
      if (response) setSections(response.sections);
    };
  
    const handleSectionClick = async (sectionId) => {
      setSelectedSection(sectionId);
      setPage(PAGES.ASSESSMENT);
      const data = { collection: selectedCollection, school: selectedSchool, course: selectedCourse, section: sectionId };
      const response = await fetchData('assessments', data);
      if (response) setAssessments(response.assessments);
    };
  
    const handleAssessmentClick = async (assessmentId) => {
      setSelectedAssessment(assessmentId);
      setPage(PAGES.OUTCOME);
      const data = { collection: selectedCollection, school: selectedSchool, course: selectedCourse, section: selectedSection, assessment: assessmentId };
      const response = await fetchData('learning-outcomes', data);
      if (response) setLearningOutcomes(response.learningOutcomes);
    };
  
    const handleOutcomeClick = async (outcomeId) => {
      setSelectedOutcome(outcomeId);
      setPage(PAGES.OUTCOME_GRAPH);
      const data = { collection: selectedCollection, school: selectedSchool, course: selectedCourse, section: selectedSection, assessment: selectedAssessment, outcome: outcomeId };
      const response = await fetchData('outcome-ratings', data);
      if (response) setOutcomeRatings(response.outcomeRatingsCount);
    };
  
    const handleBackClick = () => {
      switch (page) {
        case PAGES.COURSE:
          setPage(PAGES.SCHOOL);
          break;
        case PAGES.SECTION:
          setPage(PAGES.COURSE);
          break;
        case PAGES.ASSESSMENT:
          setPage(PAGES.SECTION);
          break;
        case PAGES.OUTCOME:
          setPage(PAGES.ASSESSMENT);
          setOutcomeRatings([]);
          break;
        case PAGES.SCHOOL:
          setPage(PAGES.SELECT_COLLECTION);
          break;
        case PAGES.OUTCOME_GRAPH:
          setPage(PAGES.OUTCOME)
        default:
          break;
      }
    };
  
    const renderPageContent = () => {
      switch (page) {
        case PAGES.SELECT_COLLECTION:
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
        case PAGES.SCHOOL:
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
              <h1 style={{ textAlign: 'center' }}>SCHOOLS</h1>
          
              <div className="card-container">
                {uniqueSchools
                  .filter((school) =>
                    school.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by school name
                  .map((school, index) => {
                    // Split the name at '/' and take only the part before it
                    const trimmedName = school.name.split('/')[0].trim();
                    return (
                      <div key={index} className="card" style={{ height: '250px' }} onClick={() => handleSchoolClick(school._id)}>
                        <div className='card-content'>
                          {/* Main content goes here */}
                        </div>
                        <div className="course-name-container">
                          <h4 className=''>{trimmedName}</h4>
                        </div>
                      </div>
                    );
                  })}
                {uniqueSchools.length === 0 && <h1>No Schools Available</h1>}
              </div>
            </div>
          );
        case PAGES.COURSE:
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
              <h3 style={{ textAlign: 'center' }}>COURSES</h3>
            
              <div className="card-container">
                {courses
                  .filter(course => course.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((course, index) => (
                    <div key={index} className="card" style={{ height: '250px' }} onClick={() => handleCourseClick(course._id)}>
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
        case PAGES.SECTION:
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
              <h3 style={{ textAlign: 'center' }}>SECTIONS</h3>
              
              <div className="card-container">
                {sections
                  .filter(section => section.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((section, index) => (
                    <div key={index} className="card" style={{ height: '250px' }} onClick={() => handleSectionClick(section._id)}>
                      <div className='card-content'>
                        {/* Main content goes here */}
                      </div>
                      <div className='course-name-container'>
                        <h4>{section.name}</h4>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          );
        case PAGES.ASSESSMENT:
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
        case PAGES.OUTCOME:
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
          
          case PAGES.OUTCOME_GRAPH:
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
      <div style={{marginTop:'-60px',marginLeft:'10px',marginRight:'25px'}}>

        {page !== PAGES.SELECT_COLLECTION && <button className="backButton" onClick={handleBackClick}>Back</button>}
        {renderPageContent()}
      </div>
    );
  }
  
  

  