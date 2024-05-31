import { Modal } from "flowbite-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { FormEvent, useContext, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaTrash } from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";
import { IoIosImages } from "react-icons/io";
import api from "@/api";
import { AuthContext, UserProps } from "@/contexts/AuthContext";
import { TbEyeClosed, TbLoader3 } from "react-icons/tb";
import { MdErrorOutline } from "react-icons/md";

const uploader = Uploader({
  apiKey: "free",
});

const options = { multi: true };

const ModalCompleteRegister = () => {
  const { user } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(true);
  const [link, setLink] = useState("");
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [degreeKinship, setDegreeKinship] = useState("");
  const [tabsValue, setTabsValue] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    toast(
      "É obrigatório que você complete o seu cadastro para acessar o sistema!",
      {
        position: "top-right",
        icon: "⚠️",
      }
    );
  };

  const updateData = async (e: FormEvent, level: number) => {
    e.preventDefault();

    let data = {}

    if (level == 3) {
      if (!link) {
        toast("É obrigatório cadastrar uma foto!", {
          position: "top-right",
          icon: "⚠️",
        });
  
        setError(true);
        return;
      }
  
      data = {
        image: link,
        degree_kinship: degreeKinship,
        email: email,
        password: password,
      };
    } else {
      data = {
        email: email,
        password: password,
      };
    }

    try {
      setLoading(true);

      const response = level == 3 ? await api.put(
        `/responsibles/complete/${(user as unknown as UserProps).id}`,
        data
      ) : await api.put(
        `/teachers/complete/${(user as unknown as UserProps).id}`,
        data
      );

      toast.success(response.data.message, {
        position: "top-right",
      });
      setOpenModal(false);
    } catch {
      toast.error("Ocorreu um erro ao atualizar os dados do responsável!");
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 4 && password.length > 0) {
      return "A senha precisa ter no mínimo 4 caracteres!";
    }

    if (password != confirmPassword) {
        return "As senhas não coincidem!";
    }
    
    return "";
  };

  const passwordError = validatePassword(password);
  const confirmPasswordError = validatePassword(confirmPassword);

  return (
    <Modal
      show={openModal}
      onClose={() => closeModal()}
      className=" select-none"
    >
      <Modal.Header>
        Complete seu <span className="text-primary-color">cadastro!</span>
      </Modal.Header>

      <Tabs
        defaultValue={tabsValue}
        value={tabsValue != "" ? tabsValue : ""}
        className="w-full"
      >
        <div className=" flex justify-center w-full mt-5">
          <TabsList>
            <TabsTrigger value="password">Alterar senha</TabsTrigger>
            <TabsTrigger value="data">Atualizar dados</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="password">
          <Modal.Body className="relative" style={{ maxHeight: "500px" }}>
            <div className="space-y-6 mb-5">
              <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium relative">
                <label htmlFor="password" className="flex justify-between mb-2 relative mr-12 ">
                  <div>
                    Nova senha: <span className="text-red-500">*</span>
                  </div>

                  {passwordError && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="absolute left-full -top-2 border-none bg-transparent h-9 hover:bg-transparent flex justify-center">
                          <MdErrorOutline
                            fontSize={19}
                            className="text-yellow-900 "
                          />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Aviso!</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="py-2 p-3 text-sm">
                            {passwordError}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </label>

                <Input
                  id="password"
                  required
                  type={open ? "text" : "password"}
                  value={password}
                  placeholder="Digite o sua senha..."
                  onChange={(e) => setPassword(e.target.value)}
                />

                <FaEye
                  fontSize={18}
                  onClick={() => setOpen(false)}
                  className={`${
                    open ? "block" : "hidden"
                  } absolute right-3 top-10 mt-0.5 cursor-pointer`}
                />
                <TbEyeClosed
                  onClick={() => setOpen(true)}
                  fontSize={18}
                  className={`${
                    open ? "hidden" : "block"
                  } absolute right-3 top-11 cursor-pointer`}
                />
              </div>

              <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium relative">
                <label
                  htmlFor="confirm_pass"
                  className="flex justify-between mb-2 relative mr-12"
                >
                  <div>
                    Confirmar senha: <span className="text-red-500">*</span>
                  </div>

                  {confirmPasswordError && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="absolute left-full -top-2 border-none bg-transparent h-9 hover:bg-transparent flex justify-center">
                            <MdErrorOutline
                              fontSize={19}
                              className="text-yellow-900 "
                            />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Aviso!</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <div className="py-2 p-3 text-sm">
                            {confirmPasswordError}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                </label>

                <Input
                  id="confirm_pass"
                  required
                  type={open2 ? "text" : "password"}
                  value={confirmPassword}
                  placeholder="Digite a senha de confirmação..."
                  className="relative"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <FaEye
                  fontSize={18}
                  onClick={() => setOpen2(false)}
                  className={`${
                    open2 ? "block" : "hidden"
                  } absolute right-3 top-10 mt-0.5 cursor-pointer`}
                />

                <TbEyeClosed
                  onClick={() => setOpen2(true)}
                  fontSize={18}
                  className={`${
                    open2 ? "hidden" : "block"
                  } absolute right-3 top-10 mt-0.5  cursor-pointer`}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
            <Button
              type="submit"
              onClick={() => setTabsValue("data")}
              disabled={
                !password ||
                !confirmPassword ||
                password != confirmPassword ||
                password.length < 4
              }
              className="bg-primary-color hover:bg-secondary-color"
            >
              Próximo
            </Button>
          </Modal.Footer>
        </TabsContent>
        <TabsContent value="data">
          <form onSubmit={(e) => updateData(e, (user as unknown as UserProps).level)}>
            <Modal.Body className="relative" style={{ maxHeight: "500px" }}>
              <div className="space-y-6 mb-5">
                {
                  (user as unknown as UserProps).level == 3 && (
                    <>
                      <UploadButton
                        uploader={uploader}
                        options={options}
                        onComplete={(files) =>
                          files.length > 0 &&
                          setLink(files.map((x) => x.fileUrl).join("\n"))
                        }
                      >
                        {({ onClick }) => (
                          <button
                            onClick={onClick}
                            className={`h-48 w-full border-dashed ${
                              error && !link && "border-red-500"
                            } border-2 rounded-lg relative text-md font-medium text-gray-700`}
                          >
                            {link ? (
                              <div className="flex justify-center">
                                <img
                                  src={link}
                                  className="w-32"
                                  alt="foto_professor"
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2 items-center justify-center ">
                                <IoIosImages fontSize={40} />
                                <p className="w-full text-sm md:text-lg">
                                  Clique aqui para selecionar uma imagem.
                                </p>
                              </div>
                            )}
                          </button>
                        )}
                      </UploadButton>
      
                      <FaTrash
                        fontSize={22}
                        onClick={() => setLink("")}
                        className={`${
                          link ? "block" : "hidden"
                        } absolute cursor-pointer top-4 right-9 hover:text-red-700 transition-all`}
                      />
                      
                      <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                        <label htmlFor="status">
                          Grau de parentesco: <span className="text-red-500">*</span>
                        </label>
                        <Select required onValueChange={(e) => setDegreeKinship(e)}>
                          <SelectTrigger className="w-full" id="status" name="status">
                            <SelectValue placeholder="Selecione o grau de parentesco com o aluno" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Pais">Pai ou Mãe</SelectItem>
                              <SelectItem value="Avós">Avô ou Avó</SelectItem>
                              <SelectItem value="Irmãos">Irmão ou Irmã</SelectItem>
                              <SelectItem value="Tios">Tio ou Tia</SelectItem>
                              <SelectItem value="Babá">Babá</SelectItem>
                              <SelectItem value="Escolar">
                                  Escolar (transporte)
                              </SelectItem>
                              <SelectItem value="Acompanhante">Acompanhante</SelectItem>
                              <SelectItem value="Primos">Primo ou Prima</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>

                  )
                }

                <div className="flex flex-col gap-1 text-gray-700 text-sm font-medium">
                  <label htmlFor="email">
                    E-mail: <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    required
                    type="email"
                    placeholder="Digite o seu e-mail..."
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

              </div>
            </Modal.Body>
            <Modal.Footer className="h-16 md:h-20 rounded-b-lg bg-white">
              <Button
                type="submit"
                className="bg-primary-color hover:bg-secondary-color"
              >
                {loading ? (
                  <div className="flex justify-center">
                    <TbLoader3 fontSize={23} style={{ animation: "spin 1s linear infinite" }}/>
                  </div>
                ) : "Salvar"}
              </Button>

              <Button
                className="bg-white text-black border border-gray-100 hover:bg-gray-100"
                onClick={() => setTabsValue("password")}
              >
                Voltar
              </Button>
            </Modal.Footer>
          </form>
        </TabsContent>
      </Tabs>
    </Modal>
  );
};

export default ModalCompleteRegister;
