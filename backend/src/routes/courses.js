const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course');

// Utility function to escape special regex characters
const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ message: 'An error occurred while fetching courses.' });
  }
});

// Search courses
router.get('/search', async (req, res) => {
  try {
    const { description, subject, courseNumber } = req.query;
    let query = {};

    if (description) {
      const escapedDescription = escapeRegex(description.trim());
      query.description = { $regex: escapedDescription, $options: 'i' };
    }

    if (subject) {
      const escapedSubject = escapeRegex(subject.trim());
      query.subject = { $regex: escapedSubject, $options: 'i' };
    }

    if (courseNumber) {
      const escapedCourseNumber = escapeRegex(courseNumber.trim());
      query.courseNumber = { $regex: `^${escapedCourseNumber}`, $options: 'i' };
    }

    const courses = await Course.find(query);
    res.status(200).json(courses);
  } catch (err) {
    console.error('Error searching courses:', err);
    res.status(500).json({ message: 'An error occurred while searching for courses.' });
  }
});

// Get a course by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid course ID.' });
  }

  try {
    const course = await Course.findById(id);
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: 'Course not found.' });
    }
  } catch (err) {
    console.error('Error fetching course:', err);
    res.status(500).json({ message: 'An error occurred while fetching the course.' });
  }
});

// Delete a course
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid course ID.' });
  }

  try {
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (deletedCourse) {
      res.status(200).json({ message: 'Course deleted' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ message: 'An error occurred while deleting the course.' });
  }
});

// Add a new course
router.post('/', async (req, res) => {
  const { subject, courseNumber, description } = req.body;

  // Check if required fields are present
  if (!subject || !courseNumber || !description) {
    return res.status(400).json({ message: 'Missing required fields: subject, courseNumber, and description are required.' });
  }

  // Sanitize inputs
  const sanitizedSubject = subject.trim();
  const sanitizedCourseNumber = courseNumber.trim();
  const sanitizedDescription = description.trim();

  // Validate courseNumber format
  if (!/^\d{3}$/.test(sanitizedCourseNumber)) {
    return res.status(400).json({ message: 'courseNumber must be a three-digit, zero-padded integer like "033".' });
  }

  const course = new Course({
    subject: sanitizedSubject,
    courseNumber: sanitizedCourseNumber,
    description: sanitizedDescription,
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    if (err.code === 11000) {
      console.error('Duplicate course error:', err);
      return res.status(400).json({ message: 'Duplicate course. The combination of subject and courseNumber must be unique.' });
    }
    console.error('Error adding course:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
