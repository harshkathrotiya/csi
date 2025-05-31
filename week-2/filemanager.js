const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');


const baseDir=path.join(__dirname,'files');

if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
}

const server=http.createServer((req,res)=>{
    const parsedUrl=url.parse(req.url,true);
    const {pathname, query}=parsedUrl;

    const filePath=path.join(baseDir,query.filename||'');

    res.setHeader('Content-Type','text/plain');

    if (pathname==='/create') 
        {
        if (!query.filename||!query.content){
            res.statusCode=400;
            return res.end('missing filename or content');
        }
        fs.writeFile(filePath,query.content, (err)=> {
            if (err){
                res.statusCode=500;
                return res.end('Error creating file');
            }
            res.end(`File '${query.filename}' created successfully`);
        });

    } 
    else if (pathname==='/read') 
    {
        if (!query.filename) 
            {
            res.statusCode=400;
            return res.end('missing filename');
        }

        fs.readFile(filePath,'utf8',(err, data)=>{
            if (err) {
                res.statusCode = 404;
                return res.end('file not found');
            }
            res.end(`contents of '${query.filename}':\n\n${data}`);
        });

    } 
    else if (pathname ==='/delete') 
    {
        if (!query.filename) {
            res.statusCode = 400;
            return res.end('missing filename');
        }

        fs.unlink(filePath,(err)=>{
            if (err)
            {
                res.statusCode=404;
                return res.end('file not found');
            }
            res.end(`File '${query.filename}' deleted successfully`);
        });

    } 
    else 
    {
        res.statusCode = 404;
        res.end('route not found.use /create,/read,or/delete');
    }
});

const PORT=3000;
server.listen(PORT,()=>{
    console.log(`server running at http://localhost:${PORT}`);
});
