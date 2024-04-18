// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const csv = require('csvtojson');
// require('dotenv/config');
// const upload = multer({ dest: 'uploads/' });
// const Assessment = require('./model');
// const { spawn } = require('child_process');
// const path = require('path');

// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.get('/', async (req, res) => {
//     try {
//         const items = await Assessment.find({});
//         res.json({ items: items });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// app.post('/', upload.single('file'), async (req, res, next) => {
//     // Convert the uploaded CSV file to JSON
//     csv()
//         .fromFile(req.file.path)
//         .then(async (jsonObj) => {
//             // Validate columns
//             const requiredColumns = ['assessment title', 'assessment id', 'assessment type', 'learning outcome name', 'learning outcome id', 'attempt', 'outcome score', 'course name', 'course id', 'course sis id', 'section name', 'section id', 'section sis id', 'assignment url', 'learning outcome points possible', 'learning outcome mastery score', 'learning outcome mastered', 'learning outcome rating', 'learning outcome rating points', 'account id', 'account name', 'enrollment state'];
//             const hasRequiredColumns = requiredColumns.every(col => Object.keys(jsonObj[0]).includes(col));
//             if (!hasRequiredColumns) {
//                 return res.status(400).send({
//                     message: "Required columns are missing"
//                 });
//             }

//             // Run the Python script for data cleaning
//             console.log("Cleaning data...");
//             const pythonProcess = spawn('python3', [path.join(__dirname, 'cleanedDataScript.py'), req.file.path]);

//             let cleanedData = '';
//             let errorData = '';

//             pythonProcess.stdout.on('data', (data) => {
//                 cleanedData += data.toString();
//             });

//             pythonProcess.stderr.on('data', (data) => {
//                 errorData += data.toString();
//             });

//             pythonProcess.on('close', async (code) => {
//                 if (code === 0) {
//                     try {
//                         // Parse cleaned data to JSON
//                         const parsedData = JSON.parse(cleanedData);
//                         var collection_name = parsedData[0]['year'] +'-'+ parsedData[0]['intake']
//                         console.log(parsedData[0]['year'] +'-'+ parsedData[0]['intake'])
                        
//                         // Store the cleaned data in MongoDB
//                         const result = await mongoose.connection.db.collection(collection_name).insertMany(parsedData);
//                         console.log('Cleaned data stored in MongoDB:', result.insertedCount, 'documents inserted.');
                        
//                         // Send success response
//                         res.json({ message: 'Data cleaned and stored successfully in MongoDB.' });
//                     } catch (error) {
//                         console.error('Error parsing JSON data:', error);
//                         res.status(500).json({ error: 'Error parsing JSON data.' });
//                     }
//                 } else {
//                     console.error('Error running Python script:', errorData);
//                     res.status(500).send({ message: 'Error cleaning data.' });
//                 }
//             });
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             res.status(500).json({ error: 'Error reading CSV file.' });
//         });
// });

// // Add route to fetch collections
// app.get('/collections', async (req, res) => {
//     try {
//       const collections = await mongoose.connection.db.listCollections().toArray();
//       res.json({ collections: collections.map(collection => collection.name) });
//     } catch (error) {
//       console.error('Error fetching collections:', error);
//       res.status(500).json({ error: 'Error fetching collections.' });
//     }
//   });
  
//   // Add route to fetch data based on selected collection
//   app.post('/data', async (req, res) => {
//     const { collection } = req.body;
//     console.log(collection)
//     try {
//         const uniqueSchools = await mongoose.connection.db.collection(collection).aggregate([
//             {
//                 $group: {
//                     _id: '$school id',
//                     name: { $first: '$school name' }
//                 }
//             }
//         ]).toArray();
//         res.json({ uniqueSchools });
//     } catch (err) {
//         console.error('Error fetching unique schools:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });

