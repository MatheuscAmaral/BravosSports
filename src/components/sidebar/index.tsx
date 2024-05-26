import { useContext, useState } from "react";
import logo from "../../assets/logo-bravos-laranja.png";
import { BiSolidBusSchool } from "react-icons/bi";
import { IoLogOutOutline } from "react-icons/io5";
import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Input,
} from "@material-tailwind/react";

import { PiChalkboardTeacherBold } from "react-icons/pi";
import { FaSchoolLock, FaUsers } from "react-icons/fa6";

import {
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { AuthContext, UserProps } from "@/contexts/AuthContext";
import { FaUserAlt, FaHome, FaClipboardList, FaUserTie} from "react-icons/fa";
import { MdSportsHandball } from "react-icons/md";

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const LogOut = () => {
    logout();
    navigate("/login");
  };

  const filteredItems = user ? (
    (user as unknown as UserProps).level === 0 || (user as unknown as UserProps).level === 1 ? (
      [
        { label: "Início", icon: <FaHome fontSize={24} />, path: "/" },
        { label: "Alunos", icon: <FaUsers fontSize={24} />, path: "/alunos" },
        { label: "Turmas", icon: <BiSolidBusSchool fontSize={24} />, path: "/turmas" },
        { label: "Professores", icon: <PiChalkboardTeacherBold fontSize={25} />, path: "/professores" },
        { label: "Esportes", icon: <MdSportsHandball fontSize={25} />, path: "/esportes" },
        { label: "Responsáveis", icon: <FaUserTie fontSize={22} />, path: "/responsaveis" },
        { label: "Chamada", icon: <FaClipboardList fontSize={24} />, path: "/chamada" },
        // { label: "Controle de acesso", icon: <FaSchoolLock fontSize={24} />, path: "/controle/alunos"},
      ].filter(item => item.label.toLowerCase().includes(searchTerm.toLowerCase()))
      ) : [
      { label: "Início", icon: <FaHome fontSize={24} />, path: "/" },
      { label: "Chamada", icon: <FaClipboardList fontSize={24} />, path: "/chamada" },
      { label: "Controle de acesso", icon: <FaSchoolLock fontSize={24} />, path: "/controle/alunos" },
        
      ].filter(item => item.label.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  return (
    // @ts-ignore
    <Card className="hidden xl:block h-svh relative w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 select-none">
      <div className="mb-2 flex items-center gap-4 pt-4 pb-1">
        <img src={logo} alt="brand" className="h-11 my-2" />
      </div>
      <div className="p-2">
      {/* @ts-ignore */}
        <Input
          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          label="Pesquisar..."
          onChange={handleSearch}
        />
      </div>
        {/* @ts-ignore */}
      <List>
        {filteredItems.map((item, index) => (
            //@ts-ignore 
          <ListItem key={index} onClick={() => navigate(item.path)}>
            {/* @ts-ignore */}
            <ListItemPrefix>{item.icon}</ListItemPrefix>
            {item.label}
          </ListItem>
        ))}
        
        <div className="fixed bottom-7 left-6 max-w-60 w-full">
          <hr className="my-4 border-blue-gray-50" />

          <div className="flex justify-between gap-4 p-0 items-center mx-1.5">
            <div className="flex gap-4 items-center whitespace-nowrap">
              <FaUserAlt fontSize={20} />
              <p style={{ fontSize: 15 }}>{(user as unknown as UserProps).name}</p>
            </div>

            <IoLogOutOutline
              onClick={LogOut}
              fontSize={26}
              className="cursor-pointer ml-5"
            />
          </div>
        </div>

      </List>
    </Card>
  );
};

export default Sidebar;
