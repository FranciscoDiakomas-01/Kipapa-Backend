import fs from 'node:fs'
import path from 'node:path'
import { Client } from 'pg'
export default async function RunnMigrations( db : Client) {
    const currentDir = process.cwd()
    console.log('starting running migrations at : ' + Date.now())
    fs.readdir(path.join(currentDir + '/src/database/migrations'), async(err, files) => {
            if (err) {
                console.log(err)
            } else {
                files.forEach(async(file) => {
                    const content = await fs.readFileSync(path.join(currentDir + '/src/database/migrations/' + file))
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