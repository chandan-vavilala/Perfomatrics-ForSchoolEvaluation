import React, { useEffect, useState } from "react";
import { query, where } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faBook, faGraduationCap, faNewspaper, faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import "./widget.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth, firestore } from '../../../fbconfig';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';

const Widget = ({ type }) => {
    const [amount, setAmount] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [totalFacultyUsers, setTotalFacultyUsers] = useState(0);
    const [recentFacultyUsersCount, setRecentFacultyUsersCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    console.error('User not logged in.');
                    setLoading(false);
                    return;
                }

                const docSnap = await getDoc(doc(firestore, 'users', user.uid));

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setUserDetails(userData);
                    setLoading(false);
                } else {
                    console.error('User details not found.');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);
    

     useEffect(() => {
        const fetchFacultyUsers = async () => {
            try {
                const schoolId = userDetails?.SchoolId;
                // console.log(userDetails)
                // console.log(schoolId)

                if (!schoolId) {
                    console.error('User is not associated with any school.');
                    return;
                }

                const facultyUsersQuerySnapshot = await getDocs(
                    query(collection(firestore, "users"), 
                        where("SchoolId", "==", schoolId),
                        where("role", "==", "faculty")
                    )
                );

                const facultyUsersCount = facultyUsersQuerySnapshot.size;
                setTotalFacultyUsers(facultyUsersCount);
                console.log(totalFacultyUsers)

                const today = new Date();
                const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);

                const recentFacultyUsersQuerySnapshot = await getDocs(
                    query(collection(firestore, "users"), 
                        where("SchoolId", "==", schoolId),
                        where("role", "==", "faculty"),
                        where("timestamp", ">=", twoDaysAgo)
                    )
                );

                const recentFacultyUsersCount = recentFacultyUsersQuerySnapshot.size;
                setRecentFacultyUsersCount(recentFacultyUsersCount);
                console.log(recentFacultyUsersCount)
            } catch (error) {
                console.error('Error fetching faculty users:', error);
            }
        };

        fetchFacultyUsers();
    }, [userDetails]);
    

    useEffect(() => {
        const fetchData = async () => {
            switch (type) {
                case "users":
                    const usersQuerySnapshot = await getDocs(collection(firestore, "users"));
                    setAmount(usersQuerySnapshot.size);
                    break;

                case "recentUsers":
                    try {
                        const today = new Date();
                        const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
                        const recentUsersQuerySnapshot = await getDocs(
                            query(collection(firestore, "users"), where("timestamp", ">=", twoDaysAgo))
                        );
                        const recentUsersData = recentUsersQuerySnapshot.docs.map((doc) => doc.data());
                        setAmount(recentUsersQuerySnapshot.size);
                    } catch (error) {
                        console.error("Error fetching recent users:", error);
                    }
                    break;

                case "totalSchools":
                    try {
                        const response = await axios.post('http://localhost:5000/unique-schools');
                        const totalSchools = response.data.uniqueSchools.length;
                        setAmount(totalSchools);
                    } catch (error) {
                        console.error('Error fetching total schools:', error);
                        setAmount(0);
                    }
                    break;

                case "totalCourses":
                    try {
                        const response = await axios.post('http://localhost:5000/unique-courses');
                        const courses = response.data.uniqueCourses.length;
                        setAmount(courses);
                    } catch (error) {
                        console.error('Error fetching courses:', error);
                        setAmount(0);
                    }
                    break;

                case "totalAssessments":
                    try {
                        const response = await axios.post('http://localhost:5000/unique-assessments');
                        const totalAssessments = response.data.uniqueAssessment.length;
                        setAmount(totalAssessments);
                    } catch (error) {
                        console.error('Error fetching total assessments:', error);
                        setAmount(0);
                    }
                    break;

                case "schoolusers":
                    const schoolId = userDetails?.SchoolId; 
                    if (!schoolId) {
                        console.error('User is not associated with any school.');
                        return;
                    }

                    const facultyUsersQuerySnapshot = await getDocs(
                        query(collection(firestore, "users"), 
                            where("SchoolId", "==", schoolId),
                            where("role", "==", "faculty")
                        )
                    );

                    const facultyUsersCount = facultyUsersQuerySnapshot.size;
                    setTotalFacultyUsers(facultyUsersCount);
                    setAmount(totalFacultyUsers);
                    break;

                case "recentschoolUsers":
                  
                    setAmount(recentFacultyUsersCount);
                    setAmount(1)
                    break;

                case "schoolCourses":
                    setAmount(20)
                    break;

                default:
                    break;    
            }
        };
        fetchData();
    }, [type, userDetails, recentFacultyUsersCount, totalFacultyUsers]);

    if (loading || !userDetails) {
        return <div>Loading...</div>;
    }

    const getTitle = (type) => {
        switch (type) {
            case "users":
                return "Total Users";
            case "recentUsers":
                return "Recently Added Users (Last 2 days)";
            case "totalCourses":
                return "Total number of Courses";
            case "totalAssessments":
                return "Total Number of Assessments"
            case "totalSchools":
                return "Total Number of Schools"
            case "schoolusers":
                return "Total Faculty";
            case "recentschoolUsers":
                return "Recently added Users";  
            case "schoolCourses":
                return "Total School Courses";
            default:
                return "";
        }
    };

    const getLink = (type) => {
        switch (type) {
            case "users":
                return "Users";
            case "recentUsers":
                return "Recent Users";
            case "totalCourses":
                return "Total number of Courses";
            case "totalAssessments":
                return "Total Number of Assessments"
            case "totalSchools":
                return "UniqueSchools"  
            case "schoolusers":
                return "schoolUsers"; 
            case "recentschoolUsers":
                return "recentSchoolUsers";  
            case "schoolCourses":
                return "schoolCourses";
            default:
                return "";
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'users':
                return faUser;
            case "recentUsers":
                return faUserPlus;
            case "totalCourses":
                return faBook;
            case "totalAssessments":
                return faNewspaper
            case "totalSchools":
                return faGraduationCap  
            case "schoolusers":
                return faUser; 
            default:
                return faUser;
        }
    };

    const handleLinkClick = (type) => {
        const link = getLink(type);
        if (link === "Recent Users") {
            navigate("/recentUsers")
        } else if (link === "Users") {
            navigate("/users");
        }
        else if (link === "schoolUsers"){
            navigate("/users") 
        }
        else if (link === "UniqueSchools"){
            navigate("/Schools")
        }
        else if(link === "Total number of Courses"){
            navigate("/uniqueCourses")
        }
        else if (link === "Total Number of Assessments"){
            navigate("/uniqueAssessments")
        }
        else if(link === "recentSchoolUsers"){
            navigate("/recentUsers")
        } 
        else if(link === "schoolCourses"){
            navigate("/Schools")
        }
        else{
            alert("Something Went Wrong please try again after sometime")
        }
    };

    return (
        <div className="widget" style={{ marginTop: "10px" ,marginLeft: "10px", marginRight: "10px",background: "linear-gradient(to bottom right, #196b3b, #00ef8b)" }}>
            <div className="left">
                <span className="title" style={{color:'white'}}>{getTitle(type)}</span>
                <span className="counter">{amount}</span>
                <span className="link" onClick={() => handleLinkClick(type)}>
                    {getLink(type)}
                </span>
            </div>

            <div className="right">
                <FontAwesomeIcon icon={getIcon(type)} />
            </div>
        </div>
    );
};

export default Widget;
