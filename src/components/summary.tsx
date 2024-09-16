import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import { InOrbitIcon } from "./in-orbit-icon";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { Separator } from "./ui/separator";
import { OutlineButton } from "./ui/outline-button";
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "../http/get-summary";
import dayjs from "dayjs";

import ptBR from "dayjs/locale/pt-BR";
import { PendingGoals } from "./pending-goals";

dayjs.locale(ptBR);

export function Summary() {
  const { data } = useQuery({
    // queryKey- -< sempre vai ser um ararye nele vamos passar uma identificação única para essa requisição
    queryKey: ["summary"],
    // queyFn -> quanl função vou executar para trazer os dados
    queryFn: getSummary,
    // cria um cach interno a cada milissegundos
    staleTime: 1000 * 60, // 60 seg
  });

  if (!data) {
    return;
  }

  const firstDayOfWeek = dayjs().startOf("week").format("D MMM");
  const lastDayOfWeek = dayjs().endOf("week").format("D MMM");

  const completedPorcentage = Math.round((data.completd * 100) / data.total);

  return (
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InOrbitIcon />

          <span className="text-lg font-semibold capitalize">
            {firstDayOfWeek} - {lastDayOfWeek}
          </span>
        </div>

        <DialogTrigger asChild>
          <Button type="button" size="sm">
            <Plus className="size-4" />
            Cadastrar metas
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress value={data.completd} max={data.total}>
          <ProgressIndicator style={{ width: `${completedPorcentage}%` }} />
        </Progress>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <p>
            Você completou <span className="text-slate-100">{data?.completd}</span> de{" "}
            <span className="text-slate-100">{data?.total}</span> metas nessa semana.
          </p>
          <span>{completedPorcentage}%</span>
        </div>

        <Separator />

        <PendingGoals />

        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-medium">Sua semana</h2>

          {Object.entries(data.goalsPerDay).map(([date, goals]) => {
            const weekDay = dayjs(date).format("dddd");
            const formattedDate = dayjs().format("D [de] MMMM");
            return (
              <div className="flex flex-col gap-4" key={date}>
                <h3 className="font-medium">
                  <span className="capitalize">{weekDay}</span>{" "}
                  <span className="text-slate-400 text-xs">({formattedDate})</span>
                </h3>

                <ul className="flex flex-col gap-3">
                  {goals.map((goal) => {
                    const time = dayjs(goal.completedAt).format("HH:mm");

                    return (
                      <li className="flex items-center gap-2" key={goal.id}>
                        <CheckCircle2 className="size-4 text-fuchsia-400" />
                        <span className="text-sm text-slate-400">
                          Você completou “<span className="text-slate-100">{goal.title}</span>” às{" "}
                          <span className="text-slate-100">{time}h</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
