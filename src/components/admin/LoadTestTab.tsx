import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Play, Trash2 } from 'lucide-react';

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

interface TestConfig {
  testName: string;
  endpoint: string;
  concurrentUsers: number;
  requestsPerUser: number;
  payload: string;
}

interface LoadTestTabProps {
  testConfig: TestConfig;
  setTestConfig: React.Dispatch<React.SetStateAction<TestConfig>>;
  loadTests: LoadTestResult[];
  isRunningTest: boolean;
  testProgress: number;
  startLoadTest: () => void;
  clearTestResults: () => void;
  formatDuration: (start: Date, end?: Date) => string;
}

export const LoadTestTab: React.FC<LoadTestTabProps> = ({
  testConfig,
  setTestConfig,
  loadTests,
  isRunningTest,
  testProgress,
  startLoadTest,
  clearTestResults,
  formatDuration
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>負荷テスト設定</CardTitle>
            <CardDescription>
              APIエンドポイントの負荷テストを実行します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testName">テスト名</Label>
              <Input
                id="testName"
                value={testConfig.testName}
                onChange={(e) => setTestConfig(prev => ({ ...prev, testName: e.target.value }))}
                placeholder="負荷テスト_2024_01"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="concurrentUsers">同時ユーザー数</Label>
                <Input
                  id="concurrentUsers"
                  type="number"
                  value={testConfig.concurrentUsers}
                  onChange={(e) => setTestConfig(prev => ({ ...prev, concurrentUsers: parseInt(e.target.value) || 10 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requestsPerUser">ユーザーあたりリクエスト数</Label>
                <Input
                  id="requestsPerUser"
                  type="number"
                  value={testConfig.requestsPerUser}
                  onChange={(e) => setTestConfig(prev => ({ ...prev, requestsPerUser: parseInt(e.target.value) || 5 }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endpoint">エンドポイント</Label>
              <Input
                id="endpoint"
                value={testConfig.endpoint}
                onChange={(e) => setTestConfig(prev => ({ ...prev, endpoint: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payload">リクエストペイロード</Label>
              <Textarea
                id="payload"
                value={testConfig.payload}
                onChange={(e) => setTestConfig(prev => ({ ...prev, payload: e.target.value }))}
                rows={6}
                className="font-mono text-sm"
              />
            </div>

            {isRunningTest && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>テスト進行中...</span>
                  <span>{testProgress}%</span>
                </div>
                <Progress value={testProgress} />
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={startLoadTest} 
                disabled={isRunningTest}
                className="flex-1"
              >
                {isRunningTest ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    実行中...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    テスト開始
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={clearTestResults}
                disabled={isRunningTest}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>テスト結果</CardTitle>
            <CardDescription>
              実行した負荷テストの結果一覧
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadTests.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                まだテスト結果がありません
              </div>
            ) : (
              <div className="space-y-4">
                {loadTests.map((test) => (
                  <div key={test.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{test.testName}</h4>
                      <Badge 
                        variant={
                          test.status === 'completed' ? 'default' : 
                          test.status === 'failed' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {test.status === 'running' ? '実行中' : 
                         test.status === 'completed' ? '完了' : '失敗'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">総リクエスト:</span> {test.requests}
                      </div>
                      <div>
                        <span className="text-gray-600">成功:</span> {test.successCount}
                      </div>
                      <div>
                        <span className="text-gray-600">失敗:</span> {test.errorCount}
                      </div>
                      <div>
                        <span className="text-gray-600">実行時間:</span> {formatDuration(test.startTime, test.endTime)}
                      </div>
                    </div>
                    
                    {test.status === 'completed' && (
                      <div className="grid grid-cols-3 gap-4 text-sm pt-2 border-t">
                        <div>
                          <span className="text-gray-600">平均:</span> {Math.round(test.averageResponseTime)}ms
                        </div>
                        <div>
                          <span className="text-gray-600">最大:</span> {test.maxResponseTime}ms
                        </div>
                        <div>
                          <span className="text-gray-600">最小:</span> {test.minResponseTime === Infinity ? 0 : test.minResponseTime}ms
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
    </div>
  );
}; 