const request = require('supertest');
const app = require('../../app')
const {mongoConnect , mongoDisconnect} = require('../../services/mongo')


describe('Launches Api', () =>{
    beforeAll(async () => {
        await mongoConnect();
    });
    afterAll(async () =>{
       await mongoDisconnect();   
    })

    describe('Test GET /launches', () =>{
        test('It should response with 200 success' ,async () =>{
            const response = await request(app)
                .get('/v1/launches')
                .expect(200);
        });
    });
     
    describe('Test POST /launch ',() => {
        test('It should respond with 201 success',async () =>{
    
           
        });
    });



})



// these aren't built in Js functions 
