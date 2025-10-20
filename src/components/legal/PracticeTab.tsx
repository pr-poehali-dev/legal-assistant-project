import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { CourtCase, COURT_PRACTICE_API } from './types';

const PracticeTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cases, setCases] = useState<CourtCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const searchPractice = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await fetch(`${COURT_PRACTICE_API}?article_code=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setCases(data.cases || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to load court practice:', error);
      setCases([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchPractice();
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Icon name="Scale" size={24} className="text-primary mt-1" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground mb-1">Поиск судебной практики</h2>
              <p className="text-sm text-muted-foreground">
                Введите статью УК РФ для поиска актуальных судебных решений
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Например: 158 УК РФ, 159 УК РФ, 228 УК РФ"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 h-12"
              />
            </div>
            <Button size="lg" onClick={searchPractice} disabled={!searchQuery.trim() || loading}>
              <Icon name="Search" size={20} className="mr-2" />
              Найти
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {['158 УК РФ', '159 УК РФ', '105 УК РФ', '228 УК РФ', '264 УК РФ'].map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => {
                  setSearchQuery(tag);
                  setTimeout(() => searchPractice(), 100);
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {loading ? (
        <Card className="p-12 text-center">
          <Icon name="Loader2" size={32} className="mx-auto mb-3 text-primary animate-spin" />
          <p className="text-muted-foreground">Поиск судебной практики...</p>
        </Card>
      ) : hasSearched ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Результаты поиска {total > 0 && `(${total})`}
            </h3>
            {searchQuery && (
              <Badge variant="outline" className="font-mono">
                {searchQuery}
              </Badge>
            )}
          </div>

          {cases.length > 0 ? (
            <ScrollArea className="h-[600px]">
              <div className="space-y-3 pr-4">
                {cases.map((courtCase) => (
                  <Card key={courtCase.id} className="p-5 hover:border-primary/50 transition-all">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="font-mono">
                              {courtCase.case_number}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {courtCase.decision_type}
                            </Badge>
                            <Badge className="text-xs bg-primary/10 text-primary border-primary/30">
                              {courtCase.article_code}
                            </Badge>
                          </div>
                          <h3 className="font-medium text-foreground mb-1 text-base">
                            {courtCase.court_name}
                          </h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Icon name="Calendar" size={14} />
                            {formatDate(courtCase.decision_date)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Обстоятельства дела
                          </p>
                          <p className="text-sm text-foreground leading-relaxed">
                            {courtCase.summary}
                          </p>
                        </div>

                        {courtCase.verdict && (
                          <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                            <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                              <Icon name="Gavel" size={14} />
                              Решение суда
                            </p>
                            <p className="text-sm font-medium text-foreground">
                              {courtCase.verdict}
                            </p>
                          </div>
                        )}
                      </div>

                      {courtCase.url && (
                        <div className="pt-2 border-t">
                          <a
                            href={courtCase.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <Icon name="ExternalLink" size={14} />
                            Полный текст решения
                          </a>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <Card className="p-12 text-center">
              <Icon name="Scale" size={48} className="mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Практика не найдена
              </h3>
              <p className="text-muted-foreground">
                По статье "{searchQuery}" судебная практика отсутствует в базе данных
              </p>
            </Card>
          )}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Icon name="Search" size={48} className="mx-auto mb-3 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Поиск судебной практики
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Введите статью УК РФ в поле поиска выше, чтобы найти актуальные судебные решения
            по интересующей вас категории дел
          </p>
        </Card>
      )}
    </div>
  );
};

export default PracticeTab;
