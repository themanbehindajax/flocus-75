
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { t } from "@/lib/translations";

interface TaskFormTitleProps {
  value: string;
  onChange: (value: string) => void;
}

export const TaskFormTitle = ({ value, onChange }: TaskFormTitleProps) => (
  <div className="space-y-2">
    <Label htmlFor="title">{t('title')}</Label>
    <Input
      id="title"
      placeholder={t('task_title_placeholder')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
