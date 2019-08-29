import { api, Exchange, HttpMethod, route } from "@msiviero/knit";

@api()
export class Api {

  @route(HttpMethod.GET, "/adult")
  public async getEndpoint(exchange: Exchange) {

    const ageParam: string | undefined = exchange.request.query.age;

    if (!ageParam) {
      exchange.response.code(400).send(new Error("'age' param missing"));
    } else {
      const age = parseInt(ageParam, 10);
      const adult = age >= 18 ? true : false;

      exchange.response.send({ adult });
    }
  }
}