//   app.post('/unique-schools', async (req, res) => {
//     try {
//         const uniqueSchools = await mongoose.connection.db.collection('cleaned_data3').aggregate([
//             {
//                 $group: {
//                     _id: '$school id',
//                     name: { $first: '$school name' }
//                 }
//             }
//         ]).toArray();
//         res.json({ uniqueSchools });
//     } catch (err) {
//         console.error('Error fetching unique schools:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// app.post('/Coursedata', async (req, res) => {
//     try {
//         const { collection, school } = req.body;
//         const courses = await mongoose.connection.db.collection(collection).aggregate([
//             {
//                 $match: {
//                     'school id': school
//                 }
//             },
//             {
//                 $group: {
//                     _id: '$course id',
//                     name: { $first: '$course name' }
//                 }
//             }
//         ]).toArray();
//         res.json({ courses });
//     } catch (err) {
//         console.error('Error fetching courses:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// app.post('/courses', async (req, res) => {
//     try {
//         const { collection, school } = req.body;
//         const courses = await mongoose.connection.db.collection(collection).aggregate([
//             {
//                 $match: {
//                     'school id': school
//                 }
//             },
//             {
//                 $group: {
//                     _id: '$course id',
//                     name: { $first: '$course name' }
//                 }
//             }
//         ]).toArray();
//         res.json({ courses });
//     } catch (err) {
//         console.error('Error fetching courses:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// app.post('/sections', async (req, res) => {
    
//     try {
//         const {collection, school, course } = req.body;
//         const sections = await mongoose.connection.db.collection(collection).aggregate([
//             {
//                 $match: {
//                     'school id': school,
//                     'course id': course
//                 }
//             },
//             {
//                 $group: {
//                     _id: '$section id',
//                     name: { $first: '$section name' }
//                 }
//             }
//         ]).toArray();
//         res.json({ sections });
//     } catch (err) {
//         console.error('Error fetching sections:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// app.post('/assessments', async (req, res) => {
//     try {
//         const { collection, school, course, section } = req.body;
//         console.log(school, course, section, collection)
//         const assessments = await mongoose.connection.db.collection(collection).aggregate([
//             {
//                 $match: {
//                     'school id': school,
//                     'course id': course,
//                     'section id': section
//                 }
//             },
//             {
//                 $group: {
//                     _id: '$assessment id',
//                     name: { $first: '$assessment title' }
//                 }
//             }
//         ]).toArray();
//         res.json({ assessments });
//         console.log(assessments)
//     } catch (err) {
//         console.error('Error fetching assessments:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// app.post('/learning-outcomes', async (req, res) => {
//     try {
//         const {collection, school, course, section, assessment } = req.body;
//         const learningOutcomes = await mongoose.connection.db.collection(collection).aggregate([
//             {
//                 $match: {
//                     'school id': school,
//                     'course id': course,
//                     'section id': section,
//                     'assessment id': assessment
//                 }
//             },
//             {
//                 $group: {
//                     _id: '$learning outcome id',
//                     name: { $first: '$learning outcome name' }
//                 }
//             }
//         ]).toArray();
//         res.json({ learningOutcomes });
//     } catch (err) {
//         console.error('Error fetching learning outcomes:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// app.post('/outcome-ratings', async (req, res) => {
//     try {
//         const {collection, school, course, section, assessment, outcome } = req.body;
//         const outcomeRatingsCount = await mongoose.connection.db.collection(collection).aggregate([
//             {
//                 $match: {
//                     'school id': school,
//                     'course id': course,
//                     'section id': section,
//                     'assessment id': assessment,
//                     'learning outcome id': outcome
//                 }
//             },
//             {
//                 $group: {
//                     _id: '$learning outcome rating',
//                     count: { $sum: 1 }
//                 }
//             }
//         ]).toArray();

//         res.json({ outcomeRatingsCount });
//     } catch (err) {
//         console.error('Error fetching outcome ratings count:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// app.post('/coursesArray', async (req, res) => {
//     try {
//         const { collection, courses } = req.body;
//         console.log(courses)
//         const coursesData = await mongoose.connection.db.collection(collection).aggregate([
//             {
//                 $match: {
//                     'course id': { $in: courses }
//                 }
//             },
//             {
//                 $group: {
//                     _id: '$course id',
//                     name: { $first: '$course name' }
//                 }
//             }
//         ]).toArray();
//         res.json({ courses: coursesData });
//         console.log(coursesData)
//     } catch (err) {
//         console.error('Error fetching courses:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


// app.post('/sectionsArray', async (req, res) => {
//     try {
//         const {collection, course, sectionIds } = req.body;
//         console.log('Received course ID:', course);
//         console.log('Received section IDs:', sectionIds);

//         const sectionsData = await mongoose.connection.db.collection(collection).aggregate([
//             {
//                 $match: {
//                     'course id': course, 
//                     'section id': { $in: sectionIds } 
//                 }
//             },
//             {
//                 $group: {
//                     _id: '$section id',
//                     name: { $first: '$section name' }
//                 }
//             }
//         ]).toArray();

