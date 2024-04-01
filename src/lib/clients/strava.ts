import {
  IStravaActivity,
  IStravaRefreshTokenResponse,
  IStravaStreamLatlngItem,
  StravaActivityStreamList,
} from "@/interfaces/types";
import { StravaBuilder, buildGPX } from "gpx-builder";

const { Metadata, Point } = StravaBuilder.MODELS;

export default class StravaClient {
  async fetchActivities(
    token: string,
    {
      after,
    }: {
      after: Date;
    },
  ): Promise<IStravaActivity[] | null> {
    const afterEpoch = Math.floor(after.getTime() / 1000);
    const response = await fetch(
      `${process.env.STRAVA_API_URL}/athlete/activities?after=${afterEpoch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  }

  async fetchActivityStream(
    token: string,
    activityId: number,
  ): Promise<StravaActivityStreamList | null> {
    const response = await fetch(
      `${process.env.STRAVA_API_URL}/activities/${activityId}/streams?keys=latlng`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  }

  async fetchActivityGPX(token: string, activity: IStravaActivity) {
    const streams = await this.fetchActivityStream(token, activity.id);
    if (!streams) {
      return null;
    }

    const latlng: IStravaStreamLatlngItem = streams[0];
    if (!latlng || latlng.type !== "latlng" || !latlng.data.length) {
      return null;
    }

    let currentDate = new Date(activity.start_date);
    const points = [];
    for (const item of latlng.data) {
      const point = new Point(item[0], item[1], {
        time: new Date(currentDate),
      });
      points.push(point);

      // Add 1 second to next point
      currentDate.setSeconds(currentDate.getSeconds() + 1);
    }

    const gpxData = new StravaBuilder();
    gpxData.setMetadata(
      new Metadata({
        name: activity.name,
        time: new Date(activity.start_date),
      }),
    );
    gpxData.setSegmentPoints(points);

    return buildGPX(gpxData.toObject());
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<IStravaRefreshTokenResponse | null> {
    const response = await fetch(process.env.STRAVA_API_URL + "/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.STRAVA_ID,
        client_secret: process.env.STRAVA_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  }
}
