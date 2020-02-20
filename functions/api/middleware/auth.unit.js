const auth = require("./auth");
describe("api/middleware/auth", () => {
	const req = 0;
	const res = 1;
	const next = 2;
	const getContext = () => [
		{ body: {}, headers: {} },
		{
			status: () => {},
			send: () => {},
		},
		() => {},
	];

	test("returns an error if authorization-userid header and body.userid is missing", () => {
		const context = getContext();
		context[req].headers["authorization-token"] = "someAuthToken";
		const statusSpy = jest.spyOn(context[res], "status");
		const sendSpy = jest.spyOn(context[res], "send");
		auth(...context);
		expect(statusSpy).toHaveBeenCalledWith(400);
		expect(sendSpy).toHaveBeenCalledWith(`no userid given`);
	});

	test("returns an error if authorization-token header and body.token is missing", () => {
		const context = getContext();
		context[req].headers["authorization-userid"] = "someUserId";
		const statusSpy = jest.spyOn(context[res], "status");
		const sendSpy = jest.spyOn(context[res], "send");
		auth(...context);
		expect(statusSpy).toHaveBeenCalledWith(400);
		expect(sendSpy).toHaveBeenCalledWith(`no auth token given`);
	});

	const getMockedAuth = (response) => {
		const mockQueryResponse = jest.fn().mockResolvedValue(response);
		jest.mock("../../initialize", () => ({
			db: () => ({
				collection: jest.fn((path) => ({
					doc: jest.fn((queryString) => ({
						get: mockQueryResponse,
					})),
				})),
			}),
		}));
		return require("./auth");
	};

	test.skip("returns an error if given user does not exist", () => {
		const context = getContext();
		context[req].headers["authorization-userid"] = "someUserId";
		context[req].headers["authorization-token"] = "someAuthToken";
		const statusSpy = jest.spyOn(context[res], "status");
		const sendSpy = jest.spyOn(context[res], "send");
		// TODO: Mock firestore database queries to return { exists: false }
		auth(...context);
		expect(statusSpy).toHaveBeenCalledWith(400);
		expect(sendSpy).toHaveBeenCalledWith(`Invalid Credentials`);
	});

	test.skip("req.auth gets set for valid credentials", () => {
		const spy = jest.spyOn(context, 2);
		// TODO: mock valid context with userid and token
		cors(...context);
		expect(spy).toHaveBeenCalled();
		expect(context[0].auth).toStrictEqual({ userid, token });
	});

	test.skip("next is called for valid users", () => {
		const spy = jest.spyOn(context, 2);
		// TODO: mock valid context
		cors(...context);
		expect(spy).toHaveBeenCalled();
	});
});