//         console.log('Fetched sections:', sectionsData);
//         res.json({ sections: sectionsData });
//     } catch (err) {
//         console.error('Error fetching sections:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => {
//     console.log('Connected to database!');
//     app.listen(process.env.PORT || 5000, () => {
//         console.log('Server started!');
//     });
// }).catch(err => {
//     console.error('Error connecting to database:', err);
// });





const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const csv = require('csvtojson');
require('dotenv/config');
const upload = multer({ dest: 'uploads/' });
const Assessment = require('./model');
const { spawn } = require('child_process');
const path = require('path');
const { Console } = require('console');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
    try {
        const items = await Assessment.find({});
        res.json({ items: items });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/', upload.single('file'), async (req, res, next) => {
    // Convert the uploaded CSV file to JSON
    csv()
        .fromFile(req.file.path)
        .then(async (jsonObj) => {
            // Validate columns
            const requiredColumns = ['assessment title', 'assessment id', 'assessment type', 'learning outcome name', 'learning outcome id', 'attempt', 'outcome score', 'course name', 'course id', 'course sis id', 'section name', 'section id', 'section sis id', 'assignment url', 'learning outcome points possible', 'learning outcome mastery score', 'learning outcome mastered', 'learning outcome rating', 'learning outcome rating points', 'account id', 'account name', 'enrollment state'];
            const hasRequiredColumns = requiredColumns.every(col => Object.keys(jsonObj[0]).includes(col));
            if (!hasRequiredColumns) {
                return res.status(400).send({
                    message: "Required columns are missing"
                });
            }

            // Run the Python script for data cleaning
            console.log("Cleaning data...");
            const pythonProcess = spawn('python3', [path.join(__dirname, 'cleanedDataScript.py'), req.file.path]);

            let cleanedData = '';
            let errorData = '';

            pythonProcess.stdout.on('data', (data) => {
                cleanedData += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                errorData += data.toString();
            });

            pythonProcess.on('close', async (code) => {
                if (code === 0) {
                    try {
                        // Parse cleaned data to JSON
                        const parsedData = JSON.parse(cleanedData);
                        var collection_name = parsedData[0]['year'] +'-'+ parsedData[0]['intake']
                        console.log(parsedData[0]['year'] +'-'+ parsedData[0]['intake'])
                        
                        // Store the cleaned data in MongoDB
                        const result = await mongoose.connection.db.collection(collection_name).insertMany(parsedData);
                        console.log('Cleaned data stored in MongoDB:', result.insertedCount, 'documents inserted.');
                        
                        // Send success response
                        res.json({ message: 'Data cleaned and stored successfully in MongoDB.' });
                    } catch (error) {
                        console.error('Error parsing JSON data:', error);
                        res.status(500).json({ error: 'Error parsing JSON data.' });
                    }
                } else {
                    console.error('Error running Python script:', errorData);
                    res.status(500).send({ message: 'Error cleaning data.' });
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error reading CSV file.' });
        });
});

// Add route to fetch collections
app.get('/collections', async (req, res) => {
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      res.json({ collections: collections.map(collection => collection.name) });
    } catch (error) {
      console.error('Error fetching collections:', error);
      res.status(500).json({ error: 'Error fetching collections.' });
    }
  });
  
  // Add route to fetch data based on selected collection
  app.post('/data', async (req, res) => {
    const { collection } = req.body;
    console.log(collection)
    try {
        const uniqueSchools = await mongoose.connection.db.collection(collection).aggregate([
            {
                $group: {
                    _id: '$school id',
                    name: { $first: '$school name' }
                }
            }
        ]).toArray();
        res.json({ uniqueSchools });
    } catch (err) {
        console.error('Error fetching unique schools:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/unique-schools', async (req, res) => {
    try {
        const uniqueSchools = await mongoose.connection.db.collection('cleaned_data3').aggregate([
            {
                $group: {
                    _id: '$school id',
                    name: { $first: '$school name' }
                }
            }
        ]).toArray();
        res.json({ uniqueSchools });
    } catch (err) {
        console.error('Error fetching unique schools:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/Coursedata', async (req, res) => {
    try {
        const { collection, school } = req.body;
        const courses = await mongoose.connection.db.collection(collection).aggregate([
            {
                $match: {
                    'school id': school
                }
            },
            {
                $group: {
                    _id: '$course id',
                    name: { $first: '$course name' }
                }
            }
        ]).toArray();
        res.json({ courses });
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/courses', async (req, res) => {
    try {
        const { collection, school } = req.body;
        console.log(collection)
        console.log(school)
        const courses = await mongoose.connection.db.collection(collection).aggregate([
            {
                $match: {
                    'school id': school
                }
            },
            {
                $group: {
                    _id: '$course id',
                    name: { $first: '$course name' }
                }
            }
        ]).toArray();
        res.json({ courses });
        console.log(courses)
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/sections', async (req, res) => {
    
    try {
        const {collection, school, course } = req.body;
        const sections = await mongoose.connection.db.collection(collection).aggregate([
            {
                $match: {
                    'school id': school,
                    'course id': course
                }
            },
            {
                $group: {
                    _id: '$section id',
                    name: { $first: '$section name' }
                }
            }
        ]).toArray();
        res.json({ sections });
    } catch (err) {
        console.error('Error fetching sections:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/assessments', async (req, res) => {
    try {
        const { collection, school, course, section } = req.body;
        console.log(school, course, section, collection)
        const assessments = await mongoose.connection.db.collection(collection).aggregate([
            {
                $match: {
                    'school id': school,
                    'course id': course,
                    'section id': section
                }
            },
            {
                $group: {
                    _id: '$assessment id',
                    name: { $first: '$assessment title' }
                }
            }
        ]).toArray();
        res.json({ assessments });
        console.log(assessments)
    } catch (err) {
        console.error('Error fetching assessments:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/learning-outcomes', async (req, res) => {
    try {
        const {collection, school, course, section, assessment } = req.body;
        const learningOutcomes = await mongoose.connection.db.collection(collection).aggregate([
            {
                $match: {
                    'school id': school,
                    'course id': course,
                    'section id': section,
                    'assessment id': assessment
                }
            },
            {
                $group: {
                    _id: '$learning outcome id',
                    name: { $first: '$learning outcome name' }
                }
            }
        ]).toArray();
        res.json({ learningOutcomes });
    } catch (err) {
        console.error('Error fetching learning outcomes:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/outcome-ratings', async (req, res) => {
    try {
        const {collection, school, course, section, assessment, outcome } = req.body;
        const outcomeRatingsCount = await mongoose.connection.db.collection(collection).aggregate([
            {
                $match: {
                    'school id': school,
                    'course id': course,
                    'section id': section,
                    'assessment id': assessment,
                    'learning outcome id': outcome
                }
            },
            {
                $group: {
                    _id: '$learning outcome rating',
                    count: { $sum: 1 }
                }
            }
        ]).toArray();

        res.json({ outcomeRatingsCount });
    } catch (err) {
        console.error('Error fetching outcome ratings count:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/coursesArray', async (req, res) => {
    try {
        const { collection, courses } = req.body;
        console.log(courses)
        const coursesData = await mongoose.connection.db.collection(collection).aggregate([
            {
                $match: {
                    'course id': { $in: courses }
                }
            },
            {
                $group: {
                    _id: '$course id',
                    name: { $first: '$course name' }
                }
            }
        ]).toArray();
        res.json({ courses: coursesData });
        console.log(coursesData)
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/sectionsArray', async (req, res) => {
    try {
        const {collection, course, sectionIds } = req.body;
        console.log('Received course ID:', course);
        console.log('Received section IDs:', sectionIds);

        const sectionsData = await mongoose.connection.db.collection(collection).aggregate([
            {
                $match: {
                    'course id': course, 
                    'section id': { $in: sectionIds } 
                }
            },
            {
                $group: {
                    _id: '$section id',
                    name: { $first: '$section name' }
                }
            }
        ]).toArray();

        console.log('Fetched sections:', sectionsData);
        res.json({ sections: sectionsData });
    } catch (err) {
        console.error('Error fetching sections:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/schools1', async (req, res) => {
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      const uniqueSchoolsSet = new Set(); // Using Set to ensure uniqueness
  
      for (const collection of collections) {
        const collectionName = collection.name;
        const uniqueSchools = await mongoose.connection.db.collection(collectionName).aggregate([
          {
            $group: {
              _id: '$school id',
              name: { $first: '$school name' }
            }
          }
        ]).toArray();
  
        uniqueSchools.forEach(school => {
          uniqueSchoolsSet.add(JSON.stringify(school)); // Convert to string to ensure uniqueness
        });
      }
  
      // Convert uniqueSchoolsSet back to array of objects
      const uniqueSchoolsArray = Array.from(uniqueSchoolsSet).map(school => JSON.parse(school));
  
      console.log({ uniqueSchoolsArray });
      res.json({ schools: uniqueSchoolsArray });
    } catch (error) {
      console.error('Error fetching schools:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  
  
  app.post('/courses1', async (req, res) => {
    try {
      const { school } = req.body;
      console.log(school)
      const collections = await mongoose.connection.db.listCollections().toArray();
      const coursesSet = new Set(); // Using Set to ensure uniqueness
  
      for (const collection of collections) {
        const collectionName = collection.name;
        const courses = await mongoose.connection.db.collection(collectionName).aggregate([
            {
                $match: {
                    'school id': school
                }
            },
            {
                $group: {
                    _id: '$course id',
                    name: { $first: '$course name' }
                }
            }
        ]).toArray();
        
        courses.forEach(course => {
          coursesSet.add(JSON.stringify(course)); // Convert to string to ensure uniqueness
        });
      }
  
      // Convert coursesSet back to array of objects
      const uniqueCourses = Array.from(coursesSet).map(course => JSON.parse(course));
  
      console.log({ uniqueCourses });
      res.json({ courses: uniqueCourses });
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/sections1', async (req, res) => {
    try {
      const { school, course } = req.body;
      const collections = await mongoose.connection.db.listCollections().toArray();
      const sectionSet = new Set();
  
      for (const collection of collections) {
        const collectionName = collection.name;
        const sections = await mongoose.connection.db.collection(collectionName).aggregate([
            {
                $match: {
                    'school id': school,
                    'course id': course
                }
            },
            {
                $group: {
                    _id: '$section id',
                    name: { $first: '$section name' }
                }
            }
        ]).toArray();
        sections.forEach(section => {
            sectionSet.add(JSON.stringify(section));
        });
      }
  
      const uniqueSections = Array.from(sectionSet).map(section => JSON.parse(section));
  
      console.log({ uniqueSections });
      res.json({ sections: uniqueSections });
     // res.json({ sections });
    } catch (error) {
      console.error('Error fetching sections:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.post('/coursesArray', async (req, res) => {
    try {
        const { courses } = req.body;
        console.log(courses)
        const collections = await mongoose.connection.db.listCollections().toArray();
      const coursesSet = new Set(); 
      for (const collection of collections) {
        const collectionName = collection.name;
        const coursesData = await mongoose.connection.db.collection(collectionName).aggregate([
            {
                $match: {
                    'course id': { $in: courses }
                }
            },
            {
                $group: {
                    _id: '$course id',
                    name: { $first: '$course name' }
                }
            }
        ]).toArray();
        
        courses.forEach(course => {
          coursesSet.add(JSON.stringify(course)); // Convert to string to ensure uniqueness
        });
      }
      const uniqueCourses = Array.from(coursesSet).map(course => JSON.parse(course));
  
      console.log({ uniqueCourses });
      res.json({ courses: uniqueCourses });

    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/sectionsArray1', async (req, res) => {
    try {
        const { courses } = req.body;
        console.log(courses)
        const collections = await mongoose.connection.db.listCollections().toArray();
        const sectionSet = new Set();

        for (const collection of collections) {
            const collectionName = collection.name;
            const sections = await mongoose.connection.db.collection(collectionName).aggregate([
                {
                    $match: {
                        'course id': { $in: courses }
                    }
                },
                {
                    $group: {
                        _id: '$section id',
                        name: { $first: '$section name' }
                    }
                }
            ]).toArray();

            sections.forEach(section => {
                sectionSet.add(JSON.stringify(section));
            });
        }
        
        const uniqueSections = Array.from(sectionSet).map(section => JSON.parse(section));
  
        console.log({ uniqueSections });
        res.json({ sections: uniqueSections });
    } catch (err) {
        console.error('Error fetching sections:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
  
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to database!');
    app.listen(process.env.PORT || 5000, () => {
        console.log('Server started!');
    });
}).catch(err => {
    console.error('Error connecting to database:', err);
});


