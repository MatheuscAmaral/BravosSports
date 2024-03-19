import { SetStateAction, useState } from "react";
import logo from "../../assets/bravosLogoBlack.png";
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

import { PiChalkboardTeacherBold, PiUserCircleGearFill, PiUserFocusBold} from "react-icons/pi";
import { FaSchoolLock, FaUsers } from "react-icons/fa6";
import { TbLogout } from "react-icons/tb";

import {
  ChevronRightIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
 
 const Sidebar = () => {
  const [open, setOpen] = useState(0);
 
  const handleOpen = (value: SetStateAction<number>) => {
    setOpen(open === value ? 0 : value);
  };
 
  return (
    <Card className="h-svh w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 select-none relative">
      <div className="mb-2 flex items-center gap-4 pt-4 pb-1">
        <img src={logo} alt="brand" className="h-16" />
      </div>
      <div className="p-2">
        <Input icon={<MagnifyingGlassIcon className="h-5 w-5" />} label="Pesquisar..." />
      </div>
      <List>
        <ListItem>
          <ListItemPrefix>
            <FaUsers fontSize={24} />
          </ListItemPrefix>
          Alunos
        </ListItem>

        <Accordion
          open={open === 2}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
            />
          }
        >
          <ListItem className="p-0" selected={open === 2}>
            <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3">
              <ListItemPrefix>
                <PiChalkboardTeacherBold fontSize={25} />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto">
                Professores
              </Typography>
            </AccordionHeader>
          </ListItem>

          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Buscar em sala
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Chamada
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>

        <Accordion
          open={open === 3}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
            />
          }
        >
          <ListItem className="p-0" selected={open === 3}>
            <AccordionHeader onClick={() => handleOpen(3)} className="border-b-0 p-3">
              <ListItemPrefix>
                <FaSchoolLock fontSize={24} />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto">
                Controle de acesso
              </Typography>
            </AccordionHeader>
          </ListItem>

          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Alunos
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                Chamada
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>

        <hr className="my-2 border-blue-gray-50" />

        <ListItem>
          <ListItemPrefix>
            <PiUserCircleGearFill fontSize={24}/>
          </ListItemPrefix>
          Configurações
        </ListItem>

      </List>

      <section className="flex justify-between items-center pl-3 pr-10 fixed bottom-5 w-80">
        <div className="flex justify-center gap-2 items-center">
            <PiUserFocusBold fontSize={24}/>
            
            <p className="text-sm font-semibold">Matheus Amaral</p>
        </div>

        <TbLogout fontSize={22}/>
      </section>
    </Card>
  );
}

export default Sidebar;