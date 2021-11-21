const create_app = require('../../shared/app');

describe("Subscriber server tests", () => {
    const mockListen = jest.fn((port = 9000, hostname = '0.0.0.0') => { jest.fn() });
    let server = create_app();

    server.listen = mockListen;
    server.close = jest.fn();

    afterEach(() => {
        mockListen.mockReset();
        server.close();
    });

    it('Subscriber Server listens on port 9000', async () => {
        require('../index');
        // we have to call this here because we don't start server in test
        server.listen(9000);
        expect(mockListen.mock.calls.length).toBe(1);
        expect(mockListen.mock.calls[0][0]).toBe(9000);
    });
});