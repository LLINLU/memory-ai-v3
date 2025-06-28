import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, TestTube, Loader2, Users } from 'lucide-react';
import { SystemOverviewTab } from '@/components/admin/SystemOverviewTab';
import { LoadTestTab } from '@/components/admin/LoadTestTab';
import { UserManagementTab } from '@/components/admin/UserManagementTab';

interface LoadTestResult {
  id: string;
  testName: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed';
  requests: number;
  successCount: number;
  errorCount: number;
  averageResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
}

interface SystemStats {
  totalTrees: number;
  totalNodes: number;
  totalPapers: number;
  totalUseCases: number;
  activeUsers: number;
}

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [hasAccess, setHasAccess] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(true);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loadTests, setLoadTests] = useState<LoadTestResult[]>([]);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  
  // URLクエリパラメータからタブを取得、デフォルトは'overview'
  const currentTab = searchParams.get('tab') || 'overview';
  
  // タブ変更ハンドラー
  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };
  
  // テスト設定
  const [testConfig, setTestConfig] = useState({
    testName: '',
    endpoint: 'generate-tree-fast-v3',
    concurrentUsers: 10,
    requestsPerUser: 5,
    payload: JSON.stringify({
      searchTheme: "負荷テスト用クエリ",
      team_id: user?.id
    }, null, 2)
  });

  // 管理者権限チェック
  const checkAdminStatus = async () => {
    if (!user?.id) {
      setHasAccess(false);
      setAdminCheckLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('is-app-admin', {
        body: { userId: user.id }
      });

      if (error) {
        console.error('Admin check error:', error);
        setHasAccess(false);
      } else {
        setHasAccess(data?.isAdmin || false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setHasAccess(false);
    } finally {
      setAdminCheckLoading(false);
    }
  };

  // アクセス権限チェック
  useEffect(() => {
    checkAdminStatus();
  }, [user?.id]);

  // アクセス権限がない場合のリダイレクト
  useEffect(() => {
    if (!adminCheckLoading && !hasAccess) {
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [hasAccess, adminCheckLoading, navigate]);

  // システム統計取得
  useEffect(() => {
    if (hasAccess) {
      fetchSystemStats();
    }
  }, [hasAccess]);

  const fetchSystemStats = async () => {
    try {
      const [treesResult, nodesResult, papersResult, useCasesResult] = await Promise.all([
        supabase.from('technology_trees').select('id', { count: 'exact' }),
        supabase.from('tree_nodes').select('id', { count: 'exact' }),
        supabase.from('node_papers').select('id', { count: 'exact' }),
        supabase.from('node_use_cases').select('id', { count: 'exact' })
      ]);

      setSystemStats({
        totalTrees: treesResult.count || 0,
        totalNodes: nodesResult.count || 0,
        totalPapers: papersResult.count || 0,
        totalUseCases: useCasesResult.count || 0,
        activeUsers: 0 // この値は実際のアクティブユーザー追跡システムから取得
      });
    } catch (error) {
      console.error('システム統計の取得に失敗しました:', error);
    }
  };

  const startLoadTest = async () => {
    if (!testConfig.testName.trim()) {
      alert('テスト名を入力してください');
      return;
    }

    setIsRunningTest(true);
    setTestProgress(0);

    const testResult: LoadTestResult = {
      id: crypto.randomUUID(),
      testName: testConfig.testName,
      startTime: new Date(),
      status: 'running',
      requests: testConfig.concurrentUsers * testConfig.requestsPerUser,
      successCount: 0,
      errorCount: 0,
      averageResponseTime: 0,
      maxResponseTime: 0,
      minResponseTime: Infinity
    };

    setLoadTests(prev => [testResult, ...prev]);

    try {
      // 実際の負荷テスト実行
      const totalRequests = testConfig.concurrentUsers * testConfig.requestsPerUser;
      const batchSize = Math.max(1, Math.floor(testConfig.concurrentUsers / 2));
      
      for (let i = 0; i < totalRequests; i += batchSize) {
        const batch = Math.min(batchSize, totalRequests - i);
        const promises = Array.from({ length: batch }, () => 
          simulateRequest(testConfig.endpoint, JSON.parse(testConfig.payload))
        );
        
        const results = await Promise.allSettled(promises);
        
        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            testResult.successCount++;
            const responseTime = result.value.responseTime;
            testResult.averageResponseTime = (testResult.averageResponseTime * (testResult.successCount - 1) + responseTime) / testResult.successCount;
            testResult.maxResponseTime = Math.max(testResult.maxResponseTime, responseTime);
            testResult.minResponseTime = Math.min(testResult.minResponseTime, responseTime);
          } else {
            testResult.errorCount++;
          }
        });
        
        setTestProgress(Math.round(((i + batch) / totalRequests) * 100));
        
        // 次のバッチまで少し待機
        if (i + batch < totalRequests) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      testResult.status = 'completed';
      testResult.endTime = new Date();
      
    } catch (error) {
      testResult.status = 'failed';
      testResult.endTime = new Date();
    } finally {
      setIsRunningTest(false);
      setTestProgress(0);
      setLoadTests(prev => prev.map(t => t.id === testResult.id ? testResult : t));
    }
  };

  const simulateRequest = async (endpoint: string, payload: Record<string, unknown>): Promise<{ responseTime: number }> => {
    const startTime = Date.now();
    
    try {
      // 実際のSupabase Functionを呼び出し
      const response = await supabase.functions.invoke(endpoint, {
        body: payload
      });
      
      const responseTime = Date.now() - startTime;
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return { responseTime };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      throw { responseTime };
    }
  };

  const clearTestResults = () => {
    setLoadTests([]);
  };

  const formatDuration = (start: Date, end?: Date) => {
    const duration = end ? end.getTime() - start.getTime() : Date.now() - start.getTime();
    return `${Math.round(duration / 1000)}秒`;
  };

  if (adminCheckLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>
            このページにアクセスする権限がありません。3秒後にホームページにリダイレクトします。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">管理者ダッシュボード</h1>
            <p className="text-gray-600">システム管理・監視・テストツール</p>
          </div>
          <Badge variant="secondary">
            管理者
          </Badge>
        </div>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              システム監視
            </TabsTrigger>
            <TabsTrigger value="load-test" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              負荷テスト
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              ユーザー管理
            </TabsTrigger>
          </TabsList>

          {/* システム監視タブ */}
          <TabsContent value="overview" className="space-y-6">
            <SystemOverviewTab systemStats={systemStats} />
          </TabsContent>

          {/* 負荷テストタブ */}
          <TabsContent value="load-test" className="space-y-6">
            <LoadTestTab
              testConfig={testConfig}
              setTestConfig={setTestConfig}
              loadTests={loadTests}
              isRunningTest={isRunningTest}
              testProgress={testProgress}
              startLoadTest={startLoadTest}
              clearTestResults={clearTestResults}
              formatDuration={formatDuration}
            />
          </TabsContent>

          {/* ユーザー管理タブ */}
          <TabsContent value="users" className="space-y-6">
            <UserManagementTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage; 