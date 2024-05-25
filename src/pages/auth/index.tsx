import { Input } from "@/components/ui/input";
import wallpaper from "../../assets/walpp.jpg";
import logo from "../../assets/logo-bravos-laranja.png";
import api from "@/api";
import { FormEvent, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { TbLoader3 } from "react-icons/tb";
import { TbEyeClosed } from "react-icons/tb";
import { FaEye } from "react-icons/fa";
import { MdAbc } from "react-icons/md";

function Auth() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    const lastVisitedRoute = localStorage.getItem("@bravosSports:lastVisitedRoute");

    if (lastVisitedRoute) {
      navigate(lastVisitedRoute);
    }
  }, []);

  const LogIn = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const data = {
        user: user,
        password: password,
    };

    try {
        const response = await api.post("/users/login", data);

        authUser(response.data);
        localStorage.setItem("@bravosSports:user", JSON.stringify(response.data));
        navigate("/");
        toast.success("Usuário logado com sucesso!", {
            position: "top-right"
        });
        setError1(false);
        setError2(false);
    } catch (err: any) {
        if (err.response) {
           toast.error(err.response.data.error, {
                position: "top-right"
            });
        } else {
            toast.error("Ocorreu um erro ao entrar em contato com o servidor.", {
                position: "top-right"
            });
        }
        setError1(true);
        setError2(true);
    } finally {
        setLoading(false);
    }
};


  return (
    <main className="flex mx-7 md:mx-0 mt-20 md:mt-0">
      <section className="relative hidden lg:block max-w-5xl">
        <img src={wallpaper} className="h-svh" style={{ filter: "blur(3px)" }}/>

        <div
          className="absolute inset-0 flex justify-center items-center"
          style={{ backgroundColor: "rgba(218, 52, 2, 0.24)" }}
        >
          <img src={logo} className="w-80" />
        </div>
      </section>

      <section className="md:px-10 max-w-5xl w-full">
        <form
          onSubmit={(e) => LogIn(e)}
          className="max-w-2xl mt-20 md:mt-32 lg:mt-0 justify-center h-full mx-auto w-full flex flex-col gap-7"
        >
          <h3 className="text-3xl font-bold text-center hidden lg:block">
            Entrar
          </h3>
          <div className="flex justify-center lg:hidden">
            <img src={logo} className="w-72" />
          </div>

          <div className="flex flex-col gap-2 text-sm text-gray-600 relative">
            <label htmlFor="user">Usuário:</label>
            <Input
              id="user"
              placeholder="Digite seu nome de usuário "
              onChange={(e) => setUser(e.target.value)}
              className={`${error1 ? "border-red-600" : ""}`}
              type="text"
              required
            />
            <MdAbc fontSize={25} className={` absolute right-3 top-9`} />
          </div>

          <div className="flex flex-col gap-2 text-sm text-gray-600 relative">
            <label htmlFor="password">Senha:</label>
            <Input
              id="user"
              placeholder="Digite sua senha"
              onChange={(e) => setPassword(e.target.value)}
              className={`${error2 ? "border-red-600" : ""}`}
              type={open ? "text" : "password"}
              required
            />
            <FaEye fontSize={18} onClick={() => setOpen(false)}  className={`${open ? "block" : "hidden"} absolute right-3 top-10`} />
            <TbEyeClosed onClick={() => setOpen(true)} fontSize={18} className={`${open ? "hidden" : "block"} absolute right-3 top-10`}/>
          </div>

          <button
            type="submit"
            className=" text-white p-3 rounded-md border-0"
            style={{backgroundColor: "#F43806"}}
          >
            {
              loading ? <TbLoader3 /> : "Entrar"
            }
          </button>
        </form>
      </section>
    </main>
  );
}

export default Auth;
