import { X } from "lucide-react";
import { Button } from "./ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from "./ui/radio-group";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGoal } from "../http/create-goal";
import { useQueryClient } from "@tanstack/react-query";

const createGoalSchema = z.object({
  title: z.string().min(1, "Informe a atividade que deseja realizar"),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
});

type CreateGoalForm = z.infer<typeof createGoalSchema>;

export function CreateGoal() {
  const queryClient = useQueryClient();

  const { register, control, handleSubmit, formState, reset } = useForm<CreateGoalForm>({
    resolver: zodResolver(createGoalSchema),
  });

  async function handleCreateGoal(data: CreateGoalForm) {
    // console.log(data);
    await createGoal({
      title: data.title,
      desiredWeeklyFrequency: data.desiredWeeklyFrequency,
    });

    // Faz uma invalidação das querys e por baixo dos panos ela é feita de novo
    // faz os recarregamentos dos dados
    queryClient.invalidateQueries({ queryKey: ["summary"] });
    queryClient.invalidateQueries({ queryKey: ["pending-goals"] });

    reset();
  }

  return (
    <DialogContent>
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <DialogTitle className="font-semibold text-lg">Cadastrar meta</DialogTitle>

            <DialogClose>
              <X className="size-5 text-slate-500" />
            </DialogClose>
          </div>

          <DialogDescription className="text-slate-400 text-sm">
            Adicione atividades que <span className="underline">te fazem bem</span> e que você quer
            continuar praticando toda semana.
          </DialogDescription>
        </div>

        <form
          onSubmit={handleSubmit(handleCreateGoal)}
          className="flex flex-col justify-between flex-1"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Qual a atividade?</Label>
              <Input
                id="title"
                autoFocus
                placeholder="praticar exercícios, meditar, etc...."
                {...register("title")}
              />

              {formState.errors.title && (
                <p className="text-red-400 text-sm">{formState.errors.title.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Quantas vezes na semana?</Label>
              <Controller
                control={control}
                name="desiredWeeklyFrequency"
                defaultValue={3}
                //  formState -> serve para buscar os dados do formulario
                //  fieldState -> serve para buscar informações deste campo em especifico
                //  field -> serve para modificar o valor desse campo manualmente
                render={({ field }) => {
                  return (
                    <RadioGroup onValueChange={field.onChange} value={String(field.value)}>
                      <RadioGroupItem value="1">
                        <RadioGroupIndicator />
                        <span className="text-sm text-slate-300 font-medium leading-none">
                          1X na semana
                        </span>
                        <span className="text-lg leading-none">🥱</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="2">
                        <RadioGroupIndicator />
                        <span className="text-sm text-slate-300 font-medium leading-none">
                          2X na semana
                        </span>
                        <span className="text-lg leading-none">🙂</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="3">
                        <RadioGroupIndicator />
                        <span className="text-sm text-slate-300 font-medium leading-none">
                          3X na semana
                        </span>
                        <span className="text-lg leading-none">😎</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="4">
                        <RadioGroupIndicator />
                        <span className="text-sm text-slate-300 font-medium leading-none">
                          4X na semana
                        </span>
                        <span className="text-lg leading-none">😜</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="5">
                        <RadioGroupIndicator />
                        <span className="text-sm text-slate-300 font-medium leading-none">
                          5X na semana
                        </span>
                        <span className="text-lg leading-none">🤨</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="6">
                        <RadioGroupIndicator />
                        <span className="text-sm text-slate-300 font-medium leading-none">
                          6X na semana
                        </span>
                        <span className="text-lg leading-none">🤯</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="7">
                        <RadioGroupIndicator />
                        <span className="text-sm text-slate-300 font-medium leading-none">
                          Todos os dias da semana
                        </span>
                        <span className="text-lg leading-none">🔥</span>
                      </RadioGroupItem>
                    </RadioGroup>
                  );
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DialogClose asChild>
              <Button type="button" className="flex-1" variant="secondary">
                Fechar
              </Button>
            </DialogClose>

            <Button className="flex-1">Salvar</Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}
