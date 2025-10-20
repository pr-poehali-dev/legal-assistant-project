import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Article {
  id: number;
  code: string;
  title: string;
  description: string;
  category: string;
  punishment: string;
}

interface Document {
  id: number;
  title: string;
  category: string;
  code: string;
  description: string;
}

interface Deadline {
  id: string;
  title: string;
  date: string;
  article: string;
  priority: 'high' | 'medium' | 'low';
}

const ARTICLES_API = 'https://functions.poehali.dev/548d9cd5-f7d1-4b22-9d02-284a5b6a60a6';
const DOCUMENTS_API = 'https://functions.poehali.dev/6d698c6a-0961-4d17-9256-332c35b53aeb';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [articles, setArticles] = useState<Article[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    loadArticles();
    loadDocuments();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchArticles();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadArticles = async () => {
    try {
      const response = await fetch(ARTICLES_API);
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Failed to load articles:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await fetch(DOCUMENTS_API);
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const searchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${ARTICLES_API}?search=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectArticle = async (code: string) => {
    try {
      const response = await fetch(`${ARTICLES_API}?code=${encodeURIComponent(code)}`);
      const data = await response.json();
      setSelectedArticle(data);
    } catch (error) {
      console.error('Failed to load article:', error);
    }
  };

  const deadlines: Deadline[] = [
    {
      id: '1',
      title: 'Срок предварительного следствия',
      date: '2025-11-15',
      article: 'УПК РФ ст. 162',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Срок содержания под стражей',
      date: '2025-11-01',
      article: 'УПК РФ ст. 109',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Срок производства экспертизы',
      date: '2025-10-30',
      article: 'УПК РФ ст. 195',
      priority: 'medium'
    }
  ];

  const quickActions = [
    { id: '1', label: 'Возбудить УД', icon: 'FileText', color: 'bg-blue-600' },
    { id: '2', label: 'Протокол допроса', icon: 'MessageSquare', color: 'bg-cyan-600' },
    { id: '3', label: 'Осмотр места', icon: 'MapPin', color: 'bg-teal-600' },
    { id: '4', label: 'Запрос в банк', icon: 'Building2', color: 'bg-indigo-600' },
    { id: '5', label: 'Назначить экспертизу', icon: 'FlaskConical', color: 'bg-violet-600' },
    { id: '6', label: 'Продлить срок', icon: 'CalendarClock', color: 'bg-purple-600' }
  ];

  const displayArticles = searchResults.length > 0 ? searchResults : articles.slice(0, 10);

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

  return (
    <div className="min-h-screen bg-background">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="search" className="gap-2">
              <Icon name="Search" size={16} />
              Поиск
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <Icon name="FolderOpen" size={16} />
              Документы
            </TabsTrigger>
            <TabsTrigger value="generator" className="gap-2">
              <Icon name="Sparkles" size={16} />
              SmartDoc
            </TabsTrigger>
            <TabsTrigger value="deadlines" className="gap-2">
              <Icon name="CalendarClock" size={16} />
              Сроки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="grid gap-3">
              {['Все документы', 'Постановления', 'Протоколы', 'Ходатайства', 'Уведомления'].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className="justify-start h-auto py-3 text-left"
                >
                  <Icon name="Folder" size={18} className="mr-3 flex-shrink-0" />
                  <span className="flex-1">{category}</span>
                  <Badge variant="secondary" className="ml-2">
                    {category === 'Все документы' ? documents.length : Math.floor(Math.random() * 10 + 3)}
                  </Badge>
                </Button>
              ))}
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Icon name="FileText" size={20} />
                Библиотека документов
              </h2>
              <ScrollArea className="h-[500px] rounded-lg border border-border">
                <div className="p-4 space-y-3">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="p-4 hover:border-primary/50 transition-all cursor-pointer">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start gap-2">
                            <Icon name="FileText" size={18} className="text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <h3 className="font-medium text-foreground mb-1">{doc.title}</h3>
                              <p className="text-sm text-muted-foreground">{doc.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{doc.category}</Badge>
                            <Badge variant="secondary" className="text-xs font-mono">{doc.code}</Badge>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Icon name="Download" size={16} />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="generator" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="deadlines" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;