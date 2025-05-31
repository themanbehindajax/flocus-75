
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { t } from "@/lib/translations";

interface TaskFormDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

export const TaskFormDescription = ({ value, onChange }: TaskFormDescriptionProps) => (
  <div className="space-y-2">
    <Label htmlFor="description">{t('description')}</Label>
    <Textarea
      id="description"
      placeholder={t('task_description_placeholder')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
