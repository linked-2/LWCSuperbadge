// const http = require('http');
// const port = 3000;

// // use http.createServer() to create a new instance of http.server
// const server = http.createServer((res, req) => {
//     // Define the callback function that handles incoming requests
//     res.statusCode = 200;
//     res.setHeader('Content-Type','text/plain');
//     res.end = ('Welcome!'); 
// });

// // Use the server.listen method to start the server listening for connections
// server.listen(port, () =>{
//     console.log(`Server listening at port ${port}`);
// });

// const http = require('http');
// const port = 3000;
// const requestListener = (req, res) => {
//     res.statusCode= 200;
//     res.end(getUsers());
// }


// const server = http.createServer(requestListener);

// // // Use the server.listen method to start the server listening for connections

// server.listen(port, () => {
//     console.log(`listening on port ${port}`);
// });

// function getUsers(){
//     return 'Ashley, John and Olivia'
// }

const http = require('http');
const port = 3000;

const options = {
    hostname: 'jsonplaceholder.typicode.com', 
    path: '/todos/1', 
    method: 'GET', 
    headers: {'Content-Type': 'application/json'}
};
const req = http.request(options, res => {
    console.log(`statuscode: ${res.statusCode}`);

    res.on('data', d => {process.stdout.write(d);
    })
});

req.on('error', error => {
    console.log(error);
})

req.end();