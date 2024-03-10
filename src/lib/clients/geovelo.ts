import { IGeoveloUser } from "@/interfaces/types";

export default class GeoveloClient {
  async fetchProfile(
    userId: string,
    token: string,
  ): Promise<IGeoveloUser | null> {
    const response = await this.request("/v1/users/" + userId, token);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      id: data.id,
      username: data.username,
      email: data.email,
    };
  }

  private request(url: string, token: string) {
    return fetch(process.env.GEOVELO_API_URL + url, {
      headers: {
        Authorization: "Token " + token,
        "api-key": process.env.GEOVELO_API_KEY as string,
        source: "website",
      },
    });
  }
}
