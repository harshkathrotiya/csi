const fs = require('fs');

fs.readFile('harsh.txt','utf8',(err, data)=> 
{
  if(err)
    {
    console.error('error reading file:',err);
    return;
  }
  console.log('file content- ',data);
});
