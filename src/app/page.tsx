import dynamic from "next/dynamic";
import { Suspense } from "react";

const WebcamTracker = dynamic(() => import("./components/WebcamTracker"), {
  ssr: false,
  loading: () => <p>Loading webcam...</p>,
});

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden">
      <Suspense fallback={<div>Loading...</div>}>
        <WebcamTracker />
      </Suspense>
    </main>
  );
}
