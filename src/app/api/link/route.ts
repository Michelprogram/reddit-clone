import axios from "axios";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const href = url.searchParams.get("href");

  if (!href) {
    return new Response("Missing href", { status: 400 });
  }

  const res = await axios.get(href);

  const titleMatch = res.data.match(/<title>(.*?)<\/title>/i);

  const title = titleMatch ? titleMatch[1] : "";

  const descriptionMatch = res.data.match(
    /<meta name="description" content="(.*?)"/i
  );

  const description = descriptionMatch ? descriptionMatch[1] : "";

  const imageMatch = res.data.match(
    /<meta property="og:image" content="(.*?)"/i
  );

  const image = imageMatch ? imageMatch[1] : "";

  return new Response(
    JSON.stringify({
      success: true,
      meta: {
        title,
        description,
        image: {
          url: image,
        },
      },
    })
  );
}
