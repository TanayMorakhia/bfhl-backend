const express = require('express');
const cors = require('cors'); // Import CORS
const multer = require('multer');
const mime = require('mime-types');
const bodyParser = require('body-parser');

const app = express();

const corsOptions = {
    origin: 'https://bfhl-frontend-9rww.vercel.app', // Replace with your frontend URL in production
    methods: 'GET,POST',
    optionsSuccessStatus: 200 // For older browsers
};

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: '10mb' })); 


// const validateFile = (file_b64) => {
//     if (!file_b64) return { isValid: false, mimeType: null, fileSizeKB: 0 };

//     try {
//         const buffer = Buffer.from(file_b64, 'base64'); // Decode the base64 string
//         const fileSizeKB = (buffer.length / 1024).toFixed(2); // File size in KB

//         // Check for a valid MIME type using the first few bytes (magic numbers)
//         const mimeType = mime.lookup(buffer.slice(0, 4));
//         if (!mimeType) return { isValid: false, mimeType: null, fileSizeKB };

//         return { isValid: true, mimeType, fileSizeKB };
//     } catch (err) {
//         return { isValid: false, mimeType: null, fileSizeKB: 0 };
//     }
// };

const validateFile = (fileB64) => {
    if (!fileB64) {
        return {
            file_valid: false,
            file_mime_type: null,
            file_size_kb: null
        };
    }

    // Decode the base64 string and validate
    const buffer = Buffer.from(fileB64, 'base64');
    const fileSizeKB = buffer.length / 1024; // Size in KB
    let mimeType = '';

    // MIME type detection (simplified for example)
    if (fileB64.startsWith('/9j')) {
        mimeType = 'image/jpeg';
    } else if (fileB64.startsWith('iVBORw0KGgo')) {
        mimeType = 'image/png';
    } else if (fileB64.startsWith('JVBERi0xLj')) {
        mimeType = 'application/pdf';
    } else {
        mimeType = 'unknown';
    }

    return {
        file_valid: mimeType !== 'unknown',
        file_mime_type: mimeType,
        file_size_kb: fileSizeKB.toFixed(2)
    };
};

// POST /bfhl
app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;
    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item));
    const lowercase = alphabets.filter(char => char === char.toLowerCase());
    const highestLowercase = lowercase.sort().pop() || null;

    // File validation
    const { isValid, mimeType, fileSizeKB } = validateFile(file_b64);

    const response = {
        "is_success": true,
        "user_id": "tanay_morakhia_26102003", // Example user_id
        "email": "tm9047@srmist.edu.in",
        "roll_number": "RA2111003030354",
        "numbers": numbers,
        "alphabets": alphabets,
        "highest_lowercase_alphabet": highestLowercase ? [highestLowercase] : [],
        "file_valid": isValid,
        "file_mime_type": mimeType || "unknown",
        "file_size_kb": fileSizeKB
    };

    const response2 = {
        "is_success": true,
        "user_id": "tanay_morakhia_26102003", // Example user_id
        "email": "tm9047@srmist.edu.in",
        "roll_number": "RA2111003030354",
        "numbers": numbers,
        "alphabets": alphabets,
        "highest_lowercase_alphabet": highestLowercase ? [highestLowercase] : [],
        "file_valid": isValid
    };

    if(isValid){
        res.json(response);
    }else{
        res.json(response2);    
    }
});


// GET /bfhl
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
