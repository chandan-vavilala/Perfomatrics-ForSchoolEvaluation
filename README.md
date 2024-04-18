# Perfomatrics - for School Evaluation

## Description
This is a web application built using React.js, Node.js, MongoDB, D3.js, and Firebase. It provides the University professors to assess any previous Semesters Assessments and evaluate them for any further usage of the courses.

## Features
- User Management: Managing users of the university based on there roles.
- Assessment Evaluations: A Visualization is used to assess any previous semester's assessments.
- Cleaning Data: On Uploading the csv files the data is cleaned in-app and stored in the MongoDB

## Technologies Used
- **Frontend**:
  - React.js
  - FontAwesome for icons.

- **Backend**:
  - Node.js
  - MongoDB (using Mongoose for ORM)

- **Authentication and Authorization**:
  - Firebase Authentication
  
- **Deployment**:
  - [Deployment platform, e.g., Heroku, AWS, etc.]

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
   - Create .envfile in the Back-end folder location.
   - Update the MongoDB connection string in "Back-end/.env" file.

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


## Contact
For any inquiries or suggestions, please contact: 
1. Poorna Chandan Reddy Vavilala at chandanreddyvavilala@gmail.com
2. Sri Charan Vattikonda at sricharanvattikonda@gmail.com
3. [] at []
4. [] at []
5. [] at []
6. [] at []


