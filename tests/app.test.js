import {describe, expect, jest, test} from "@jest/globals";
import {Server} from "../src/Server.js";
import {envs} from "../src/config/plugins/envs.js";

jest.mock('../src/Server.js');

describe('should call server with arguments and start', () => {

  test('should call server and start', async () => {
    await import('../src/app.js');

    expect(Server).toHaveBeenCalledTimes(1);
    expect(Server).toHaveBeenCalledWith({
      port: envs.PORT,
      routes: expect.any(Function),
      acceptedOrigins: [],
    });

    expect(Server.prototype.start).toHaveBeenCalledWith();

  });
});