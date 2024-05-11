import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/bravosLogoBlack.png";
import { FaHome, FaUserAlt, FaUserSecret } from "react-icons/fa";
import { PiChalkboardTeacherBold } from "react-icons/pi";
import { BiSolidBusSchool } from "react-icons/bi";
import { FaSchoolLock, FaUsers } from "react-icons/fa6";
import { FaBarsStaggered } from "react-icons/fa6";
import { IoClose, IoLogOutOutline } from "react-icons/io5";
import { AuthContext, UserProps } from "@/contexts/AuthContext";

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
            onClick={() => navigateToRoute("/")}
            className="flex gap-3 hover:bg-gray-100 transition-all w-full p-4 rounded-lg items-center text-gray-700 font-semibold cursor-pointer"
          >
            <FaHome fontSize={24} />
            <p className="text-lg">Home</p>
          </li>
          {
            ((user as unknown as UserProps).level == 0 || (user as unknown as UserProps).level == 1) && (
                <li
                  onClick={() => navigateToRoute("/alunos")}
                  className="flex gap-3 hover:bg-gray-100 transition-all w-full p-4 rounded-lg items-center text-gray-700 font-semibold cursor-pointer"
                >
                  <FaUsers fontSize={24} />
                  <p className="text-lg">Alunos</p>
                </li>
            )
          }

          {((user as unknown as UserProps).level == 0 || (user as unknown as UserProps).level == 1) && (
              <li
                onClick={() => navigateToRoute("/turmas")}
                className="flex gap-3 hover:bg-gray-100 transition-all w-full p-4 rounded-lg items-center text-gray-700 font-semibold cursor-pointer"
              >
                <BiSolidBusSchool fontSize={24} />
                <p className="text-lg">Turmas</p>
              </li>
            )}

          {((user as unknown as UserProps).level == 0 || (user as unknown as UserProps).level == 1) &&  (
              <li
                onClick={() => navigateToRoute("/professores")}
                className="flex gap-3 hover:bg-gray-100 transition-all w-full pl-3 py-4 rounded-lg items-center text-gray-700 font-semibold cursor-pointer"
              >
                <PiChalkboardTeacherBold fontSize={27} />
                <p className="text-lg">Professores</p>
              </li>
          )}

          {((user as unknown as UserProps).level == 0 || (user as unknown as UserProps).level == 1) &&  (
              <li
                onClick={() => navigateToRoute("/responsaveis")}
                className="flex gap-3 hover:bg-gray-100 transition-all w-full pl-3 py-4 rounded-lg items-center text-gray-700 font-semibold cursor-pointer"
              >
                <FaUserSecret fontSize={25} />
                <p className="text-lg">Responsáveis</p>
              </li>
          )}

          <li
            onClick={() => navigateToRoute("/controle/alunos")}
            className="flex gap-3 hover:bg-gray-100 transition-all w-full pl-3 py-4 rounded-lg items-center text-gray-700 font-semibold cursor-pointer"
          >
            <FaSchoolLock fontSize={25} />
            <p className="text-lg">Controle de acesso</p>
          </li>

          <hr />

          <li className="flex justify-between gap-3 hover:bg-gray-100 transition-all w-full pl-3 py-4 rounded-lg items-center text-gray-700 font-semibold cursor-pointer">
            <div className="flex items-center gap-3.5">
              <FaUserAlt fontSize={23} />
              <p className="text-lg">{(user as unknown as UserProps).name}</p>
            </div>

            <IoLogOutOutline
              onClick={LogOut}
              fontSize={26}
              className="cursor-pointer mr-1"
            />
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Header;
