import mongoose from 'mongoose';

const category = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
});

const catVar = mongoose.model('categoryInfo', category);

export default catVar;