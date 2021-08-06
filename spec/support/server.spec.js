const request = require("request");
describe("get messages", () => {
  it("should return 200 ok", (done) => {
    request.get("http://localhost:3000/messages", (err, res) => {
      expect(res.statusCode).toEqual(200);
      done();
    });
  });
  it("the list should be greater than 0", (done) => {
    request.get("http://localhost:3000/messages", (err, res) => {
      expect(JSON.parse(res.body).length).toBeGreaterThan(0);
      done();
    });
  });
});
describe("get message from user", () => {
  it("it should return 200 ok", (done) => {
    request.get("http://localhost:3000/messages/tim", (err, res) => {
      expect(res.statusCode).toEqual(200);
      done();
    });
  });
  it('user should be tim', () => {
     request.get("http://localhost:3000/messages/asror", (err, res) => {
       expect(JSON.parse(res.body)[0].name).toEqual('Asror');
     });
  })
});
