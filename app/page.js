import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen flex justify-center items-center relative">
      <div className="text-9xl">Arc research</div>
      <input
        className="rounded p-4 w-[700px] absolute bg-background backdrop-blur-lg"
        placeholder="Search..."
      />
    </div>
  );
}
