# yaml-config

Manage your configuration based on NODE_ENV, all configuration defined with yaml. Shared configuration can be put under `default` key, different settings under each enviroment name.

## Installation

    $ npm install yaml-config

## Usage

In the setting file at `config/app.yaml`

```yaml
default:
  redis:
    port: 6379                # redis server port
    host: '127.0.0.1'         # redis host
    password: ''              # to use with AUTH
    db: 1                     # the test db
    options: {}
test:
  redis:
    db: 12
production:
  redis:
    db: 0
  new_prop:
    hello: 'world'
```

In your source code

```javascript
var config = require('yaml-config');
var settings = config.readConfig('./config/app.yaml'); // path from your app root without slash
console.log(settings.redis.db); // if NODE_ENV is development, prints 1
```

The `readConfig()` function takes a second parameter as enviroment name, for example

```javascript
var settings = config.readConfig('./config/app.yaml', 'test');
console.log(settings.redis.db); // prints 12
```
The `updateConfig()` function will take current settings and save them back to the configuration file
```javascript
var settings = config.readConfig('./config/app.yaml', 'production');
console.log(settings.redis.db); // prints 12
settings.redis.db = 10;
updateConfig(settings, './config/app.yaml', 'production'); //Save 10 to redis.db of the 'production' section
updateConfig({},'./config/app.yaml', 'production'); //Will remove the entire 'production' section
```

If the settings are used in multiple files, you may want to put the loading code in a seperate file and require it when used, so that config file will be loaded only once.

## License

(The MIT License)

Copyright (c) 2011 Rakuraku Jyo &lt;jyo.rakuraku@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
