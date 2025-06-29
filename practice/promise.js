let p=new Promise((resolve,reject)=>{
    let a=1+2;
    if(a==2)
    {
        resolve('success');
    }else{
        reject('failed');
    }
    
});

p.then((message)=>{
    console.log("this is in then "+message);
}).catch((message)=>{
    console.log("this is in the catch",message);
})

//pending,fullfilled,rejected


const cart=["sari","kurta","pants"];

creatOrder(cart,function(){
    prodeedToPayment(orderid);
    
});//orderid

