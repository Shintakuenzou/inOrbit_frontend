import { Dialog } from "./components/ui/dialog";
import { CreateGoal } from "./components/create-goal";
import { Summary } from "./components/summary";
import { EmpryGoals } from "./components/empty-goals";
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "./http/get-summary";

export function App() {
  const { data } = useQuery({
    // queryKey- -< sempre vai ser um ararye nele vamos passar uma identificação única para essa requisição
    queryKey: ["summary"],
    // queyFn -> quanl função vou executar para trazer os dados
    queryFn: getSummary,
    // cria um cach interno a cada milissegundos
    staleTime: 1000 * 60, // 60 seg
  });

  return (
    <Dialog>
      {data?.total && data?.total > 0 ? <Summary /> : <EmpryGoals />}

      <CreateGoal />
    </Dialog>
  );
}
