import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Article } from './types';

interface SearchTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loading: boolean;
  displayArticles: Article[];
  selectArticle: (code: string) => void;
  selectedArticle: Article | null;
  setSelectedArticle: (article: Article | null) => void;
}

const quickActions = [
  { id: '1', label: 'Возбудить УД', icon: 'FileText', color: 'bg-blue-600' },
  { id: '2', label: 'Протокол допроса', icon: 'MessageSquare', color: 'bg-cyan-600' },
  { id: '3', label: 'Осмотр места', icon: 'MapPin', color: 'bg-teal-600' },
  { id: '4', label: 'Запрос в банк', icon: 'Building2', color: 'bg-indigo-600' },
  { id: '5', label: 'Назначить экспертизу', icon: 'FlaskConical', color: 'bg-violet-600' },
  { id: '6', label: 'Продлить срок', icon: 'CalendarClock', color: 'bg-purple-600' }
];

const SearchTab = ({
  searchQuery,
  setSearchQuery,
  loading,
  displayArticles,
  selectArticle,
  selectedArticle,
  setSelectedArticle
}: SearchTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
        <div className="space-y-4">
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Введите статью УК РФ или описание события (например: 158 ч.2, кража с проникновением)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['158 УК РФ', '159 УК РФ', '228 УК РФ', '264 УК РФ', '146 УПК РФ'].map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setSearchQuery(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Card
            key={action.id}
            className="p-4 hover:border-primary/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className={`${action.color} h-12 w-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon name={action.icon as any} size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{action.label}</h3>
                <p className="text-xs text-muted-foreground">Быстрое действие</p>
              </div>
              <Icon name="ChevronRight" size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Icon name="BookOpen" size={20} />
          {searchQuery ? `Результаты поиска (${displayArticles.length})` : 'Часто используемые статьи'}
        </h2>
        {loading ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Поиск...</p>
          </Card>
        ) : displayArticles.length > 0 ? (
          <div className="grid gap-3">
            {displayArticles.map((article) => (
              <Card 
                key={article.id} 
                className="p-4 hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => selectArticle(article.code)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="font-mono text-xs">
                        {article.code}
                      </Badge>
                      <h3 className="font-medium text-foreground">{article.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{article.description}</p>
                    {article.punishment && (
                      <div className="flex items-start gap-2 text-xs">
                        <Badge variant="secondary" className="text-xs">
                          {article.category}
                        </Badge>
                        <span className="text-muted-foreground">{article.punishment}</span>
                      </div>
                    )}
                  </div>
                  <Icon name="ExternalLink" size={16} className="text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        ) : searchQuery ? (
          <Card className="p-8 text-center">
            <Icon name="Search" size={32} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Ничего не найдено по запросу "{searchQuery}"</p>
          </Card>
        ) : null}
      </div>

      {selectedArticle && (
        <Card className="p-6 border-primary/30 bg-primary/5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge variant="outline" className="font-mono mb-2">{selectedArticle.code}</Badge>
              <h2 className="text-xl font-bold text-foreground">{selectedArticle.title}</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedArticle(null)}>
              <Icon name="X" size={20} />
            </Button>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Описание</p>
              <p className="text-foreground">{selectedArticle.description}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Категория</p>
              <Badge variant="secondary">{selectedArticle.category}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Санкция</p>
              <p className="text-foreground">{selectedArticle.punishment}</p>
            </div>
            <div className="flex gap-2 pt-3">
              <Button className="flex-1">
                <Icon name="FileText" size={16} className="mr-2" />
                Создать документ
              </Button>
              <Button variant="outline">
                <Icon name="BookOpen" size={16} className="mr-2" />
                Судебная практика
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SearchTab;
