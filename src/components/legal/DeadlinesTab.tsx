import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Deadline } from './types';

interface DeadlinesTabProps {
  deadlines: Deadline[];
}

const getDaysUntil = (dateStr: string) => {
  const today = new Date();
  const deadline = new Date(dateStr);
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const DeadlinesTab = ({ deadlines }: DeadlinesTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6 border-primary/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Календарь процессуальных сроков</h2>
            <p className="text-sm text-muted-foreground mt-1">Автоматический расчёт и напоминания</p>
          </div>
          <Button size="sm" className="gap-2">
            <Icon name="Plus" size={16} />
            Добавить срок
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card className="p-4 bg-red-500/10 border-red-500/30">
            <div className="flex items-center justify-between mb-2">
              <Icon name="AlertTriangle" size={20} className="text-red-400" />
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Критично</Badge>
            </div>
            <div className="text-2xl font-bold text-red-400">2</div>
            <div className="text-sm text-muted-foreground">Истекают в ближайшие 7 дней</div>
          </Card>

          <Card className="p-4 bg-yellow-500/10 border-yellow-500/30">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Clock" size={20} className="text-yellow-400" />
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Внимание</Badge>
            </div>
            <div className="text-2xl font-bold text-yellow-400">1</div>
            <div className="text-sm text-muted-foreground">До 30 дней</div>
          </Card>

          <Card className="p-4 bg-green-500/10 border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <Icon name="CheckCircle2" size={20} className="text-green-400" />
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Норма</Badge>
            </div>
            <div className="text-2xl font-bold text-green-400">5</div>
            <div className="text-sm text-muted-foreground">Активных дел</div>
          </Card>
        </div>

        <div className="space-y-3">
          {deadlines.map((deadline) => {
            const daysLeft = getDaysUntil(deadline.date);
            return (
              <Card
                key={deadline.id}
                className={`p-4 ${getPriorityColor(deadline.priority)} border`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs font-mono">
                        {deadline.article}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {daysLeft > 0 ? `Через ${daysLeft} дн.` : 'Просрочено'}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-foreground mb-1">{deadline.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Срок: {new Date(deadline.date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Icon name="Bell" size={16} />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      <Card className="p-4 bg-muted/50">
        <div className="flex items-start gap-3">
          <Icon name="Lightbulb" size={20} className="text-primary mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="font-medium text-foreground mb-1">Умные напоминания</p>
            <p className="text-muted-foreground">
              Система автоматически рассчитывает процессуальные сроки и отправляет уведомления за 7, 3 и 1 день до истечения.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DeadlinesTab;
