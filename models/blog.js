var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({

      blogId: {
            type: String,
            default: ''
      },
      userId: {
            type: String,
            default: ''
      },
      blogHeading: {
            type: String,
            default: ''
      },
      blogDescription: {
            type: String,
            default: ''
      },
      author: {
            type: String,
            default: ''
      },
      created: {
            type: Date,
            default: ''
      },
      lastModified: {
            type: Date,
            default: ''
      },
      imageUrl: {
            type: String,
            dafault: ''
      },
      tags: [],
      status: {
            type: String,
            default: true
      } // false for soft delete 
});

mongoose.model('Blog', blogSchema);