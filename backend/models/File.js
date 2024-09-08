const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    originalName: String,
    filePath: String,
    fileUrl: String,
    fileSize: Number, // Store file size in bytes
    mimeType: String, // Store MIME type
    uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
