import React, { useState } from 'react';
import styled from 'styled-components';

const SearchForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: 8px;
  font-size: 16px;
  min-width: 120px;
  border: ${props => (props.invalid ? '2px solid red' : '1px solid #ccc')};
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 14px;
  margin-top: -8px;
  margin-bottom: 8px;
  width: 100%;
`;

const SearchButton = styled.button`
  background-color: #008CBA;
  color: white;
  padding: 10px 15px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #007B9A;
  }
`;

const SearchBar = ({ onSearch }) => {
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
    if (!value) return '';
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

    onSearch({ subject, courseNumber, description });
    setErrors({});
  };

  return (
    <SearchForm onSubmit={handleSubmit}>
      <SearchInput
        type="text"
        placeholder="Subject (e.g., BIO)"
        value={subject}
        onChange={(e) => {
          const value = e.target.value.toUpperCase();
          setSubject(value);
          if (errors.subject) {
            setErrors({ ...errors, subject: validateSubject(value) });
          }
        }}
        maxLength={10}
        invalid={!!errors.subject}
      />
      {errors.subject && <ErrorMessage>{errors.subject}</ErrorMessage>}

      <SearchInput
        type="text"
        placeholder="Course Number (e.g., 101)"
        value={courseNumber}
        onChange={(e) => {
          const value = e.target.value;
          setCourseNumber(value);
          if (errors.courseNumber) {
            setErrors({ ...errors, courseNumber: validateCourseNumber(value) });
          }
        }}
        maxLength={5}
        invalid={!!errors.courseNumber}
      />
      {errors.courseNumber && <ErrorMessage>{errors.courseNumber}</ErrorMessage>}

      <SearchInput
        type="text"
        placeholder="Description (e.g., Biology)"
        value={description}
        onChange={(e) => {
          const value = e.target.value;
          setDescription(value);
          if (errors.description) {
            setErrors({ ...errors, description: validateDescription(value) });
          }
        }}
        maxLength={50}
        invalid={!!errors.description}
      />
      {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}

      <SearchButton type="submit">Search</SearchButton>
    </SearchForm>
  );
};

export default SearchBar;
