const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  courseNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{3}$/.test(v);
      },
      message: props => `${props.value} is not a valid course number. It must be a three-digit number.`
    }
  },
  description: {
    type: String,
    required: true,
  }
});

courseSchema.index({ subject: 1, courseNumber: 1 }, { unique: true });

module.exports = mongoose.model('Course', courseSchema);