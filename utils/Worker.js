

addEventListener('message', (event) =>{
    console.log(event.data);
})


setInterval(() => {
    postMessage("go on")
}, 10000);



// 1800000
