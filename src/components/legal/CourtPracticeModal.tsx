import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { CourtCase, COURT_PRACTICE_API } from './types';

interface CourtPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleCode: string;
}

const CourtPracticeModal = ({ isOpen, onClose, articleCode }: CourtPracticeModalProps) => {
  const [cases, setCases] = useState<CourtCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (isOpen && articleCode) {
      loadCourtPractice();
    }
  }, [isOpen, articleCode]);

  const loadCourtPractice = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${COURT_PRACTICE_API}?article_code=${encodeURIComponent(articleCode)}`);
      const data = await response.json();
      setCases(data.cases || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to load court practice:', error);
    } finally {
      setLoading(false);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Scale" size={24} className="text-primary" />
            Судебная практика по статье {articleCode}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Загрузка судебной практики...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Найдено решений: <span className="font-semibold text-foreground">{total}</span>
              </p>
              <Badge variant="outline">{articleCode}</Badge>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="space-y-3 pr-4">
                {cases.length > 0 ? (
                  cases.map((courtCase) => (
                    <Card key={courtCase.id} className="p-4 hover:border-primary/50 transition-all">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="font-mono text-xs">
                                {courtCase.case_number}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {courtCase.decision_type}
                              </Badge>
                            </div>
                            <h3 className="font-medium text-foreground mb-1">{courtCase.court_name}</h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Icon name="Calendar" size={14} />
                              {formatDate(courtCase.decision_date)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Обстоятельства дела</p>
                            <p className="text-sm text-foreground">{courtCase.summary}</p>
                          </div>

                          {courtCase.verdict && (
                            <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                              <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                <Icon name="Gavel" size={14} />
                                Решение суда
                              </p>
                              <p className="text-sm font-medium text-foreground">{courtCase.verdict}</p>
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
                  ))
                ) : (
                  <Card className="p-8 text-center">
                    <Icon name="Scale" size={32} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Судебная практика по данной статье не найдена</p>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CourtPracticeModal;
