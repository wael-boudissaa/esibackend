const { storage } = require("../storage/storage");
const multer = require("multer");
const upload = multer({ storage });

export default upload;
interface MulterRequest extends Request {
  file: any;
}

// const app: Express = express();
// const uploadMiddleware = (next: NextFunction) => {
//   upload.single("image");
//   next();
// };

// // Middleware to handle file upload
// // export const test = async () => {

// // };

// // Export the middleware function
// export default uploadMiddleware;
