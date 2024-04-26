import { SetStateAction, useState } from "react";
import logo from "../../assets/bravosLogoBlack.png";
import { BiSolidBusSchool } from "react-icons/bi";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Input,
} from "@material-tailwind/react";

import { PiChalkboardTeacherBold } from "react-icons/pi";
import { FaSchoolLock, FaUsers } from "react-icons/fa6";

import {
  ChevronRightIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { MdDisplaySettings } from "react-icons/md";

const Sidebar = () => {
  const [open, setOpen] = useState(0);
  const navigate = useNavigate();

  const handleOpen = (value: SetStateAction<number>) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    // @ts-ignore
    <Card className="hidden xl:block h-svh w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 select-none relative">
      <div className="mb-2 flex items-center gap-4 pt-4 pb-1">
        <img
          src={logo}
          alt="brand"
          className="h-16 cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>
      <div className="p-2">
        {/* @ts-ignore */}
        <Input
          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          label="Pesquisar..."
        />
      </div>
      {/* @ts-ignore */}
      <List>
        {/* @ts-ignore */}
        <ListItem onClick={() => navigate("/alunos")}>
          {/* @ts-ignore */}
          <ListItemPrefix>
            <FaUsers fontSize={24} />
          </ListItemPrefix>
          Alunos
        </ListItem>

        {/* @ts-ignore */}
        <ListItem onClick={() => navigate("/turmas")}>
          {/* @ts-ignore */}
          <ListItemPrefix>
            <BiSolidBusSchool fontSize={24} />
          </ListItemPrefix>
          Turmas
        </ListItem>

        {/* @ts-ignore */}
        <ListItem onClick={() => navigate("/professores")}>
          {/* @ts-ignore */}
          <ListItemPrefix>
            <PiChalkboardTeacherBold fontSize={25} />
          </ListItemPrefix>
          {/* @ts-ignore */}
          Professores
        </ListItem>

        {/* @ts-ignore */}
        <Accordion
          open={open === 2}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                open === 2 ? "rotate-180" : ""
              }`}
            />
          }
        >
          {/* @ts-ignore */}
          <ListItem className="p-0" selected={open === 2}>
            {/* @ts-ignore */}
            <AccordionHeader
              onClick={() => handleOpen(2)}
              className="border-b-0 p-3"
            >
              {/* @ts-ignore */}
              <ListItemPrefix>
                <MdDisplaySettings fontSize={25} />
              </ListItemPrefix>
              {/* @ts-ignore */}
              <Typography color="blue-gray" className="mr-auto">
                Controle de alunos
              </Typography>
            </AccordionHeader>
          </ListItem>

          <AccordionBody className="py-1">
            {/* @ts-ignore */}
            <List className="p-0">
              {/* @ts-ignore */}
              <ListItem onClick={() => navigate("/buscar")}>
                {/* @ts-ignore */}
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Buscar em sala
              </ListItem>
              {/* @ts-ignore */}
              <ListItem onClick={() => navigate("/chamada")}>
                {/* @ts-ignore */}
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Chamada
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>

        {/* @ts-ignore */}
        <Accordion
          open={open === 3}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                open === 3 ? "rotate-180" : ""
              }`}
            />
          }
        >
          {/* @ts-ignore */}
          <ListItem className="p-0" selected={open === 3}>
            {/* @ts-ignore */}
            <AccordionHeader
              onClick={() => handleOpen(3)}
              className="border-b-0 p-3"
            >
              {/* @ts-ignore */}
              <ListItemPrefix>
                <FaSchoolLock fontSize={24} />
              </ListItemPrefix>
              {/* @ts-ignore */}
              <Typography color="blue-gray" className="mr-auto">
                Controle de acesso
              </Typography>
            </AccordionHeader>
          </ListItem>

          <AccordionBody className="py-1">
            {/* @ts-ignore */}
            <List className="p-0">
              {/* @ts-ignore */}
              <ListItem onClick={() => navigate("/controle/alunos")}>
                {/* @ts-ignore */}
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Alunos
              </ListItem>
              {/* @ts-ignore */}
              <ListItem onClick={() => navigate("/controle/chamada")}>
                {/* @ts-ignore */}
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Chamada
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>

        <hr className="my-2 border-blue-gray-50" />
      </List>
    </Card>
  );
};

export default Sidebar;
