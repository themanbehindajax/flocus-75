
import React from "react";
import { CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const PomodoroTips: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dicas para o Pomodoro</CardTitle>
        <CardDescription>Maximize sua produtividade com estas práticas</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-2 sm:grid-cols-2">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-1 text-primary" />
            <span>Foque em uma única tarefa durante cada pomodoro</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-1 text-primary" />
            <span>Elimine distrações como notificações</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-1 text-primary" />
            <span>Levante-se e alongue-se durante as pausas</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-1 text-primary" />
            <span>Após 4 pomodoros, faça uma pausa mais longa</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};
