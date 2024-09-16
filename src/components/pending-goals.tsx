import { Plus } from "lucide-react";
import { OutlineButton } from "./ui/outline-button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPendingGoals } from "../http/get-pending-goals";
import { createGoalCompletion } from "../http/create-goal-completion";

export function PendingGoals() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    // queryKey- -< sempre vai ser um ararye nele vamos passar uma identificação única para essa requisição
    queryKey: ["pending-goals"],
    // queyFn -> quanl função vou executar para trazer os dados
    queryFn: getPendingGoals,
    // cria um cach interno a cada milissegundos
    staleTime: 1000 * 60, // 60 seg
  });

  if (!data) {
    return null;
  }

  async function handleCompleteGoal(goalId: string) {
    console.log(goalId);

    await createGoalCompletion(goalId);


    // Faz uma invalidação das querys e por baixo dos panos ela é feita de novo
    // faz os recarregamentos dos dados
    queryClient.invalidateQueries({ queryKey: ["summary"] });
    queryClient.invalidateQueries({ queryKey: ["pending-goals"] });
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {data.map((goal) => {
        return (
          <OutlineButton
            key={goal.id}
            disabled={goal.completionCount >= goal.desiredWeeklyFrequency}
            onClick={() => handleCompleteGoal(goal.id)}
          >
            <Plus className="size-4 text-slate-600" />
            {goal.title}
          </OutlineButton>
        );
      })}
    </div>
  );
}
