import { json, type V2_MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  // めちゃくちゃ遅いSSRをシミュレート
  await new Promise((resolve) => setTimeout(resolve, 5000));

  return json({ date: new Date().toLocaleString() });
};

export default function Index() {
  const { date } = useLoaderData();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>{date}</h1>
      <p>5秒ごとにキャッシュが切れます</p>
    </div>
  );
}
