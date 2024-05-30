import api from "@/api";
import { useContext, useState } from "react";
import { PiStudentBold, PiChalkboardTeacherBold } from "react-icons/pi";
import { FaUserTie } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { AuthContext, UserProps } from "@/contexts/AuthContext";
import ModalResponsible from "@/components/modalResponsible";

interface StatisticsProps {
  students: number;
  teachers: number;
  responsibles: number;
  classes: number;
  responsibles_released: number;
}

function Home() {
  const { user } = useContext(AuthContext);
  const [statistics, setStatistics] = useState<StatisticsProps[]>([]);
  const navigate = useNavigate();

  useState(() => {
    const getStatistics = async () => {
      const response = await api.get("/statistics");

      setStatistics([response.data]);
    };

    const getStatisticsResponsibles = async () => {
      const response = await api.get(`/statistics/responsibles/${(user as unknown as UserProps).id}`);

      setStatistics([response.data]);
    };

    if ((user as unknown as UserProps).level != 3) {
      getStatistics();
    }

    if ((user as unknown as UserProps).level == 3) {
      getStatisticsResponsibles();
    }
  });

  return (
    <main>
      { statistics &&
        statistics.map((s) => {
          return (
            <section key={s.classes} className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
              {
                (user as unknown as UserProps).level != 3 ? (
                  <>
                    <div onClick={() => navigate("/alunos")} className="flex flex-col gap-20 shadow-md h-52 p-5 rounded-lg bg-white cursor-pointer">
                      <p className="text-lg md:text-2xl font-bold">Alunos</p>

                      <div className="flex justify-between w-full">
                        <PiStudentBold fontSize={34}/>
                        <p className="text-3xl font-bold">{s.students}</p>
                      </div>
                    </div>

                    <div onClick={() => navigate("/turmas")} className="flex flex-col gap-20 shadow-md h-52 p-5 rounded-lg bg-white cursor-pointer ">
                      <p className="text-lg md:text-2xl font-bold">Turmas</p>

                      <div className="flex justify-between w-full">
                        <SiGoogleclassroom fontSize={31} />
                        <p className="text-3xl font-bold">{s.classes}</p>
                      </div>
                    </div>

                    <div onClick={() => navigate("/responsaveis")} className="flex flex-col gap-20 shadow-md h-52 p-5 rounded-lg bg-white cursor-pointer ">
                      <p className="text-lg md:text-2xl font-bold">Responsáveis</p>

                      <div className="flex justify-between w-full">
                        <FaUserTie fontSize={28} />
                        <p className="text-3xl font-bold">{s.responsibles}</p>
                      </div>
                    </div>

                    <div onClick={() => navigate("/professores")} className="flex flex-col gap-20 shadow-md h-52 p-5 rounded-lg bg-white cursor-pointer ">
                      <p className="text-lg md:text-2xl font-bold">Professores</p>

                      <div className="flex justify-between w-full">
                        <PiChalkboardTeacherBold fontSize={34} />
                        <p className="text-3xl font-bold">{s.teachers}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div onClick={() => navigate("/responsaveis/liberados")} className="flex flex-col gap-20 shadow-md h-52 p-5 rounded-lg bg-white cursor-pointer ">
                    <p className="text-lg md:text-2xl font-bold">Responsáveis liberados</p>
    
                    <div className="flex justify-between w-full">
                      <FaUserTie fontSize={34} />
                      <p className="text-3xl font-bold">{s.responsibles_released}</p>
                    </div>
                  </div>
                )
              }
            </section>
          );
        })}

        {
          ((user as unknown as UserProps).level == 3 && (user as unknown as UserProps).complete_register == 0) && (
            <ModalResponsible />
          )
        }
    </main>
  );
}

export default Home;
