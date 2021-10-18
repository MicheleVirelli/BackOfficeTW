const chai = require('chai');
const expect = chai.expect;
const should = chai.should();

chai.use(require("chai-things"));
chai.use(require('chai-exclude'));

const request = require('supertest');
const app = require('../index');
const url = "/api/products/"



describe('Unit test product api', function () {

    function verify(got, expected) {
        expect(got).excluding(['_id', '__v']).to.deep.equal(expected);

        /*got.name.should.equal(expected.name);
        got.description.should.equal(expected.description);
        got.image.should.equal(expected.image);
        got.category.should.equal(expected.category);
        got.subcategory.should.equal(expected.subcategory);
        got.tags.should.deep.equal(expected.tags);


        console.log("got: ", got, "expected: ", expected);
        got.altproducts.should.deep.equal(expected.altproducts);*/
    }

    function shouldContain(arr, obj) {
        expect(arr).excluding(['_id', '__v']).to.include.something.that.deep.equals(obj);
    }

    function shouldNotContain(arr, obj) {
        expect(arr).excluding(['_id', '__v']).to.not.include.something.that.deep.equals(obj);
    }

    const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImNpYW8iLCJpZCI6ImFzZG9pMDE5MjNlYXNkIiwiaWF0IjoxNjMzNzAwOTY0LCJleHAiOjE2MzYzNzkzNjR9._cIrkGfajb6DbVFiSxD0wU8SUjZ3kI3-ojV8Fu_a0Kw";
    const authheader = { "Authorization": adminToken };

    async function postAuth(prod) {
        return await (request(app).post(url).set(authheader).send(prod));
    }

    async function getAuth() {
        return (await request(app).get(url).set(authheader));
    }

    async function getAuthId(id) {
        return (await request(app).get(url + id).set(authheader));
    }

    async function patchAuth(id, customer) {
        return (await request(app).patch(url + id).set(authheader).send(customer));
    }

    async function deleteAuth(id) {
        return (await request(app).delete(url + id).set(authheader));
    }

    it('GET should return an array of product', async function () {
        let req = await getAuth();
        let value = req.body;
        let statusCode = req.statusCode;

        statusCode.should.equal(200);
        value.should.be.a("array");

    })

    it('POST should return the posted object and post it on the db', async function () {
        const prod = {
            name: "ProdottoTest1",
            description: "Descrizione test",
            image: "/urldiprova/image1.png",
            category: "Auto",
            subcategory: "Lusso",
            tags: [
                { key: "Marca", value: "bmw" },
                { key: "Colore", value: "Oro" },
            ],
            altproducts: [],
        }

        let req = await postAuth(prod);
        let value = req.body;
        let statusCode = req.statusCode;
        let id = value._id;

        statusCode.should.equal(201);
        verify(value, prod);

        req = await getAuth()
        value = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(200);
        shouldContain(value, prod);

        req = await deleteAuth(id);
        req.statusCode.should.equal(200);
    })

    it('POST with an object that is not a product should return an error', async function () {
        const wrongProd = {
            name: "ProdottoTest1",
            image: "/urldiprova/image1.png",
            tags: [
                { key: "Marca", value: "bmw" },
                { key: "Colore", value: "Oro" },
            ],
            wrongattr: [],
        }

        let req = await postAuth(wrongProd);
        let value = req.body;
        let statusCode = req.statusCode;
        let id = value._id;
        statusCode.should.equal(400);

        req = await getAuth()
        value = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(200);
        shouldNotContain(value, wrongProd);
    })

    it('PATCH should change the product in the db', async function () {
        const prod = {
            name: "ProdottoTest2",
            description: "Descrizione test2",
            image: "/urldiprova/image1.png",
            category: "Auto",
            subcategory: "Lusso",
            tags: [
                { key: "Marca", value: "bmw" },
            ],
            altproducts: [],
        }

        const patched = {
            name: "ProdottoTest2",
            description: "descrizione aggiornata",
            image: "/urldiprova/immagine-nuova.png",
            category: "Auto",
            subcategory: "Lusso",
            tags: [
                { key: "Marca", value: "bmw" },
            ],
            altproducts: [],
        }

        let req = await postAuth(prod);
        let value = req.body;
        let statusCode = req.statusCode;
        let id = value._id;
        statusCode.should.equal(201);
        verify(value, prod);

        req = await patchAuth(id, patched);
        value = req.body;
        statusCode = req.statusCode;
        statusCode.should.equal(200);
        verify(value, patched);

        req = await getAuth()
        value = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(200);
        shouldContain(value, patched);
        shouldNotContain(value, prod);

        req = await deleteAuth(id);
        req.statusCode.should.equal(200);

    })

    it("GET, POST, DELETE /units shoudl return an array of units, post a new unit and delete a specifi unit", async function () {
        const prod = {
            name: "ProdottoTest4",
            description: "Descrizione test",
            image: "/urldiprova/image1.png",
            category: "Auto",
            subcategory: "Lusso",
            tags: [
                { key: "Marca", value: "bmw" },
                { key: "Colore", value: "Oro" },
            ],
            altproducts: [],
        }

        let req = await postAuth(prod);
        let value = req.body;
        let statusCode = req.statusCode;
        let id = value._id;

        statusCode.should.equal(201);
        verify(value, prod);

        const unit1 = {
            name: "UnitTest4-1",
            condition: "perfect",
            product: id,
            price: 100,
            rentals: [],
        }

        const unit2 = {
            name: "UnitTest4-2",
            condition: "minor flaw",
            product: id,
            price: 125,
            rentals: [],
        }

        req = (await request(app).post(url + id + "/units").set(authheader).send(unit1));
        value = req.body;
        statusCode = req.statusCode;

        const idUnit1 = value._id;

        statusCode.should.equal(201);
        verify(value, unit1);

        req = (await request(app).post(url + id + "/units").set(authheader).send(unit2));
        value = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(201);
        verify(value, unit2);

        req = (await request(app).get(url + id + "/units").set(authheader));
        value = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(200);
        value.should.be.an('array');
        shouldContain(value, unit1);
        shouldContain(value, unit2);

        req = (await request(app).delete(url + id + "/units/" + idUnit1).set(authheader));
        value = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(200);
        verify(value, unit1);

        req = (await request(app).get(url + id + "/units").set(authheader));
        value = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(200);
        value.should.be.an('array');
        shouldNotContain(value, unit1);
        shouldContain(value, unit2);

        req = await deleteAuth(id);
        req.statusCode.should.equal(200);
    })

    it("GET, POST, DELETE /tags shoudl return an array of tags, post a new tag and delete a specifi tag", async function () {
        const tags = [{ key: "Marca", value: "bmw" },{ key: "Colore", value: "Oro" }];

        const prod = {
            name: "ProdottoTest5",
            description: "Descrizione test",
            image: "/urldiprova/image1.png",
            category: "Auto",
            subcategory: "Lusso",
            tags: tags,
            altproducts: [],
        }

        let req = await postAuth(prod);
        let value = req.body;
        let statusCode = req.statusCode;
        let id = value._id;

        statusCode.should.equal(201);
        verify(value, prod);

        const newTag = {
            key: "Keytagprova",
            value: "valuetagprova"
        }

        tags.push(newTag);

        req = (await request(app).post(url + id + "/tags").set(authheader).send(newTag));
        value = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(201);
        verify(value, newTag);

        req = (await request(app).delete(url + id + `/tags?key=${tags[0].key}&value=${tags[0].value}`).set(authheader));
        value = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(200);
        shouldContain(value, tags[0]);

        req = (await request(app).get(url + id + "/tags").set(authheader));
        let arrTags = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(200);
        value.should.be.an('array');

        shouldNotContain(arrTags, tags[0]);
        shouldContain(arrTags, tags[1]);
        shouldContain(arrTags, tags[2]);

        req = await deleteAuth(id);
        req.statusCode.should.equal(200);
    })

    it("GET, POST, DELETE /altproducts should return an array of altproducts, post a new altproducts and delete a specific altproducts", async function () {
        const tags = [{ key: "Marca", value: "bmw" },{ key: "Colore", value: "Oro" }];

        const prod = {
            name: "ProdottoTest6",
            description: "Descrizione test",
            image: "/urldiprova/image1.png",
            category: "Auto",
            subcategory: "Lusso",
            tags: tags,
            altproducts: [],
        }

        const altprod1 = {
            name: "altprodtest6-1",
            description: "Descrizione test2",
            image: "/urldiprova/image1.png",
            category: "Auto",
            subcategory: "Lusso",
            tags: tags,
            altproducts: [],
        }
        const altprod2 = {
            name: "altprodtest6-2",
            description: "Descrizione test2",
            image: "/urldiprova/image1.png",
            category: "Auto",
            subcategory: "Lusso",
            tags: tags,
            altproducts: [],
        }

        let req = await postAuth(prod);
        let value = req.body;
        let statusCode = req.statusCode;
        let id = value._id;

        statusCode.should.equal(201);
        verify(value, prod);

        req = await postAuth(altprod1);
        value = req.body;
        statusCode = req.statusCode;
        let idaltprod1 = value._id;

        statusCode.should.equal(201);
        verify(value, altprod1);

        req = await postAuth(altprod2);
        value = req.body;
        statusCode = req.statusCode;
        let idaltprod2 = value._id;

        statusCode.should.equal(201);
        verify(value, altprod2);

        req = (await request(app).post(url + id + "/altproducts").set(authheader).send({_id: idaltprod1}));
        value = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(201);
        verify(value, altprod1);

        req = (await request(app).post(url + id + "/altproducts").set(authheader).send({_id: idaltprod2}));
        value = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(201);
        verify(value, altprod2);

        req = (await request(app).get(url + id + "/altproducts").set(authheader));
        let arr = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(200);
        arr.should.be.an('array');

        shouldNotContain(arr, prod);
        shouldContain(arr, altprod1);
        shouldContain(arr, altprod2);

        req = (await request(app).delete(url + id + "/altproducts").set(authheader).send({_id: idaltprod2}));
        value = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(200);
        verify(value, altprod2);

        req = (await request(app).get(url + id + "/altproducts").set(authheader));
        arr = req.body;
        statusCode = req.statusCode;

        statusCode.should.equal(200);
        arr.should.be.an('array');

        shouldNotContain(arr, prod);
        shouldContain(arr, altprod1);
        shouldNotContain(arr, altprod2);


        req = await deleteAuth(id);
        req.statusCode.should.equal(200);

        req = await deleteAuth(idaltprod1);
        req.statusCode.should.equal(200);

        req = await deleteAuth(idaltprod2);
        req.statusCode.should.equal(200);
    })
})