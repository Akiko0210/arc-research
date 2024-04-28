import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  return (
    <div className="h-screen flex justify-center items-center relative bg-gradient-to-b from-gray-700 to-black">

      {/* Left navigation button */}
      <div className="absolute left-20 top-1/2 transform -translate-y-1/2">
        <FontAwesomeIcon icon={faAnglesLeft} className="h-[30px] w-[30px] cursor-pointer" />
      </div>

      {/* Right navigation button */}
      <div className="absolute right-20 top-1/2 transform -translate-y-1/2">
        <FontAwesomeIcon icon={faAnglesRight} className="h-[30px] w-[30px] cursor-pointer" />
      </div>

      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-[700px]"> 
            <div className="rounded-xl p-4 bg-background backdrop-blur-lg mb-4 text-center text-4xl"> 
                Why animals can outrun robots
            </div>
            <div className="rounded-xl p-4 bg-background backdrop-blur-lg">
                Strategies for robot locomotion have often taken inspiration from animals. But robots still fall short when compared to the inherent performance of animals. Burden et al. review the literature and discuss why animals outrun robots in categories such as agility, range, and robustness. The authors highlight that, with few exceptions, engineering outperforms biology in the components critical for running, so they conclude that there must be as-yet-undiscovered principles of integration and control that give animals their advantage over robots. —Amos Matsiko
            </div>
        </div>
      </div>
      
    </div>
  );
}
