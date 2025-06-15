const express=require('express');
const app=express();

app.use((req,res,next)=>
    {
        console.log(`${new Date().toISOString()}-${req.method} ${req.url}`);
        next();
    });
    app.use(express.json());
    
    let users=
    [
        { id:1, name:'harsh'},
        { id: 2,name:'manav'},
    ];
    
    app.get('/',(req,res) =>
        {
            res.send('welcome to my server');
        });
        app.get('/users',(req, res)=>{
            res.json(users);
        });
        app.get('/users/:id',(req, res)=>
            {
                const userId=Number(req.params.id);
                const user=users.find(u=>u.id===userId);
                if (!user) 
                return res.status(404).json({ error:'user not found' });
                res.json(user);
            });
            
            app.post('/users',(req, res)=>{
                const { name }=req.body;
                if (!name) 
                    return res.status(400).json({ error:'name is required' });
                
                const newuser={ id: users.length + 1,name };
                users.push(newuser);
                res.status(201).json(newuser);
            });
            
            app.use((req, res)=>{
                res.status(404).send('sorry,that route does not exist.');
            });
            
            const PORT=3000;
            app.listen(PORT, ()=>{
                console.log(`server running on http://localhost:${PORT}`);
            });
            