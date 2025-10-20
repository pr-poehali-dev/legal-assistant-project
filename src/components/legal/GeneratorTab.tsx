import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const GeneratorTab = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Sparkles" size={24} className="text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground mb-2">SmartDoc Generator</h2>
            <p className="text-sm text-muted-foreground">
              Автоматическое создание процессуальных документов с подстановкой реквизитов и правовой базы
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Icon name="Settings" size={18} className="text-primary" />
            Параметры документа
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Тип документа</label>
              <Button variant="outline" className="w-full justify-between">
                Выберите тип документа
                <Icon name="ChevronDown" size={16} />
              </Button>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Статья УК/УПК РФ</label>
              <Input placeholder="Например: 158 ч.2 УК РФ" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Номер дела</label>
              <Input placeholder="1234567890" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Icon name="User" size={18} className="text-primary" />
            Данные участников
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">ФИО подозреваемого</label>
              <Input placeholder="Иванов Иван Иванович" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Дата рождения</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Адрес регистрации</label>
              <Input placeholder="г. Москва, ул. Ленина, д. 1" />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button className="flex-1 h-12" size="lg">
          <Icon name="Sparkles" size={20} className="mr-2" />
          Создать документ
        </Button>
        <Button variant="outline" size="lg" className="h-12">
          <Icon name="Save" size={20} className="mr-2" />
          Сохранить черновик
        </Button>
      </div>

      <Card className="p-4 bg-muted/50">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div className="flex-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Автоматическое заполнение</p>
            <p>Система автоматически подставит реквизиты вашего органа, должность, нормативную базу и практику Пленумов ВС РФ по выбранной статье.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GeneratorTab;
