import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../../../fbconfig';
import { doc, getDoc } from 'firebase/firestore';
import { Sidebar } from '../Sidebar/Sidebar';

export default function FileUpload() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(""); // State to store the selected file name
  const [message, setMessage] = useState("");
  const [uploadedData, setUploadedData] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Reference to the file input element

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
        } else {
          console.error('User details not found.');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, [navigate]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setFileName(selectedFile.name); // Set the selected file name
      setMessage(""); // Clear any previous error message
    } else {
      setFileName("");
      setMessage("Unsupported file format. Please upload a CSV file.");
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
            setMessage("Please select a file to upload.");
            return;
          }
          setIsSubmitting(true);
          const formData = new FormData();
          formData.append("file", file);
          try {
            const response = await axios.post("http://localhost:5000/", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            setMessage("Data Upload Successful");
            setUploadedData(response.data.data);
            setUploadSuccess(true);
          } catch (error) {
            setMessage("Error uploading file.");
            console.error(error.response ? error.response.data : error.message);
          } finally {
            setIsSubmitting(false);
          }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleRetryUpload = () => {
    setUploadSuccess(false);
    setMessage("");
  };

  const handleUploadButtonClick = () => {
    // Trigger click event on the file input element
    fileInputRef.current.click();

    
  };

  return (
    <div style={{ display: "flex", height: "90vh", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginLeft: '40px',
        marginTop: '-20px',
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        background: "linear-gradient(to bottom right, #196b3b, #00ef8b)",
        color: "white",
        maxWidth: "60%",
        overflow: "hidden",
      }}>
        <Sidebar isOpen={isOpen} toggle={toggleSidebar} role={userDetails ? userDetails.role : 'super-admin'} userfName={userDetails ? userDetails.FirstName : ''} userlName={userDetails ? userDetails.LastName : ''} UserImage ={userDetails ? userDetails.Image : ''} />
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1 className="text-3xl font-bold mb-4 text-center">Upload Data</h1>
          {uploadSuccess ? (
            <div className="text-center">
              <p>{message}</p>
              <button onClick={handleRetryUpload} className="mt-4 px-4 py-2 bg-white text-blue-500 rounded-md shadow-md hover:bg-blue-100 focus:outline-none focus:bg-blue-100">Upload Again</button>
            </div>
          ) : (
            <div className="file-upload-container flex flex-col justify-center items-center mt-8">
              <input ref={fileInputRef} type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept=".csv" />
              {fileName && <p>Selected file: {fileName}</p>} {/* Display selected file name */}
              
              <button onClick={handleUploadButtonClick} className="mt-4 px-4 py-2 bg-white text-blue-500 rounded-md shadow-md hover:bg-blue-100 focus:outline-none focus:bg-blue-100">Select File</button>

              {fileName && <button onClick={handleFileUpload}  className="mt-4 px-4 py-2 bg-white text-blue-500 rounded-md shadow-md hover:bg-blue-100 focus:outline-none focus:bg-blue-100">Uplaod</button>}
              <p style={{textAlign:'center',color:'red'}}>{message}</p>  
              {isSubmitting && (
                <div className="mt-4 text-center">
                  <div className="spinner-border text-white" role="status">
                    <span className="visually-hidden">Uploading Data....</span>
                  </div>
                  <p className="mt-2">Please Wait...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
