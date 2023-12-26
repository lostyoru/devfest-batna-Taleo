const multer = require('multer');

function imageUpload() {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            if(!file) return;
            cb(null, './uploads');
        },
    
        filename: (req, file, cb) => {
            if(!file) return;
            cb(null,
                new Date().toISOString().replaceAll('/', '-').replaceAll(':', '-') + req.originalname
            );
        }
    });

    let upload = multer({ storage: storage });
    return upload.single('image');
};

module.exports = imageUpload;
