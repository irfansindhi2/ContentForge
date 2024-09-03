const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const moment = require('moment');
const path = require('path');
const sharp = require('sharp');
const mime = require('mime-types');

async function uploadFileToR2(bucketName, fileBuffer, fileName) {
    const accountId = 'c70d7944d938833c501c72fd4221dbaf';
    const accessKeyId = 'e90d510ff8086c821165ba1d59616e2c';
    const secretAccessKey = 'c1ee934a720c9d4f167fe27ac3609ca662d2f53bc5a5a17d15d84ada7d3dc9e3';
    const caBundlePath = path.join(__dirname, 'cacert.pem');

    const s3Client = new S3Client({
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey
        },
        region: 'auto',
        forcePathStyle: true, // Required for R2
        requestHandler: {
            httpsAgent: new require('https').Agent({
                ca: fs.readFileSync(caBundlePath)
            })
        }
    });

    // Detect the MIME type based on the file extension
    const mimeType = mime.lookup(fileName)

    // Compress the image using the compressImage utility function
    const compressedBuffer = await compressImage(fileBuffer);

    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: compressedBuffer,
        ContentType: mimeType
    };

    try {
        const result = await s3Client.send(new PutObjectCommand(params));
        console.log(`File uploaded successfully. ETag: ${result.ETag}`);
        return result;
    } catch (error) {
        console.error('Error uploading file:', error.message);
        throw error;
    }
}

/**
 * Compresses an image using sharp.
 *
 * @param {Buffer} fileBuffer - The buffer of the image file to be compressed.
 * @param {number} width - The desired width of the compressed image.
 * @param {number} height - The desired height of the compressed image.
 * @param {number} quality - The quality of the compressed image (0-100).
 * @returns {Promise<Buffer>} - The buffer of the compressed image.
 * @throws {Error} - If compression fails.
 */
async function compressImage(fileBuffer, width = 800, height = 800, quality = 80) {
    try {
        const compressedBuffer = await sharp(fileBuffer)
            .resize(width, height, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .jpeg({ quality })
            .toBuffer();

        return compressedBuffer;
    } catch (error) {
        console.error('Error during image compression:', error.message);
        throw error;
    }
}

/**
 * Formats fields designated as dates in the JSON object based on metadata specifying which fields are dates.
 *
 * @param {Object} data - The JSON object containing data from the database.
 * @param {Array} allActiveColumns - List of all active columns with input types.
 * @returns {Object} - The JSON object with date fields formatted.
 */
function formatDatesInJson(data, allActiveColumns) {
    const formattedData = { ...data };
  
    // Iterate over each column to find which ones have the input type 'Date'
    allActiveColumns.forEach(columnDetail => {
      const { columnName, inputType } = columnDetail;
  
      // If the column's input_type is 'Date', format the value
      if (inputType === 'Date') {
        const value = data[columnName];
  
        if (value && !isNaN(Date.parse(value))) {
          // Format the date to the desired format (YYYY-MM-DD HH:mm:ss)
          formattedData[columnName] = new Date(value).toISOString().slice(0, 19).replace('T', ' ');
        }
      }
    });
  
    return formattedData;
  }


function generateImageFilename(originalFilename) {
    const date = new Date();
    
    // Format the date and time in the desired format: dd-mm-yyyy-hh-mm-ss-am/pm
    let formattedDate = date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).replace(/[\/\s:]/g, '-').toLowerCase();
  
    // Remove any commas that might be present
    formattedDate = formattedDate.replace(/,/g, '');

    // Generate a random 7-digit number
    const randomNum = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  
    // Get the file extension
    const ext = path.extname(originalFilename);
  
    // Construct the final filename
    return `${formattedDate}-${randomNum}${ext}`;
}

module.exports = { uploadFileToR2, formatDatesInJson, generateImageFilename };