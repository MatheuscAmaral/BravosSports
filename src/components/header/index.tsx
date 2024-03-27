import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/bravosLogoBlack.png";

import { PiChalkboardTeacherBold } from "react-icons/pi";
import { FaSchoolLock, FaUsers } from "react-icons/fa6";
import { FaBarsStaggered } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { AuthContext } from "@/contexts/AuthContext";

const Header = () => {
  const [mobile, setMobile] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="relative transition-all">
      <header
        className={`${
          mobile ? "hidden" : "flex xl:hidden"
        } justify-between items-center px-3 bg-white w-full`}
      >
        <img src={logo} alt="logo" className="w-40 py-3" />

        <button
          className="p-3 my-5 rounded-lg hover:bg-gray-100"
          onClick={() => setMobile(true)}
        >
          <FaBarsStaggered fontSize={23} />
        </button>
      </header>

      <section
        className={`${
          mobile ? "flex flex-col xl:hidden" : "hidden"
        } items-center bg-white w-full h-svh absolute z-50 py-1 px-3`}
      >
        <div className="flex justify-between w-full">
          <img src={logo} alt="logo" className="h-20 py-3" />

          <button
            className="p-2 my-5 rounded-lg hover:bg-gray-100"
            onClick={() => setMobile(false)}
          >
            <IoClose fontSize={27} />
          </button>
        </div>

        <ul className="flex flex-col gap-2 w-full mt-5 select-none">
          <li
            onClick={() => navigate("/alunos")}
            className="flex gap-3 hover:bg-gray-100 transition-all w-full p-4 rounded-lg items-center text-gray-700 font-semibold cursor-pointer"
          >
            <FaUsers fontSize={24} />
            <p className="text-lg">Alunos</p>
          </li>

          <li
            onClick={() => navigate("/alunos")}
            className="flex gap-3 hover:bg-gray-100 transition-all w-full pl-3 py-4 rounded-lg items-center text-gray-700 font-semibold cursor-pointer"
          >
            <PiChalkboardTeacherBold fontSize={27} />
            <p className="text-lg">Professores</p>
          </li>

          <li
            onClick={() => navigate("/controle/alunos")}
            className="flex gap-3 hover:bg-gray-100 transition-all w-full pl-3 py-4 rounded-lg items-center text-gray-700 font-semibold cursor-pointer"
          >
            <FaSchoolLock fontSize={25} />
            <p className="text-lg">Controle de acesso</p>
          </li>

          <hr />

          <li
            className="flex gap-3 hover:bg-gray-100 transition-all w-full pl-3 py-4 rounded-lg items-center text-gray-700 font-semibold cursor-pointer"
          >
            <SignedOut>
              <SignInButton />
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
            <p className="text-lg">{ user }</p>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Header;
