import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useContext,
  useState,
} from "react";
import logo from "../../assets/logo-bravos-laranja.png";
import { BiSolidBusSchool } from "react-icons/bi";
import { IoLogOutOutline } from "react-icons/io5";
import { RiUserSettingsFill } from "react-icons/ri";
import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Input,
} from "@material-tailwind/react";

import { PiChalkboardTeacherBold, PiUserFocusBold } from "react-icons/pi";
import { FaUsers } from "react-icons/fa6";
import { FaUserAlt, FaHome, FaClipboardList, FaUserTie } from "react-icons/fa";
import { FaBuildingColumns } from "react-icons/fa6";
import { MdFormatListBulletedAdd, MdSportsHandball } from "react-icons/md";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { To, useNavigate } from "react-router-dom";
import { AuthContext, UserProps } from "@/contexts/AuthContext";

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

  const filteredItems = user
    ? (() => {
        let items: any = [];

        if (
          (user as unknown as UserProps).level === 0 ||
          (user as unknown as UserProps).level === 1
        ) {
          items = [
            { label: "Início", icon: <FaHome fontSize={24} />, path: "/" },
            {
              label: "Alunos",
              icon: <FaUsers fontSize={24} />,
              path: "/alunos",
            },
            {
              label: "Turmas",
              icon: <BiSolidBusSchool fontSize={24} />,
              path: "/turmas",
            },
            {
              label: "Professores",
              icon: <PiChalkboardTeacherBold fontSize={25} />,
              path: "/professores",
            },
            {
              label: "Esportes",
              icon: <MdSportsHandball fontSize={25} />,
              path: "/esportes",
            },
            {
              label: "Unidades",
              icon: <FaBuildingColumns fontSize={22} />,
              path: "/unidades",
            },
            {
              label: "Responsáveis",
              icon: <FaUserTie fontSize={22} />,
              path: "/responsaveis",
            },
            {
              label: "Chamada",
              icon: <FaClipboardList fontSize={24} />,
              path: "/chamada",
            },
            {
              label: "Responsáveis liber...",
              icon: <PiUserFocusBold fontSize={26} />,
              path: "/responsaveis/liberados",
            },
            {
              label: "Agendamentos",
              icon: <MdFormatListBulletedAdd fontSize={24} />,
              path: "/agendamentos",
            },
            {
              label: "Usuários",
              icon: <RiUserSettingsFill fontSize={24} />,
              path: "/usuarios",
            },
          ];
        } else if ((user as unknown as UserProps).level === 2) {
          items = [
            { label: "Início", icon: <FaHome fontSize={24} />, path: "/" },
            {
              label: "Chamada",
              icon: <FaClipboardList fontSize={24} />,
              path: "/chamada",
            },
          ];
        } else if ((user as unknown as UserProps).level === 3) {
          items = [
            { label: "Início", icon: <FaHome fontSize={24} />, path: "/" },
            {
              label: "Responsáveis liber...",
              icon: <PiUserFocusBold fontSize={26} />,
              path: "/responsaveis/liberados",
            },
            {
              label: "Agendamentos",
              icon: <MdFormatListBulletedAdd fontSize={24} />,
              path: "/agendamentos",
            },
          ];
        }

        return items.filter((item: { label: string }) =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })()
    : [];

  const firstName =
    user && (user as unknown as UserProps).name
      ? (user as unknown as UserProps).name.split(" ")[0]
      : "";
  const lastName =
    user &&
    (user as unknown as UserProps).name &&
    user &&
    (user as unknown as UserProps).name.split(" ")[1]
      ? (user as unknown as UserProps).name.split(" ").slice(-1)[0]
      : "";

  return (
    //@ts-ignore
    <Card className="hidden xl:block h-svh relative w-full p-4 shadow-xl shadow-blue-gray-900/5 select-none">
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
        <div className="overflow-auto max-h-[calc(100vh-200px)] pb-10 ">
          {filteredItems.map((item: { path: To; icon: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; label: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
            // @ts-ignore
            <ListItem className="my-1" key={index} onClick={() => navigate(item.path)}>
              {/* @ts-ignore */}
              <ListItemPrefix>{item.icon}</ListItemPrefix>
              {item.label}
            </ListItem>
          ))}
        </div>

        <div className="fixed bottom-0 bg-white left-4 max-w-64 w-full">
          <hr className="my-3 mr-3 border-blue-gray-50" />

          <div className="flex justify-between items-center ml-2 mr-4 pb-4">
            <div className="flex gap-4 items-center whitespace-nowrap">
              <FaUserAlt fontSize={20} />
              <p className="flex gap-1" style={{ fontSize: 15 }}>
                <span>{firstName}</span>
                <span>{lastName}</span>
              </p>
            </div>

            <IoLogOutOutline
              onClick={LogOut}
              fontSize={32}
              title="Sair"
              className="cursor-pointer hover:bg-gray-100 p-1 rounded-md"
            />
          </div>
        </div>
      </List>
    </Card>
  );
};

export default Sidebar;
