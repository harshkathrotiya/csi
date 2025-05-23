// Author:Harsh
const http=require('http');

http.createServer(function(req,res){
    res.writeHead(200,{'content-type':'text/html'});
    res.end("hello world");

}).listen(8000,()=>{
    console.log("server started on port 8000");
});