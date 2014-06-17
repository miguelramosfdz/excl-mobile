Using the customCalls API
===========================
<br><br>
Instead of using Titanium native calls like 'Ti.API.info(someObject)', use the custom API so that it's easier to mock out all the titanium calls, and that makes unit testing a lot easier!
<br><br>
Example:
```html
var apiCalls = require('../lib/customCalls/apiCalls');
var networkCalls = require('../lib/customCalls/networkCalls');
var parseCalls = require('../lib/customCalls/parseCalls');
```
Instead of
```html
Ti.API.info(someobject);
```
use:
```html
apiCalls.info(someobject);
```
<br><br>
Checkout 'apiCalls.js', 'networkCalls.js', and 'parseCalls.js' (under lib/customCalls) to see which Titanium calls are ready to be mocked out.