import Image from "next/image";
import Canvas from "./components/Canvas";

export default function Home() {
  return (
    <main className="max-h-screen w-full bg-white">
      <Canvas />
    </main>
      );
}
