import React, { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 8px;
  font-size: 16px;
  border: ${props => (props.invalid ? '2px solid red' : '1px solid #ccc')};
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 14px;
  margin-top: -8px;
  margin-bottom: 8px;
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  font-size: 16px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const CourseForm = ({ onAddCourse }) => {
  const [subject, setSubject] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState({});

  const validateSubject = (value) => {
    if (value.length > 10) {
      return 'Subject must be 10 characters or less.';
    }
    return '';
  };

  const validateCourseNumber = (value) => {
    const pattern = /^[a-zA-Z0-9_-]{1,5}$/;
    if (!pattern.test(value)) {
      return 'Course Number can contain letters, numbers, dash (-), underscore (_), and must be 5 characters or less.';
    }
    return '';
  };

  const validateDescription = (value) => {
    if (value.length > 50) {
      return 'Description must be 50 characters or less.';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    const subjectError = validateSubject(subject);
    const courseNumberError = validateCourseNumber(courseNumber);
    const descriptionError = validateDescription(description);

    if (subjectError || courseNumberError || descriptionError) {
      setErrors({
        subject: subjectError,
        courseNumber: courseNumberError,
        description: descriptionError,
      });
      return;
    }

    // If all validations pass, add the course
    onAddCourse({ subject, courseNumber, description });
    setSubject('');
    setCourseNumber('');
    setDescription('');
    setErrors({});
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => {
          setSubject(e.target.value);
          if (errors.subject) {
            setErrors({ ...errors, subject: validateSubject(e.target.value) });
          }
        }}
        maxLength={10}
        required
        invalid={!!errors.subject}
      />
      {errors.subject && <ErrorMessage>{errors.subject}</ErrorMessage>}

      <Input
        type="text"
        placeholder="Course Number"
        value={courseNumber}
        onChange={(e) => {
          setCourseNumber(e.target.value);
          if (errors.courseNumber) {
            setErrors({
              ...errors,
              courseNumber: validateCourseNumber(e.target.value),
            });
          }
        }}
        maxLength={5}
        required
        invalid={!!errors.courseNumber}
      />
      {errors.courseNumber && <ErrorMessage>{errors.courseNumber}</ErrorMessage>}

      <Input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          if (errors.description) {
            setErrors({
              ...errors,
              description: validateDescription(e.target.value),
            });
          }
        }}
        maxLength={50}
        required
        invalid={!!errors.description}
      />
      {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}

      <Button type="submit">Add Course</Button>
    </Form>
  );
};

export default CourseForm;
