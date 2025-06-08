const fs = require('fs').promises;

fs.readFile('harsh.txt','utf8')
  .then(data=>{
    console.log('file content:',data);
  })
  .catch(err=> 
    {
    console.error('error reading file:',err);
  });
