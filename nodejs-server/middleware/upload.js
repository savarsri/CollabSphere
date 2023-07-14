var fs = require('fs');

const path = require('path')
const multer = require('multer')

// var storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// var upload = multer ({
//   storage: storage,
//   fileFilter: function(req,file,callback){
//       if(
//           file.mimetype == "image/png" ||
//           file.mimetype == "image/jpg"
//       ){
//           callback(null, true)
//       } else{
//           console.log('only jpg or png')
//           callback(null, true)
//       }
//   },
//       limits:{
//               filesize:1024*1024*2
//       }
// })

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const directory = `../uploads/`

      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true })
      }

      cb(null, directory)
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  })
})

var mkdirectory = (teamID) => {
 
    
    var path1 = `./files/${teamID}/files`;
    var path2 = `./files/${teamID}/assignments`;
    var path3 = `./files/${teamID}/posts`;
    
  fs.access(path1, (error) => {
    
    // To check if given directory 
    // already exists or not
    if (error) {
      // If current directory does not exist then create it
      fs.mkdir(path1, { recursive: true }, (error) => {
        if (error) {
          console.log(error);
        } else {
          // console.log("New Directory created successfully !!");
          // console.log(path1)
        }
      });
    } else {
      // console.log("Given Directory already exists !!");
    }
  });

  fs.access(path2, (error) => {
    
    // To check if given directory 
    // already exists or not
    if (error) {
      // If current directory does not exist then create it
      fs.mkdir(path2, { recursive: true }, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("New Directory created successfully !!");
          console.log(path2)
        }
      });
    } else {
      console.log("Given Directory already exists !!");
    }
  });

  fs.access(path3, (error) => {
    
    // To check if given directory 
    // already exists or not
    if (error) {
      // If current directory does not exist then create it
      fs.mkdir(path3, { recursive: true }, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("New Directory created successfully !!");
          console.log(path3)
        }
      });
    } else {
      console.log("Given Directory already exists !!");
    }
  });
  
  }



module.exports = {upload, mkdirectory}