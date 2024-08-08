const request = require('supertest');
const app = require('../../app')


describe('Test GET /launches', () =>{
    test('It should response with 200 success' ,async () =>{
        const response = await request(app)
            .get('/launches')
            .expect(200);
    });
});
 
describe('Test POST /launch ',() => {
    test('It should respond with 201 success',async () =>{

       
    });
});

// these aren't built in Js functions 
