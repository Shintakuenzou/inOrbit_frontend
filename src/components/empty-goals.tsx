import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";

import logo from "../assets/logo-in-orbit.svg";
import letsstarts from "../assets/lets-starts.svg";

export function EmpryGoals() {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-8">
      <img src={logo} alt="in.orbit" />
      <img src={letsstarts} alt="" />

      <p className="text-slate-300 leading-relaxed max-w-80 text-center">
        Você ainda não cadastrou nenhuma meta, que tal cadastrar um agora mesmo?
      </p>

      <DialogTrigger asChild>
        <Button type="button">
          <Plus className="size-4" />
          Cadastrar metas
        </Button>
      </DialogTrigger>
    </div>
  );
}
