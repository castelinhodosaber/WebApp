import { NextRequest, NextResponse } from "next/server";
import castelinhoApiInstance from "..";

export async function GET(req: NextRequest) {
  const route = req.url.split("?route=")[1];

  if (!route) {
    return NextResponse.json(
      { error: "URL is required and must be a string" },
      { status: 400 }
    );
  }

  try {
    const response = await castelinhoApiInstance.get(
      decodeURIComponent(route),
      {
        responseType: "arraybuffer", // Fetch binary data for images
      }
    );

    return new NextResponse(response.data, {
      headers: {
        "Content-Type": response.headers["content-type"],
        "Cache-Control": "public, max-age=86400", // Optional: Cache control
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
