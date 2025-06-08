const http=require('http');
const fs=require('fs');
const port=3000;

const server=http.createServer((req,res)=>{
    res.writeHead(200,{ 'content-type':'text/html'});
    fs.readFile('index.html',(err,data)=>{
        if(err){
            res.writeHead(400);
            res.write('Error : file not found');
        }else{
            res.write(data);
        }
        res.end();
    });
   
});

server.listen(port,(err)=>{
    if(err)
    {
        console.log("some thing went wrong",err);
    }else{
        console.log("server is running in port "+port);
    }
});