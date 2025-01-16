import http from 'http';
http.createServer((req,res) => {
    let path = req.url.toLowerCase();    
    switch(path) {
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(`
                <h1 style="text-align: center;">Welcome to Ella Yu\'s Homepage</h1>
                <ul>
                    <li><a href="/about">About Me</a></li>
                    <li><a href="/contact">Contact Me</a></li>
                </ul>   
                `);
            break;
        case '/about':
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(`
                <h1>About me</h1>
                <ul>
                    <li><a href="http://127.0.0.1:3000/">Home</a></li>
                    <li><a href="/contact">Contact Me</a></li>
                </ul>  
                <p>Ella Yu is a student at Seattle Central College. This page was created for her IT 122 course.<p>
                `);
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end(`
                <h1>404</h1>
                <h2>Page not found.</h2>
                <p>Return to <a href="http://127.0.0.1:3000/">home page</a>?</p>
                `);
            break;
    }    
}).listen(process.env.PORT || 3000);

console.log('Server running at http://127.0.0.1:3000/');

