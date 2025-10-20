import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Document } from './types';

interface DocumentsTabProps {
  documents: Document[];
}

const DocumentsTab = ({ documents }: DocumentsTabProps) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default DocumentsTab;
