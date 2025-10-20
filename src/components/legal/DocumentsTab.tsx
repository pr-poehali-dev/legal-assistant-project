import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { useToast } from '@/components/ui/use-toast';
import { Document } from './types';

interface DocumentsTabProps {
  documents: Document[];
}

const DocumentsTab = ({ documents }: DocumentsTabProps) => {
  const [selectedCategory, setSelectedCategory] = useState('Все документы');
  const { toast } = useToast();

  const categories = ['Все документы', 'Постановления', 'Протоколы', 'Ходатайства', 'Уведомления'];

  const filteredDocuments = selectedCategory === 'Все документы'
    ? documents
    : documents.filter(doc => doc.category === selectedCategory);

  const getCategoryCount = (category: string) => {
    if (category === 'Все документы') return documents.length;
    return documents.filter(doc => doc.category === category).length;
  };

  const handleExportPDF = (doc: Document) => {
    toast({
      title: 'Экспорт начат',
      description: `Документ "${doc.title}" экспортируется в PDF...`,
    });

    setTimeout(() => {
      toast({
        title: 'Готово!',
        description: 'Документ успешно экспортирован в PDF',
      });
    }, 1500);
  };
  return (
    <div className="space-y-6">
      <div className="grid gap-3">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            className="justify-start h-auto py-3 text-left"
            onClick={() => setSelectedCategory(category)}
          >
            <Icon name="Folder" size={18} className="mr-3 flex-shrink-0" />
            <span className="flex-1">{category}</span>
            <Badge variant={selectedCategory === category ? 'secondary' : 'outline'} className="ml-2">
              {getCategoryCount(category)}
            </Badge>
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="FileText" size={20} />
            {selectedCategory === 'Все документы' ? 'Библиотека документов' : selectedCategory}
          </h2>
          <Badge variant="secondary">{filteredDocuments.length}</Badge>
        </div>
        <ScrollArea className="h-[500px] rounded-lg border border-border">
          <div className="p-4 space-y-3">
            {filteredDocuments.length > 0 ? filteredDocuments.map((doc) => (
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
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleExportPDF(doc)}>
                      <Icon name="FileDown" size={16} />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Icon name="Eye" size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            )) : (
              <Card className="p-8 text-center">
                <Icon name="FolderOpen" size={32} className="mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Нет документов в категории "{selectedCategory}"</p>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default DocumentsTab;