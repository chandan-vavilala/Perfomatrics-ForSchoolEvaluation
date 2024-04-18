const mongoose = require('mongoose');

// Define schema
const assessmentSchema = new mongoose.Schema({
    assessmentTitle: String,
    assessmentId: Number,
    assessmentType: String,
    learningOutcomeName: String,
    learningOutcomeId: Number,
    attempt: Number,
    outcomeScore: Number,
    courseName: String,
    courseId: Number,
    courseSisId: String,
    sectionName: String,
    sectionId: Number,
    sectionSisId: String,
    assignmentUrl: String,
    learningOutcomePointsPossible: Number,
    learningOutcomeMasteryScore: Number,
    learningOutcomeMastered: Number,
    learningOutcomeRating: String,
    learningOutcomeRatingPoints: Number,
    accountId: Number,
    accountName: String,
    enrollmentState: String,
    year: String,
});

// Create model
const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;