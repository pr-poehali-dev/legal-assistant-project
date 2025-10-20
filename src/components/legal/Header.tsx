import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Header = () => {
  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Scale" size={24} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Правовой Ассистент</h1>
              <p className="text-xs text-muted-foreground">Следователя СК РФ</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Icon name="User" size={16} />
            Личный кабинет
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
