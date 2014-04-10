## Real-time importer data from Redis to FatFractal.

Node.js application subscribed on redis channel. When message is received application got data from storage and save/update object into FatFractal.

### 1. Installation
Install all dependencies. Run command
```javascript
"npm install ."
```

### 2. Configuration
You can configure application via edit file 
```javascript
config/config.json
```

### 3. Running
Run application, for example run command 
```javascript
"node app.js"
```
