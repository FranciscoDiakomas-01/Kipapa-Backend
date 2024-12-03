import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
dotenv.config()

export default async function deleteUpLoadedFile( URL : string ){
    fs.readdir(path.join(process.cwd() + "uploads/"), (err, files) => {
      if (err) {
        process.exit(1);
      } else {
        files.forEach((file) => {
          const fileURL = process.env.SERVER_PATH + file;
          if (fileURL == URL) {
            fs.unlinkSync(path.join(process.cwd() + "uploads/" + file));
            return;
          }
        });
      }
    });
}