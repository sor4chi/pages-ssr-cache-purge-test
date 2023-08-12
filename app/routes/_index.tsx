import { json } from "@remix-run/cloudflare";
import type { HeadersFunction, V2_MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = () => {
  return json({ date: new Date() });
};

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=3600",
});

export default function Index() {
  const { date } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      {date}
    </div>
  );
}
