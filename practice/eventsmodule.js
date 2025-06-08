const EventEmitter=require('events'); //this is class 

const emitter=new EventEmitter(); //emitter is an object emitter has different methods 
//register listner
emitter.on('messageLogged',()=>{
    console.log("listner called");
})
//emit is use for the raise event
//raised event but we need listner listner is function that we call when event is raised
emitter.emit('messageLogged');


