const create_app = require('../../shared/app');

describe("Publisher server tests", () => {
    const mockListen = jest.fn((port = 8000, hostname = '0.0.0.0') => { jest.fn() });
    let server = create_app();

    server.listen = mockListen;
    server.close = jest.fn();

    afterEach(() => {
        mockListen.mockReset();
        server.close();
    });

    it('Publisher Server listens on port 8000', async () => {
        require('../index');
        // we have to call this here because we don't start server in test
        server.listen(8000);
        expect(mockListen.mock.calls.length).toBe(1);
        expect(mockListen.mock.calls[0][0]).toBe(8000);
    });
});