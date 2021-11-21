const request = require('supertest');
const create_app = require('../app');

describe("app tests", () => {

    let server = create_app().listen();

    afterAll(() => {
        server.close()
    })

    it("healcheck should return 200", (done) => {
        request(server)
            .get('/test/healthcheck')
            .expect(200, done);
    });
});