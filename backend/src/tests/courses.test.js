const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Course = require('../models/Course');

beforeAll(async () => {
  const mongoURI = 'mongodb://localhost:27017/testdb';
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Course.deleteMany({});
});

describe('Course API', () => {

  // Tests for adding courses
  describe('POST /api/courses', () => {
    it('should create a new course with valid data', async () => {
      const res = await request(app)
        .post('/api/courses')
        .send({
          subject: 'TEST',
          courseNumber: '101',
          description: 'Test Course',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.subject).toEqual('TEST');
      expect(res.body.courseNumber).toEqual('101');
      expect(res.body.description).toEqual('Test Course');
    });

    it('should not create a course with invalid courseNumber format', async () => {
      const res = await request(app)
        .post('/api/courses')
        .send({
          subject: 'TEST',
          courseNumber: '1',
          description: 'Invalid Course',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain(
        'courseNumber must be a three-digit, zero-padded integer like "033".'
      );
    });

    it('should not create a course with missing fields', async () => {
      const res = await request(app)
        .post('/api/courses')
        .send({
          subject: 'TEST',
          // Missing courseNumber and description
        });
      expect(res.statusCode).toEqual(400);
    });

    it('should not create a duplicate course', async () => {
      await Course.create({
        subject: 'DUP',
        courseNumber: '101',
        description: 'Original Course',
      });

      const res = await request(app)
        .post('/api/courses')
        .send({
          subject: 'DUP',
          courseNumber: '101',
          description: 'Duplicate Course',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain(
        'Duplicate course. The combination of subject and courseNumber must be unique.'
      );
    });

    it('should sanitize and trim inputs before saving', async () => {
      const res = await request(app)
        .post('/api/courses')
        .send({
          subject: '  TEST  ',
          courseNumber: ' 101 ',
          description: '  Test Course  ',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.subject).toEqual('TEST');
      expect(res.body.courseNumber).toEqual('101');
      expect(res.body.description).toEqual('Test Course');
    });
  });

  // Tests for retrieving courses
  describe('GET /api/courses', () => {
    it('should get all courses', async () => {
      await Course.create({ subject: 'TEST', courseNumber: '101', description: 'Test Course 1' });
      await Course.create({ subject: 'TEST', courseNumber: '102', description: 'Test Course 2' });

      const res = await request(app).get('/api/courses');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
    });

    it('should retrieve a course by ID', async () => {
      const course = await Course.create({
        subject: 'CS',
        courseNumber: '101',
        description: 'Introduction to Computer Science',
      });

      const res = await request(app).get(`/api/courses/${course._id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.subject).toEqual('CS');
      expect(res.body.courseNumber).toEqual('101');
      expect(res.body.description).toEqual('Introduction to Computer Science');
    });

    it('should return 404 when retrieving a course with non-existent ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/courses/${nonExistentId}`);
      expect(res.statusCode).toEqual(404);
    });

    it('should return 400 when retrieving a course with invalid ID', async () => {
      const invalidId = '12345';
      const res = await request(app).get(`/api/courses/${invalidId}`);
      expect(res.statusCode).toEqual(400);
    });
  });

  // Tests for deleting courses
  describe('DELETE /api/courses/:id', () => {
    it('should delete a course', async () => {
      const course = await Course.create({
        subject: 'TEST',
        courseNumber: '101',
        description: 'Test Course',
      });

      const res = await request(app).delete(`/api/courses/${course._id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Course deleted');

      const deletedCourse = await Course.findById(course._id);
      expect(deletedCourse).toBeNull();
    });

    it('should not delete a non-existent course', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/courses/${nonExistentId}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toContain('Course not found');
    });

    it('should not delete a course with invalid ID', async () => {
      const invalidId = '12345';
      const res = await request(app).delete(`/api/courses/${invalidId}`);
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Invalid course ID');
    });
  });

  // Tests for searching courses
  describe('GET /api/courses/search', () => {
    it('should search courses by description with partial matches', async () => {
      await Course.create({
        subject: 'BIO',
        courseNumber: '101',
        description: 'Introduction to Biology',
      });
      await Course.create({
        subject: 'CHEM',
        courseNumber: '101',
        description: 'Introduction to Chemistry',
      });
      await Course.create({
        subject: 'MATH',
        courseNumber: '101',
        description: 'Calculus I',
      });

      const res = await request(app)
        .get('/api/courses/search')
        .query({ description: 'Intro' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
    });

    it('should handle special characters in search parameters safely', async () => {
      await Course.create({
        subject: 'PHYS',
        courseNumber: '101',
        description: 'Physics I',
      });

      const res = await request(app)
        .get('/api/courses/search')
        .query({ description: '.*' }); // Special regex characters
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(0);
    });

    it('should return all courses when searching with empty query parameters', async () => {
      await Course.create({
        subject: 'ENG',
        courseNumber: '101',
        description: 'English Literature',
      });
      await Course.create({
        subject: 'HIST',
        courseNumber: '101',
        description: 'World History',
      });

      const res = await request(app).get('/api/courses/search');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
    });

    it('should search courses by subject and courseNumber', async () => {
      await Course.create({
        subject: 'CS',
        courseNumber: '101',
        description: 'Intro to CS',
      });
      await Course.create({
        subject: 'CS',
        courseNumber: '102',
        description: 'Advanced CS',
      });
      await Course.create({
        subject: 'MATH',
        courseNumber: '101',
        description: 'Calculus I',
      });

      const res = await request(app)
        .get('/api/courses/search')
        .query({ subject: 'CS', courseNumber: '10' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
    });
  });

  // Tests for input validation and edge cases
  describe('Input Validation and Edge Cases', () => {
    it('should not create a course with non-numeric courseNumber', async () => {
      const res = await request(app)
        .post('/api/courses')
        .send({
          subject: 'TEST',
          courseNumber: 'ABC',
          description: 'Non-numeric Course Number',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain(
        'courseNumber must be a three-digit, zero-padded integer like "033".'
      );
    });

    it('should not create a course with courseNumber longer than three digits', async () => {
      const res = await request(app)
        .post('/api/courses')
        .send({
          subject: 'TEST',
          courseNumber: '1234',
          description: 'Too Long Course Number',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain(
        'courseNumber must be a three-digit, zero-padded integer like "033".'
      );
    });

    it('should return 400 when deleting a course with invalid ID format', async () => {
      const invalidId = 'invalid-id';
      const res = await request(app).delete(`/api/courses/${invalidId}`);
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Invalid course ID');
    });
  });
});
