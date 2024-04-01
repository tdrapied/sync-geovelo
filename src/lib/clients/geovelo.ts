import { IGeoveloUser } from "@/interfaces/types";

export default class GeoveloClient {
  async fetchProfile(
    userId: string,
    token: string,
  ): Promise<IGeoveloUser | null> {
    const response = await this.request({
      url: "/v1/users/" + userId,
      token,
    });

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

  async importGPX(token: string, title: string, gpx: string): Promise<void> {
    const formData = new FormData();

    const file = new File([gpx], "file.gpx");
    formData.append("gpx", file);
    formData.append("title", title);

    const response = await this.request({
      url: "/v2/user_trace_from_gpx",
      token,
      method: "POST",
      body: formData,
    });

    if (response.status !== 201) {
      throw new Error("Failed to import GPX");
    }

    return;
  }

  private request({
    url,
    token,
    method = "GET",
    body,
  }: {
    url: string;
    token: string;
    method?: string;
    body?: any;
  }): Promise<Response> {
    return fetch(process.env.GEOVELO_API_URL + url, {
      method,
      headers: {
        Authorization: "Token " + token,
        "api-key": process.env.GEOVELO_API_KEY as string,
        source: "website",
      },
      body: body,
    });
  }
}
