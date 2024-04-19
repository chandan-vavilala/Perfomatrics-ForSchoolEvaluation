# Perfomatrics - for School Evaluation

## Team Members

1. Poorna Chandan Reddy Vavilala
2. Sri Charan Vattikonda
3. Sai Balaji Gadi 
4. Anudeep Yalamanchi
5. Bharghav Krishna Moparthy
6. Karthik Parvathaneni
## Description
This is a web application built using React.js, Express.js, Node.js, MongoDB, D3.js, and Firebase. It provides the University professors to assess any previous semesters assessments and evaluate them for any further usage of the assessments.

## Features
- **User Management:** Managing users of the university based on their roles(**Super-admin, admin, faculty**).
- **Assessment Evaluations:** A Visualization is used to assess any previous semester's assessments.
- **Cleaning Data:** On Uploading the csv files the data is cleaned in-app and stored in the MongoDB

## Technologies Used
- **Frontend**:
  - React.js
  - D3.js
  - FontAwesome for icons.
 
- **Middleware**
  - Node.js
  - Express.js 

- **Backend**:
  - MongoDB (using Mongoose for ORM) (For managing and storing assessment details)
  - Firebase Firestore (For managing and storing user details)
  - Python Script

- **Authentication and Authorization**:
  - Firebase Authentication

## Installation
1. Clone the repository: `git clone https://github.com/chandan-vavilala/Perfomatrics-ForSchoolEvaluation`
2. Navigate to the project directory: `cd [project directory]`
3. Install dependencies:
   - Frontend: `cd Front-end && npm install`
   - Backend: `cd Back-end && npm install`

## Configuration
1. Configure Firebase:
   - Create a Firebase project: Firebase Console (https://console.firebase.google.com/)
   - Set up Firebase Authentication and copy your Firebase config.
   - Paste the Firebase config in [fbconfig.js] file.

2. Configure MongoDB:
   - Set up MongoDB database.
   - Create .env file in the Back-end folder location.
   - Update the MongoDB connection string in .env file.

## Usage
1. Start the frontend development server:
   ```
   cd Front-end
   npm start
   ```

2. Start the backend development server:
   ```
   cd Back-end
   node index.js
   ```

3. Access the application in your browser at `http://localhost:3000`.

## Python Script 
Script File: [Python Script file](https://github.com/chandan-vavilala/Perfomatrics-ForSchoolEvaluation/blob/main/Back-end/cleanedDataScript.py)


## Contact
For any inquiries or suggestions, please contact:

Poorna Chandan Reddy Vavilala at chandanreddyvavilala@gmail.com

Sri Charan Vattikonda at sricharanv2001@gmail.com



