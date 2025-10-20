import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import Header from '@/components/legal/Header';
import SearchTab from '@/components/legal/SearchTab';
import DocumentsTab from '@/components/legal/DocumentsTab';
import GeneratorTab from '@/components/legal/GeneratorTab';
import DeadlinesTab from '@/components/legal/DeadlinesTab';
import PracticeTab from '@/components/legal/PracticeTab';
import { Article, Document, Deadline, ARTICLES_API, DOCUMENTS_API } from '@/components/legal/types';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [articles, setArticles] = useState<Article[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

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

  const displayArticles = searchResults.length > 0 ? searchResults : articles.slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="search" className="gap-2">
              <Icon name="Search" size={16} />
              Поиск
            </TabsTrigger>
            <TabsTrigger value="practice" className="gap-2">
              <Icon name="Scale" size={16} />
              Практика
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

          <TabsContent value="search">
            <SearchTab
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              loading={loading}
              displayArticles={displayArticles}
              selectArticle={selectArticle}
              selectedArticle={selectedArticle}
              setSelectedArticle={setSelectedArticle}
            />
          </TabsContent>

          <TabsContent value="practice">
            <PracticeTab />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsTab documents={documents} />
          </TabsContent>

          <TabsContent value="generator">
            <GeneratorTab />
          </TabsContent>

          <TabsContent value="deadlines">
            <DeadlinesTab deadlines={deadlines} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;