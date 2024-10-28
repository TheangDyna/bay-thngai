import { Controller, Get, Route } from "tsoa";

@Route("v1/users")
export class HealthController extends Controller {
  @Get("/health")
  public async getHealth(): Promise<{ message: string }> {
    try {
      return { message: "OK" };
    } catch (error) {
      throw error;
    }
  }
}
