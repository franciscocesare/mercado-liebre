const path = require('path');
const multer = require('multer');

const avatar = path.join(__dirname, '../public/images/avatars');
const imageProduct = path.join(__dirname, '../public/images/products');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'avatar') {
            cb(null, avatar);
        } else if (file.fieldname === 'image') {
            cb(null, imageProduct);
        }
    },
    filename: (req, file, cb) => {
        if (file.fieldname === 'avatar') {
            let nameFile = `avatar-${Date.now()}-${file.originalname}` 
            cb(null, nameFile);
        } else if (file.fieldname === 'image') {
            let nameFile = `img-${Date.now()}-${file.originalname}` 
            cb(null, nameFile);
        }
    }
});
const upload = multer({ storage: storage }); 

module.exports = upload;
