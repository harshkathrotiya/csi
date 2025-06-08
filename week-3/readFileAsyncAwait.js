const fs = require('fs').promises;

async function readFileAsync() 
{
  try 
  {
    const data = await fs.readFile('harsh.txt','utf8');
    console.log('file content:',data);
  } catch (err) 
  {
    console.error('error reading file:',err);
  }
}
readFileAsync();
