import { NextResponse } from "next/server";
import { getAllTools, getToolBySlug } from "@/lib/tools";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      // Get specific tool by slug
      const tool = await getToolBySlug(slug);
      if (!tool) {
        return NextResponse.json({ error: "Tool not found" }, { status: 404 });
      }
      return NextResponse.json(tool);
    }

    // Get all tools
    const tools = await getAllTools();
    return NextResponse.json(tools);
  } catch (error) {
    console.error("Error fetching tools:", error);
    return NextResponse.json(
      { error: "Failed to fetch tools" },
      { status: 500 }
    );
  }
}
