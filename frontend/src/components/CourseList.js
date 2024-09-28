import React from 'react';
import styled from 'styled-components';

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  background-color: #f9f9f9;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;

const CourseList = ({ courses, onDeleteCourse }) => {
  return (
    <List>
      {courses.map((course) => (
        <ListItem key={course._id}>
          <span>{course.subject} {course.courseNumber}: {course.description}</span>
          <DeleteButton onClick={() => onDeleteCourse(course._id)}>Delete</DeleteButton>
        </ListItem>
      ))}
    </List>
  );
};

export default CourseList;