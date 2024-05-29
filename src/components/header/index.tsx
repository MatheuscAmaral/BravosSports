import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo-bravos-laranja.png";
import { FaClipboardList, FaHome, FaUserAlt, FaUserTie } from "react-icons/fa";
import { PiChalkboardTeacherBold } from "react-icons/pi";
import { BiSolidBusSchool } from "react-icons/bi";
import { FaUsers } from "react-icons/fa6";
import { FaBarsStaggered } from "react-icons/fa6";
import { IoClose, IoLogOutOutline } from "react-icons/io5";
import { AuthContext, UserProps } from "@/contexts/AuthContext";
import { MdSportsHandball } from "react-icons/md";

const Header = () => {
  const [mobile, setMobile] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const navigateToRoute = (route: string) => {
    navigate(route);
    setMobile(false);
  };

  const LogOut = () => {
    logout();
    navigate("/login");
  };

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
        <div className="flex justify-between items-center w-full">
          <img src={logo} alt="logo" className=" h-16 py-3" />

          <button
            className="p-2 my-5 rounded-lg hover:bg-gray-100"
            onClick={() => setMobile(false)}
          >
            <IoClose fontSize={27} />
          </button>
        </div>

        <ul className="flex flex-col gap-2 w-full mt-1 select-none">
          <li
            onClick={() => navigateToRoute("/")}
            className="flex gap-3 hover:bg-gray-100 transition-all w-full p-4 rounded-lg items-center text-gray-600 font-semibold cursor-pointer"
          >
            <FaHome fontSize={24} />
            <p className="text-lg">Home</p>
          </li>

          {
            ((user as unknown as UserProps).level == 0 || (user as unknown as UserProps).level == 1) && (
                <li
                  onClick={() => navigateToRoute("/alunos")}
                  className="flex gap-3 hover:bg-gray-100 transition-all w-full p-4 rounded-lg items-center text-gray-600 font-semibold cursor-pointer"
                >
                  <FaUsers fontSize={24} />
                  <p className="text-lg">Alunos</p>
                </li>
            )
          }

          {((user as unknown as UserProps).level == 0 || (user as unknown as UserProps).level == 1) && (
              <li
                onClick={() => navigateToRoute("/turmas")}
                className="flex gap-3 hover:bg-gray-100 transition-all w-full p-4 rounded-lg items-center text-gray-600 font-semibold cursor-pointer"
              >
                <BiSolidBusSchool fontSize={24} />
                <p className="text-lg">Turmas</p>
              </li>
            )}

          {((user as unknown as UserProps).level == 0 || (user as unknown as UserProps).level == 1) &&  (
              <li
                onClick={() => navigateToRoute("/esportes")}
                className="flex gap-3 hover:bg-gray-100 transition-all w-full pl-3 py-4 rounded-lg items-center text-gray-600 font-semibold cursor-pointer"
              >
                <MdSportsHandball fontSize={27} />
                <p className="text-lg">Esportes</p>
              </li>
          )}

          {((user as unknown as UserProps).level == 0 || (user as unknown as UserProps).level == 1) &&  (
              <li
                onClick={() => navigateToRoute("/professores")}
                className="flex gap-3 hover:bg-gray-100 transition-all w-full pl-3 py-4 rounded-lg items-center text-gray-600 font-semibold cursor-pointer"
              >
                <PiChalkboardTeacherBold fontSize={27} />
                <p className="text-lg">Professores</p>
              </li>
          )}

          {((user as unknown as UserProps).level == 0 || (user as unknown as UserProps).level == 1) &&  (
              <li
                onClick={() => navigateToRoute("/responsaveis")}
                className="flex gap-3 hover:bg-gray-100 transition-all w-full pl-3 py-4 rounded-lg items-center text-gray-600 font-semibold cursor-pointer"
              >
                <FaUserTie fontSize={25} />
                <p className="text-lg">Responsáveis</p>
              </li>
          )}

          {(user as unknown as UserProps).level != 3 &&  (
              <li
                onClick={() => navigateToRoute("/chamada")}
                className="flex gap-3 hover:bg-gray-100 transition-all w-full pl-3 py-4 rounded-lg items-center text-gray-600 font-semibold cursor-pointer"
              >
                <FaClipboardList fontSize={25} />
                <p className="text-lg">Chamada</p>
              </li>
          )}

          <div className="fixed bottom-3 bg-white left-3 w-full">
            <hr className="mr-6"/>

            <li className="flex justify-between gap-3 mt-2 hover:bg-gray-100 transition-all w-full pl-3 py-4 rounded-lg items-center text-gray-600 font-semibold cursor-pointer">
              <div className="flex items-center gap-3.5">
                <FaUserAlt fontSize={23} />
                <p className="text-lg">{(user as unknown as UserProps).name}</p>
              </div>

              <IoLogOutOutline
                onClick={LogOut}
                fontSize={26}
                className="cursor-pointer mr-10"
              />
            </li>
          </div>
        </ul>
      </section>
    </div>
  );
};

export default Header;
