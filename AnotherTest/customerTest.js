const chai = require('chai');
const expect = chai.expect;
const should = chai.should();

const request = require('supertest');
const app = require('../index');
const url = "/api"



describe('Unit test customer', function() {

    function verifyCustomer(got, expected){
        got.firstname.should.equal(expected.firstname);
        got.lastname.should.equal(expected.lastname);
        got.loginInfo.username.should.equal(expected.loginInfo.username);
        got.loginInfo.email.should.equal(expected.loginInfo.email);
        got.should.have.property('_id');
        got.address.should.deep.equal(expected.address);
    }

    const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImNpYW8iLCJpZCI6ImFzZG9pMDE5MjNlYXNkIiwiaWF0IjoxNjMzNzAwOTY0LCJleHAiOjE2MzYzNzkzNjR9._cIrkGfajb6DbVFiSxD0wU8SUjZ3kI3-ojV8Fu_a0Kw";
    const authheader = {"Authorization": adminToken};

    async function postAuth(customer){
        return await (request(app).post(url + '/customers').set(authheader).send(customer));
    }

    async function getAuth(){
        return (await request(app).get(url + '/customers').set(authheader));
    }

    async function getAuthId(id){
        return (await request(app).get(url + '/customers/' + id).set(authheader));
    }

    async function patchAuth(id, customer){
        return  (await request(app).patch(url + '/customers/' + id).set(authheader).send(customer));
    }

    async function deleteAuth(id){
        return (await request(app).delete(url + '/customers/' + id).set(authheader));
    }

    let startingCustomers = [];

    const customer1 = {
        firstname: 'John',
        lastname: 'Smith',
        loginInfo: {
            username: 'customer1',
            password: 'odfaspodfkpqir091349857ashdfi',
            email: 'customer1@example.com',
        },
        dateOfBirth: Date.now(),
        address: {
            country: 'United States',
            city: 'New York',
            zipcode: '123',
            streetAddress: "5th avenue",
        }
    }

    const customer2 = {
        firstname: 'John',
        lastname: 'Smith',
        loginInfo: {
            username: 'Customer2',
            password: 'odfaspodfkpqir091349857ashdfi',
            email: 'customer2@example.com',
        },
        dateOfBirth: Date.now(),
        address: {
            country: 'United States',
            city: 'New York',
            zipcode: '123',
            streetAddress: "5th avenue",
        }
    }

    const customer3 = {
        firstname: 'John',
        lastname: 'Smith',
        loginInfo: {
            username: 'Customer3',
            password: 'odfaspodfkpqir091349857ashdfi',
            email: 'customer3@example.com',
        },
        dateOfBirth: Date.now(),
        address: {
            country: 'United States',
            city: 'New York',
            zipcode: '123',
            streetAddress: "5th avenue",
        }
    }

    const customer4 = {
        firstname: 'John',
        lastname: 'Smith',
        loginInfo: {
            username: 'customer4',
            password: 'odfaspodfkpqir091349857ashdfi',
            email: 'customer4@example.com',
        },
        dateOfBirth: Date.now(),
        address: {
            country: 'United States',
            city: 'New York',
            zipcode: '123',
            streetAddress: "5th avenue",
        }
    }

    const customer5 = {
        firstname: 'John',
        lastname: 'Smith',
        loginInfo: {
            username: 'customer5',
            password: 'odfaspodfkpqir091349857ashdfi',
            email: 'customer5@example.com',
        },
        dateOfBirth: Date.now(),
        address: {
            country: 'United States',
            city: 'New York',
            zipcode: '123',
            streetAddress: "5th avenue",
        }
    }

    it('GET /customers should return an array of customers', async function() {
        let req = await getAuth();
        let value = req.body;
        let statusCode = req.statusCode;
        startingCustomers = value;
        
        statusCode.should.equal(200);
        value.should.be.a("array");

    })

    it('POST /customers should create a customer on the db, then GET should return the customer, then DELETE should delete it', async function() {
        let req = await postAuth(customer1);
        let value = req.body;
        let statusCode = req.statusCode;
        let id = req.body._id;

        statusCode.should.equal(201);
        verifyCustomer(value, customer1)

        req = await getAuthId(id);
        value = req.body;
        statusCode = req.statusCode;

        verifyCustomer(value, customer1)
        statusCode.should.equal(200);

        req = await deleteAuth(id);
        value = req.body;
        statusCode = req.statusCode;

        verifyCustomer(value, customer1)       
        statusCode.should.equal(200);
    })

    it('DELETE /customers with a random id should return 404', async function() {
        let id = "616050300f33629454139b9a"
        let req = await deleteAuth(id);
        let value = req.body;
        let statusCode = req.statusCode;
        statusCode.should.equal(404);

        value.should.have.property('message');

    })

    it('DELETE /customers should return 400 with invalid id', async function() {
        let id = "!?:.!";
        let req = await deleteAuth(id);
        let value = req.body;
        let statusCode = req.statusCode;
        statusCode.should.equal(400);

        value.should.have.property('message');

    })

    it('GET /customers should return 404 with random id', async function() {
        let id = "616050300f55729454809b9a";
        let req = await getAuthId(id);
        let value = req.body;
        let statusCode = req.statusCode;
        statusCode.should.equal(404);

        value.should.have.property('message');

    })

    it('GET /customers should return the same customers as before the test', async function() {
        let req = await getAuth();
        let value = req.body;
        let statusCode = req.statusCode;

        value.should.deep.equal(startingCustomers);
        statusCode.should.equal(200);
    })

    it('PATCH /customers should modify a customer on the db created with POST1', async function() {
        let req = await postAuth(customer3);
        let id = req.body._id

        let modifiedCustomer = customer3;
        modifiedCustomer.loginInfo.username = "jjjjhon1";

        req = await patchAuth(id, modifiedCustomer);
        let value = req.body;
        let statusCode = req.statusCode;
        statusCode.should.equal(200);
        
        verifyCustomer(value, modifiedCustomer)

        await deleteAuth(id);
    })

    it('DELETE /customers should return 404 no customer with that id', async function() {
        let x = "507f191e810c19729de860ea"
        let req = await deleteAuth(x);
        let value = req.body;
        let statusCode = req.statusCode;

        value.should.have.property('message');

        statusCode.should.equal(404);
    })

    it('GET on bad uri /customers/wrongurl should return 400 ', async function() {
        //In questo caso get(/customers/wrongurl) viene indirizzato a get /customer/:id, 
        //quindi quando prova a castare wrongurl a objectId restituisce un errore

        let req = (await request(app).get(url + '/customers/wrongurl').set(authheader));
        let value = req.body;
        let statusCode = req.statusCode;
        statusCode.should.equal(400);
        value.should.have.property("message");
    })

    it('GET /customers/rentals should return an array', async function() {
        let diffLogin = customer4
        diffLogin.loginInfo = { 
            username: "alsddfsdf", 
            password: "alkdl<sdkg+e",
            email: "adfasdfasdf@gmail.com"
        }
        let req = await postAuth(customer4); 
        let value = req.body;
        let statusCode = req.statusCode;
        let oldId = value._id

        req = await (request(app).get(url + '/customers/'+ value._id + '/rentals').set(authheader));
        value = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(200);
        value.should.be.a("array");

        let elem0 = value[0];
        elem0.should.have.property("startdate");
        elem0.should.have.property("enddate");
        elem0.should.have.property("bill");

        req = await deleteAuth(oldId);
        value = req.body;
        statusCode = req.statusCode;
    })

    it('GET /customers/rentals with an non existant id should return 404', async function() {
        let x = "507f191e810c19729de860ea"
        let req = (await request(app).get(url + '/customers/' + x + '/rentals').set(authheader));
        let value = req.body;
        let statusCode = req.statusCode;

        statusCode.should.equal(404);
        value.should.have.property("message");
    })

    it('GET /customers/rentals with an invalid id should return 400', async function() {
        let req = (await request(app).get(url + '/customers/' + "!?%)" + '/rentals').set(authheader));
        let value = req.body;
        let statusCode = req.statusCode;

        statusCode.should.equal(400);
        value.should.have.property("message");
    })
    
    it('GET /customers/favorites should return an array', async function() {
        let diffLogin = customer5
        diffLogin.loginInfo = { 
            username: "testtest", 
            password: "alkdl<sdkg+e",
            email: "test1@gmail.com"
        }
        let req = await postAuth(diffLogin); 
        let value = req.body;
        let statusCode = req.statusCode;
        let oldId = value._id;

        req = (await request(app).get(url + '/customers/'+ value._id + '/favorites').set(authheader));
        value = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(200);
        value.should.be.a("array");

        let elem0 = value[0];
        elem0.should.have.property("name");
        elem0.should.have.property("description");
        elem0.should.have.property("image");
        elem0.should.have.property("category");


        req = await deleteAuth(oldId);
        value = req.body;
        statusCode = req.statusCode;
    })

    it('GET /customers/favorites with an non existant id should return 404', async function() {
        let x = "507f191e810c19729de860ea"
        let req = (await request(app).get(url + '/customers/' + x + '/favorites').set(authheader));
        let value = req.body;
        let statusCode = req.statusCode;

        statusCode.should.equal(404);
        value.should.have.property("message");
    })

    it('GET /customers/favorities with an invalid id should return 400', async function() {
        let req = (await request(app).get(url + '/customers/' + "!?%)" + '/favorites').set(authheader));
        let value = req.body;
        let statusCode = req.statusCode;

        statusCode.should.equal(400);
        value.should.have.property("message");
    })

    it('GET /customers with query should return max 1 customer', async function() {
        let usernameQuery = "prova";
        let req = (await request(app).get(url + '/customers?username=' + usernameQuery).set(authheader));
        let value = req.body;
        let statusCode = req.statusCode;

        statusCode.should.equal(200);
        value.should.be.a('array');
        value.should.have.lengthOf.below(2);
    })

    it('GET /customers with query should return the customer if it exist', async function() {
        const customerTest = {
            firstname: 'ProvaQuery',
            lastname: 'ProvaQuery21',
            loginInfo: {
                username: 'ProvaQuery--',
                password: 'asdkalsgfkodkgfoWDGF',
                email: 'ProvaQuery@example.com',
            },
            dateOfBirth: Date.now(),
            address: {
                country: 'United States',
                city: 'New York',
                zipcode: '123',
                streetAddress: "5th avenue",
            }
        }

        let req = await postAuth(customerTest);
        let value = req.body;
        let statusCode = req.statusCode;
        let oldId = value._id
                
        req = (await request(app).get(url + '/customers?username=' + customerTest.loginInfo.username).set(authheader));
        value = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(200);
        value.should.be.a('array');
        value.should.have.lengthOf(1);
        
        verifyCustomer(value[0], customerTest);

        req2 = (await request(app).get(url + '/customers?email=' + customerTest.loginInfo.email).set(authheader));
        value2 = req.body;
        statusCode2 = req.statusCode;

        statusCode2.should.equal(200);
        value2.should.be.a('array');
        value2.should.have.lengthOf(1);
        verifyCustomer(value2[0], customerTest);

        req3 = (await request(app).get(url + '/customers?email=' + customerTest.loginInfo.email + "&username=" + customerTest.loginInfo.username).set(authheader));
        value3 = req.body;
        statusCode3 = req.statusCode;

        statusCode3.should.equal(200);
        value3.should.be.a('array');
        value3.should.have.lengthOf(1);
        verifyCustomer(value3[0], customerTest);

        req = (await request(app).delete(url + '/customers/' + oldId).set(authheader));
    })

    it('GET,DELETE,PATCH /customers not authorized', async function() {
        let req = (await request(app).get(url + '/customers'));
        let value = req.body;
        let statusCode = req.statusCode;

        statusCode.should.equal(401);

        id = "61605244f27bfbee5b9e4de7"
        req = (await request(app).patch(url + '/customers/' + id));
        value = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(401);

        req = (await request(app).delete(url + '/customers/' + id));
        value = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(401);
    })

    it('DELETE /customers from customer with right id should pass', async function() {
        
        let req = await postAuth(customer2);
        let value = req.body;
        let statusCode = req.statusCode;
        let id = value._id;

        statusCode.should.equal(201);

        const auth = require("../public/lib/authentication");
        const userToken = await auth.generateToken("customers", value.loginInfo.username, id);

        req = (await request(app).delete(url + '/customers/' + id).set({"Authorization": userToken}));
        value = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(200);
    })
    
})