
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriorityLevel } from "@/lib/types";
import { t } from "@/lib/translations";

interface TaskFormPriorityProps {
  value: PriorityLevel;
  onChange: (value: PriorityLevel) => void;
}

export const TaskFormPriority = ({ value, onChange }: TaskFormPriorityProps) => (
  <div className="space-y-2">
    <Label htmlFor="priority">{t('priority')}</Label>
    <Select
      value={value}
      onValueChange={(v) => onChange(v as PriorityLevel)}
    >
      <SelectTrigger>
        <SelectValue placeholder={t('select')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="baixa">{t('priority_low')}</SelectItem>
        <SelectItem value="media">{t('priority_medium')}</SelectItem>
        <SelectItem value="alta">{t('priority_high')}</SelectItem>
      </SelectContent>
    </Select>
  </div>
);
