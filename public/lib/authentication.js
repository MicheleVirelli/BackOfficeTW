const fs = require("fs").promises;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const validation = require('../lib/validation');


const authFileName = ".auth"
const authFilePath = global.rootDir + "/" + authFileName;
let privateKey = "";

initializeAuthentication();

async function initializeAuthentication() {
    try{
        data = await fs.readFile(authFilePath)
        if (data == ""){
            privateKey = crypto.randomBytes(256).toString('base64');
            try{
                await fs.writeFile(authFilePath, privateKey)
            } catch (err) {
                console.log(err);
            }
        } else{
            privateKey = data;
        }
    } catch (err){
        console.log(err);
    }

    //let token = await createToken("admin", "ciao", "asdoi01923easd");
   // console.log(token)
    //test(token);
}

//------------ Password hashing --------------------------------

async function hash(string) {
    return await bcrypt.hashSync(string, 5);
}

async function hashPassword(req, res, next) {
    try{
        if(req.body && req.body.loginInfo && req.body.loginInfo.password)
            req.body.loginInfo.password = await hash(req.body.loginInfo.password);
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
    next();
}

async function verifyCredential(loginInfoPassed, loginInfoExpected) {
    if(validation.validateEmail(loginInfoPassed.username) && loginInfoPassed.username == loginInfoExpected.email){
        return (await hash(loginInfoPassed.password)) == loginInfoExpected.password;
    } else if (loginInfoPassed.username == loginInfoExpected.username) {
        return (await hash(loginInfoPassed.password)) == loginInfoExpected.password;
    }

    return false;
}

//------------ Password hashing --------------------------------


//------------ Token handling --------------------------------

const authLevel = {
    admin: "admin",
    employee: "employee",
    customer: "customer",
    unregistered: "unregistered",
}

const authLevelDict = {
    "admin" : 4,
    "employee": 3,
    "customer": 2,
    "unregistered": 1,
}

async function generateToken(auth, username, id, expireTime = "31d"){
    const unsignedToken = {
        auth: auth,
        username: username,
        id: id,
    }

    const signedToken = await jwt.sign(unsignedToken, privateKey, {
        expiresIn: expireTime,
    });

    return signedToken;
}

function verifyAuth(requiredAuthLevel, checkId = false){
    return async function (req, res, next) {
        const token = req.headers["authorization"];
        if(!token) {
            return res.status(401).json({message: "Required authentication token"});
        }

        try{
            const decodedToken = await jwt.verify(token, privateKey);
            const authLevel = authLevelDict[decodedToken.auth]
            const id = decodedToken.id;

            if(authLevel >= authLevelDict[requiredAuthLevel] || (checkId && id == req.params.id)){
                next();
            } else{
                return res.status(401).json({message: "Authorization level not sufficient to do this operation"});
            }
        } catch(err){
            return res.status(401).json({message: "Invalid authentication token [" + err.message + "]"});
        }
    }
}

//------------ Token handling --------------------------------


module.exports.verifyCredential = verifyCredential;
module.exports.generateToken = generateToken;
module.exports.authLevel = authLevel;
module.exports.hashPassword = hashPassword;
module.exports.verifyAuth = verifyAuth;
module.exports.hash = hash;

