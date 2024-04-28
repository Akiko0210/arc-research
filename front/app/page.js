import Image from "next/image";
// import "./page.scss";

export default function Home() {
  return (
    <div className="h-screen flex justify-center items-center relative">
      <div className="text-9xl border-gradient-to-r from-[#d53e33] to-[#fbb300] ">
        Arc research
      </div>
      {/* add box class if you need noen moving border */}
      <input
        className="box rounded p-4 w-[700px] bg-background backdrop-blur-lg absolute"
        placeholder="Search..."
      />
    </div>
  );
}
