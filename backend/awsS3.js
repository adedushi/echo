const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const e = require("express");
const multer = require("multer");
const NAME_OF_BUCKET = "teamlab-echo";

const singleFileUpload = async ({ file, isPublic = false }) => {
    if (!file) {
        return
    }
    const { originalname, buffer } = file;
    const path = require("path");

    const Key = new Date().getTime().toString() + path.extname(originalname);
    const params = {
        Bucket: NAME_OF_BUCKET,
        Key: isPublic ? `public/${Key}` : Key,
        Body: buffer
    };
    const client = new S3Client({});

    try {
        const parallelUploadS3 = new Upload({ client, params });
        parallelUploadS3.on("httpUploadProgress", (progress) =>
            console.log(progress)
        );
        const result = await parallelUploadS3.done();

        return isPublic ? result.Location : result.Key;
    } catch (err) {
        console.log(err);
        return null
    }
};

// const multipleFilesUpload = async ({ files, isPublic = false }) => {
//     return await Promise.all(
//         files.map((file) => {
//             return singleFileUpload({ file, isPublic });
//         })
//     );
// };

module.exports = {
    singleFileUpload,
    // multipleFilesUpload
};

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, "");
    },
});

const singleMulterUpload = (nameOfKey) => {
    const file = multer({ storage: storage }).single(nameOfKey);
    if (file) {
        return file
    } 
}


// const multipleMulterUpload = (nameOfKey) =>
//     multer({ storage: storage }).array(nameOfKey);

module.exports = {
    singleFileUpload,
    // multipleFilesUpload,
    // retrievePrivateFile,
    singleMulterUpload,
    // multipleMulterUpload
};