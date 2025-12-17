const fs = require('fs');

let handlerFunction = (req, res) => {

  if (req.url === '/' ) {
    fs.readFile('message.txt','utf8', (err, data) => {
      const messages = data ? data.split('\n').filter(Boolean).reverse() : [];

     const messageList = messages.map(msg => `<p>${msg}</p>`).join('');


      res.setHeader('Content-Type', 'text/html');
      res.end(`
        <html>
          <head>
            <title>Messages</title>
          </head>
          <body>
            <h2>Messages</h2>
            ${messageList}
            <hr/>
            <form action="/message" method="POST">
              <input type="text" name="message" />
              <button type="submit">Send</button>
            </form>
          </body>
        </html>
      `);
    });
  }

  else if (req.url === '/message') {
    const body = [];

    req.on('data', chunk => body.push(chunk));
    console.log(body);

    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];

      fs.appendFile('message.txt', message + '\n', () => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end();
      });
    });
  }

  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Page Not Found</h1>');
  }

};


module.exports = handlerFunction;