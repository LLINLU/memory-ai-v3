import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, RefreshCw, Search, Clock } from 'lucide-react';

interface TeamStats {
  team_id: string;
  team_name?: string;
  totalTrees: number;
  totalNodes: number;
  totalPapers: number;
  totalUseCases: number;
  recentSearches: Array<{
    search_theme: string;
    created_at: string;
    tree_id: string;
  }>;
  lastActivity: string;
}

interface SystemOverviewTabProps {
  teamStats: TeamStats[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
}

export const SystemOverviewTab: React.FC<SystemOverviewTabProps> = ({ 
  teamStats, 
  isLoading, 
  error, 
  onRefresh 
}) => {
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}分前`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}時間前`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}日前`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">システム統計</h2>
        <Button 
          onClick={onRefresh} 
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          更新
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            チーム別統計
          </CardTitle>
          <CardDescription>
            各チームのツリー、ノード、論文、ユースケースの統計情報
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">データを読み込み中...</span>
            </div>
          ) : teamStats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              チームデータが見つかりません
            </div>
          ) : (
            <div className="space-y-4">
              {teamStats.map((team, index) => (
                <div key={team.team_id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{team.team_name || `チーム ${index + 1}`}</Badge>
                      <span className="text-xs text-muted-foreground">
                        最終活動: {formatRelativeTime(team.lastActivity)}
                      </span>
                    </div>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">{team.totalTrees}</div>
                      <div className="text-xs text-muted-foreground">ツリー</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{team.totalNodes}</div>
                      <div className="text-xs text-muted-foreground">ノード</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600">{team.totalPapers}</div>
                      <div className="text-xs text-muted-foreground">論文</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-orange-600">{team.totalUseCases}</div>
                      <div className="text-xs text-muted-foreground">ユースケース</div>
                    </div>
                  </div>

                  {team.recentSearches.length > 0 && (
                    <div className="border-t pt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">最近の検索</span>
                      </div>
                      <div className="space-y-1">
                        {team.recentSearches.slice(0, 3).map((search, searchIndex) => (
                          <div key={searchIndex} className="flex items-center justify-between text-sm">
                            <span className="truncate max-w-[200px]" title={search.search_theme}>
                              {search.search_theme}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(search.created_at)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 