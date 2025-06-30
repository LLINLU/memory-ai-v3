import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface SettingsTabProps {
  hasAccess: boolean;
  allowedTeamId: string;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ 
  hasAccess, 
  allowedTeamId 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>システム設定</CardTitle>
            <CardDescription>
              システム全体の設定と構成
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>許可されたチームID</Label>
              <Input value={allowedTeamId} disabled />
            </div>
            <div className="space-y-2">
              <Label>管理者権限チェック</Label>
              <Input value="is-app-admin関数を使用" disabled />
            </div>
            <div className="space-y-2">
              <Label>アクセス権限</Label>
              <Badge variant={hasAccess ? 'default' : 'destructive'}>
                {hasAccess ? '管理者権限あり' : '管理者権限なし'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>セキュリティ情報</CardTitle>
            <CardDescription>
              アクセスログとセキュリティ設定
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">最終ログイン</span>
                <span className="text-sm text-gray-600">現在のセッション</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">認証状態</span>
                <Badge variant="default">認証済み</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">セッション有効期限</span>
                <span className="text-sm text-gray-600">24時間</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 