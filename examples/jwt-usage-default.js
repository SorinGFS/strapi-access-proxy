'use strict';

const JwtHost = require('../base/jwt/host');
let accessToken, refreshToken;

const jwtHost = new JwtHost({});

accessToken = jwtHost.sign({ id: '5f3f801dd5649218e47127fe', whatever: 'something' });
refreshToken = jwtHost.refresh(accessToken);

console.log(jwtHost.decode(accessToken, { complete: true }));
console.log(accessToken);

console.log(jwtHost.decode(refreshToken, { complete: true }));
console.log(refreshToken);

try {
    console.log(jwtHost.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmM2Y4MDFkZDU2NDkyMThlNDcxMjdmZSIsIndoYXRldmVyIjoic29tZXRoaW5nIiwiaWF0IjoxNTk5NjQ1MzUxLCJleHAiOjE1OTk2NDcxNTEsImlzcyI6InZlY3RvciJ9.L6MmsldqqIPCvz5Uoaptxw5TFkKsTKh9xZ0_GXQda0M'));
} catch (error) {
    console.log(error.message);
}
try {
    console.log(jwtHost.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmM2Y4MDFkZDU2NDkyMThlNDcxMjdmZSIsIndoYXRldmVyIjoic29tZXRoaW5nIiwiaWF0IjoxNTk5NjU0ODM4LCJleHAiOjE2MDIyNDY4MzgsImlzcyI6InZlY3RvciJ9.jebTxLAeDBunTMI1E2NADpFh94iErXLoWrV9LnTQ3nc'));
} catch (error) {
    console.log(error.message);
}
try {
    console.log(jwtHost.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmM2Y4MDFkZDU2NDkyMThlNDcxMjdmZSIsImlhdCI6MTU5OTQwNTY2OSwiZXhwIjoxNTk5NDE1NjY5fQ.3g4Og2-ExaqHfIlYplwt3VrPVLeYYtHzoLp_fQuOPLs', { complete: true }));
} catch (error) {
    console.log(error.message);
}
