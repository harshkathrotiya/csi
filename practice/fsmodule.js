const { error } = require('console');
const fs=require('fs');

fs.writeFile("data.txt","hello from data file",(err)=>{
    if(err)
     {
         throw new Error(err);
     }   
    console.log("write operation success");
});

fs.readFile("data.txt",'utf-8',(err,data)=>{
    if(err)
    {
        throw new Error(err);
    }
    console.log(data);
});
try
{
    fs.writeFileSync("data1.txt","writen sync in file");
    console.log("file written success" );
}
catch(e){
    console.log(e);
}
try
{
    const data=fs.readFileSync("data1.txt",'utf-8');
    console.log(data);
}
catch(e){
    console.log(e);
}