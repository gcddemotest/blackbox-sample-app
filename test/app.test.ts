import { Container, HttpServer, Scope } from "@msiviero/knit";
import * as supertest from "supertest";
import { Api } from "../src/api/api";

describe("Http server custom instance", () => {

  const container = new Container()
    .register(Api, Scope.Singleton);

  const httpServer = new HttpServer(container).api(Api);

  beforeAll(() => httpServer.start({ port: 0 }));
  afterAll(() => httpServer.stop());

  it("should handle empty requests with 400 error code", async () => {

    await supertest(httpServer.getServer())
      .get("/adult")
      .expect(400)
      .expect("Content-Type", "application/json; charset=utf-8");
  });

  it("should respond with false with age under 18", async () => {

    const response = await supertest(httpServer.getServer())
      .get("/adult?age=10")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");

    expect(response.body).toEqual({ adult: false });
  });

  it("should respond with true with age over 18", async () => {

    const response = await supertest(httpServer.getServer())
      .get("/adult?age=21")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");

    expect(response.body).toEqual({ adult: true });
  });
});
