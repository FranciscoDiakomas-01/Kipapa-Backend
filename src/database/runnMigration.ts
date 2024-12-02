import fs from 'node:fs'
import path from 'node:path'
import { Pool } from 'pg'
export default async function RunnMigrations( db : Pool) {
    const currentDir = __dirname
    console.log('starting running migrations at : ' + Date.now())
    fs.readdir(path.join(currentDir + '/Sql'), async(err, files) => {
            if (err) {
                console.log(err)
            } else {
                files.forEach(async(file) => {
                    const content = await fs.readFileSync(path.join(currentDir + '/Sql/' + file))
                    await db.query(content.toString(), (err, result) => {
                        if (err) {
                            console.log('Error Runnig migration ' + file + '  Error : ' + err?.message);
                        } 
                    });
                })
            }
    })
    console.log("fininhing running migrations at : " + Date.now()) 
}