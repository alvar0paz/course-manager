import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CourseForm from './components/CourseForm';
import CourseList from './components/CourseList';
import SearchBar from './components/SearchBar';

const API_URL = 'http://localhost:5001/api/courses';

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
`;

function App() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError('Failed to fetch courses');
    }
  };

  const addCourse = async (course) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      fetchCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchCourses();
    } catch (err) {
      setError('Failed to delete course');
    }
  };

  const searchCourses = async ({ subject, courseNumber, description }) => {
    try {
      const queryParams = new URLSearchParams();
      if (subject) queryParams.append('subject', subject);
      if (courseNumber) queryParams.append('courseNumber', courseNumber);
      if (description) queryParams.append('description', description);

      const response = await fetch(`${API_URL}/search?${queryParams}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError('Failed to search courses: ' + err.message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <AppContainer>
      <Title>Course Manager</Title>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <CourseForm onAddCourse={addCourse} />
      <SearchBar onSearch={searchCourses} />
      <CourseList courses={courses} onDeleteCourse={deleteCourse} />
    </AppContainer>
  );
}

export default App;