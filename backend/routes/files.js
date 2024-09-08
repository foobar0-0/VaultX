const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const File = require('../models/File'); // Import File model

dotenv.config();

const router = express.Router();

// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});

// Configure multer
const storage = multer.memoryStorage(); // Use memory storage to handle files in-memory
const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// File upload route
router.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    try {
        const data = await s3.upload(params).promise();

        // Save file metadata to MongoDB
        const newFile = new File({
            originalName: file.originalname,
            filePath: params.Key,
            fileUrl: data.Location,
            fileSize: file.size,  // Store file size
            mimeType: file.mimetype // Store MIME type
        });

        await newFile.save();

        console.log('File uploaded successfully:', data.Location);
        res.status(200).send(`File uploaded successfully: ${data.Location}`);
    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).send('Error uploading file.');
    }
});

// Get all files route
router.get('/files', async (req, res) => {
    try {
        // Fetch all file metadata from MongoDB
        const files = await File.find({});
        const fileList = files.map(file => ({
            key: file.filePath,
            originalName: file.originalName,
            fileUrl: file.fileUrl,
            uploadDate: file.uploadDate,
            fileSize: file.fileSize,
            mimeType: file.mimeType
        }));

        res.json(fileList);  // Return the file list with complete metadata
    } catch (err) {
        console.error('Error fetching files:', err);
        res.status(500).json({ error: 'Error fetching file list' });
    }
});

// Delete file route
router.delete('/files/:key', async (req, res) => {
    const fileKey = req.params.key;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
    };

    try {
        // Delete the file from S3
        await s3.deleteObject(params).promise();

        // Delete the file metadata from MongoDB
        await File.findOneAndDelete({ filePath: fileKey });

        res.json({ message: 'File deleted successfully' });
    } catch (err) {
        console.error('Error deleting file:', err);
        res.status(500).json({ message: 'Failed to delete file' });
    }
});

// Add route for file download (optional)
router.get('/files', async (req, res) => {
    try {
        // Fetch all file metadata from MongoDB
        const files = await File.find({});
        const fileList = files.map(file => ({
            originalName: file.originalName,
            fileUrl: file.fileUrl,
            uploadDate: file.uploadDate,
            fileSize: file.fileSize,
            mimeType: file.mimeType
        }));

        res.json(fileList);  // Return the file list with complete metadata
    } catch (err) {
        console.error('Error fetching files:', err);
        res.status(500).json({ error: 'Error fetching file list' });
    }
});


//File storgae info
router.get('/storage', async (req, res) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        let totalSize = 0;

        data.Contents.forEach(file => {
            totalSize += file.Size;
        });

        const totalStorage = 10 * 1024 * 1024 * 1024; // 10 GB in bytes
        const usedStoragePercentage = (totalSize / totalStorage) * 100;

        res.json({ 
            totalSize, 
            totalStorage, 
            usedStoragePercentage 
        });
    } catch (err) {
        console.error('Error fetching storage information:', err);
        res.status(500).json({ error: 'Error fetching storage information' });
    }
});


module.exports = router;
