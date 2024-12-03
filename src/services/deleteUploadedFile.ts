import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
dotenv.config()

export default async function deleteUpLoadedFile( URL : string ){
  console.log(process.cwd())
  console.log(__dirname)
  if (fs.existsSync((__dirname + '/uploads'))) {
    console.log("A pasta existe!");
  } else {
    console.log("A pasta não existe.");
  }

  if (fs.existsSync(process.cwd() + "/uploads")) {
    console.log("A pasta existe!");
  } else {
    console.log("A pasta não existe.");
  }

    fs.readdir(path.join(__dirname + "uploads/"), (err, files) => {
      if (err) {
        process.exit(1);
      } else {
        files.forEach((file) => {
          const fileURL = process.env.SERVER_PATH + file;
          if (fileURL == URL) {
            fs.unlinkSync(path.join(__dirname + "uploads/" + file));
            return;
          }
        });
      }
    });
}