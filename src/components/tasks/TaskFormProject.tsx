
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/lib/types";
import { t } from "@/lib/translations";

interface TaskFormProjectProps {
  projectId: string | undefined;
  setProjectId: (id: string | undefined) => void;
  projects: Project[];
  disabled?: boolean;
}

export const TaskFormProject = ({ projectId, setProjectId, projects, disabled = false }: TaskFormProjectProps) => (
  <div className="space-y-2">
    <Label htmlFor="project">{t('project')}</Label>
    <Select
      value={projectId || "none"}
      onValueChange={(value) => setProjectId(value === "none" ? undefined : value)}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder={t('select_project')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">{t('no_project')}</SelectItem>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            {project.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {disabled && projectId && (
      <p className="text-xs text-muted-foreground mt-1">
        {t('project_preselected')}
      </p>
    )}
  </div>
);
