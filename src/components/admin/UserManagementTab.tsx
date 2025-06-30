import { useEffect, useState, useMemo } from 'react';
import { useUserManagement, type User, type Team, type NewUser, type NewTeam } from '@/hooks/useUserManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Users, Shield, Plus, Trash2, Copy, RefreshCw, Key, MoreHorizontal, Search, ChevronUp, ChevronDown } from 'lucide-react';

interface UserManagementTabProps {
  className?: string;
}

export const UserManagementTab: React.FC<UserManagementTabProps> = ({ className }) => {
  const {
    users,
    teams,
    loading,
    loadData,
    createUser,
    createTeam,
    deleteUser,
    deleteTeam,
    resetPassword,
    generatePassword,
    copyPasswordToClipboard,
  } = useUserManagement();

  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [newTeam, setNewTeam] = useState<NewTeam>({ name: '', description: '' });
  const [newUser, setNewUser] = useState<NewUser>({ username: '', email: '', teamId: '', role: 'member', password: '' });
  const [generatedPassword, setGeneratedPassword] = useState('');

  // 検索とフィルタリング用の状態
  const [userSearch, setUserSearch] = useState('');
  const [teamSearch, setTeamSearch] = useState('');
  const [userSortField, setUserSortField] = useState<keyof User>('created_at');
  const [userSortDirection, setUserSortDirection] = useState<'asc' | 'desc'>('desc');
  const [teamSortField, setTeamSortField] = useState<keyof Team>('created_at');
  const [teamSortDirection, setTeamSortDirection] = useState<'asc' | 'desc'>('desc');
  const [userPage, setUserPage] = useState(1);
  const [teamPage, setTeamPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // 折りたたみ状態
  const [userSectionOpen, setUserSectionOpen] = useState(true);
  const [teamSectionOpen, setTeamSectionOpen] = useState(true);

  // ダイアログを開く時に自動でパスワード生成
  const handleCreateUserDialogOpen = (open: boolean) => {
    setCreateUserOpen(open);
    if (open) {
      // ダイアログが開かれた時に自動でパスワードを生成
      const password = generatePassword();
      setNewUser({ username: '', email: '', teamId: '', role: 'member', password });
      setGeneratedPassword(password);
    } else {
      // ダイアログが閉じられた時にフォームをリセット
      setNewUser({ username: '', email: '', teamId: '', role: 'member', password: '' });
      setGeneratedPassword('');
    }
  };

  // データ読み込み
  useEffect(() => {
    loadData();
  }, [loadData]);

  // フィルタリングと並び替えされたユーザーリスト
  const filteredAndSortedUsers = useMemo(() => {
    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.team_name.toLowerCase().includes(userSearch.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const aValue = a[userSortField];
      const bValue = b[userSortField];
      
      if (aValue < bValue) return userSortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return userSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [users, userSearch, userSortField, userSortDirection]);

  // フィルタリングと並び替えされたチームリスト
  const filteredAndSortedTeams = useMemo(() => {
    const filtered = teams.filter(team => 
      team.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      (team.description && team.description.toLowerCase().includes(teamSearch.toLowerCase()))
    );

    return filtered.sort((a, b) => {
      const aValue = a[teamSortField];
      const bValue = b[teamSortField];
      
      if (aValue < bValue) return teamSortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return teamSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [teams, teamSearch, teamSortField, teamSortDirection]);

  // ページネーション用のユーザーリスト
  const paginatedUsers = useMemo(() => {
    const startIndex = (userPage - 1) * itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedUsers, userPage, itemsPerPage]);

  // ページネーション用のチームリスト
  const paginatedTeams = useMemo(() => {
    const startIndex = (teamPage - 1) * itemsPerPage;
    return filteredAndSortedTeams.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedTeams, teamPage, itemsPerPage]);

  // 総ページ数
  const totalUserPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const totalTeamPages = Math.ceil(filteredAndSortedTeams.length / itemsPerPage);

  // 並び替えハンドラー
  const handleUserSort = (field: keyof User) => {
    if (userSortField === field) {
      setUserSortDirection(userSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setUserSortField(field);
      setUserSortDirection('asc');
    }
    setUserPage(1); 
  };

  const handleTeamSort = (field: keyof Team) => {
    if (teamSortField === field) {
      setTeamSortDirection(teamSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setTeamSortField(field);
      setTeamSortDirection('asc');
    }
    setTeamPage(1); 
  };

  // 新しいチームを作成
  const handleCreateTeam = async () => {
    const success = await createTeam(newTeam);
    if (success) {
      setNewTeam({ name: '', description: '' });
      setCreateTeamOpen(false);
    }
  };

  // 新しいユーザープロファイルを作成
  const handleCreateUser = async () => {
    // 確実にroleをmemberに設定
    const userToCreate = { ...newUser, role: 'member' as const };
    const success = await createUser(userToCreate);
    if (success) {
      setNewUser({ username: '', email: '', teamId: '', role: 'member', password: '' });
      setGeneratedPassword('');
      setCreateUserOpen(false);
    }
  };

  // ユーザー削除
  const handleDeleteUser = async (userId: string, username: string) => {
    await deleteUser(userId, username);
  };

  // チーム削除
  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    await deleteTeam(teamId, teamName);
  };

  // パスワードリセット
  const handleResetPassword = async (userId: string, username: string) => {
    await resetPassword(userId, username);
  };

  // メールアドレス自動生成機能
  const generateEmailFromUsername = (username: string) => {
    if (!username.trim()) return '';
    return `${username.trim()}@memoryai.jp`;
  };

  // ユーザー名が変更されたときにメールアドレスも自動更新
  const handleUsernameChange = (username: string) => {
    setNewUser({ 
      ...newUser, 
      username,
      email: username.trim() ? generateEmailFromUsername(username) : ''
    });
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <p>データを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ユーザー管理セクション */}
      <Collapsible open={userSectionOpen} onOpenChange={setUserSectionOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer hover:bg-gray-50 transition-colors">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  ユーザー管理
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${userSectionOpen ? 'rotate-180' : ''}`} />
                </CardTitle>
                <CardDescription>
                  システム内のユーザーアカウントを管理します
                </CardDescription>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <Dialog open={createUserOpen} onOpenChange={handleCreateUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      ユーザー作成
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>新しいユーザーを作成</DialogTitle>
                      <DialogDescription>
                        新しいユーザーアカウントを作成します。パスワードは自動生成されます。
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      {/* 基本情報セクション */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-900">基本情報</h4>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="username" className="text-sm font-medium">
                              ユーザー名 <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="username"
                              value={newUser.username}
                              onChange={(e) => handleUsernameChange(e.target.value)}
                              placeholder="ユーザー名を入力"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email" className="text-sm font-medium">
                              メールアドレス <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={newUser.email}
                              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                              placeholder="example@memoryai.jp"
                              className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              ユーザー名を入力すると @memoryai.jp ドメインで自動生成されます
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 権限設定セクション */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-900">チーム設定</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="team" className="text-sm font-medium">
                              チーム <span className="text-red-500">*</span>
                            </Label>
                            <Select value={newUser.teamId} onValueChange={(value) => setNewUser({ ...newUser, teamId: value })}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="チームを選択" />
                              </SelectTrigger>
                              <SelectContent>
                                {teams.map((team) => (
                                  <SelectItem key={team.id} value={team.id}>
                                    {team.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="role" className="text-sm font-medium">
                              役割
                            </Label>
                            <div className="mt-1">
                              <div className="flex items-center p-3 border rounded-md bg-gray-50">
                                <Badge variant="secondary" className="mr-2">メンバー</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* パスワード設定セクション */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-900">パスワード設定</h4>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="password" className="text-sm font-medium">
                              自動生成パスワード
                            </Label>
                            <div className="flex gap-2 mt-1">
                              <Input
                                id="password"
                                type="text"
                                value={newUser.password}
                                readOnly
                                className="flex-1 bg-gray-50 font-mono text-sm"
                                placeholder="パスワードが自動生成されます"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const password = generatePassword();
                                  setNewUser({ ...newUser, password });
                                  setGeneratedPassword(password);
                                }}
                                className="px-3"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => copyPasswordToClipboard(newUser.password)}
                                disabled={!newUser.password}
                                className="px-3"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {newUser.password && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                              <div className="flex items-start gap-2">
                                <div className="text-amber-600 mt-0.5">⚠️</div>
                                <div className="text-sm text-amber-800">
                                  <p className="font-medium mb-1">セキュリティ警告</p>
                                  <p>このパスワードをコピーして安全な場所に保存してください。ダイアログを閉じると再表示されません。</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleCreateUser}>
                        ユーザー作成
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
                        {/* 検索バーと設定 */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="ユーザー名、メール、チーム名で検索..."
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  setUserPage(1);
                }}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="user-items-per-page" className="text-sm text-gray-600">
                表示件数:
              </Label>
              <Select 
                value={itemsPerPage.toString()} 
                onValueChange={(value) => {
                  setItemsPerPage(parseInt(value));
                  setUserPage(1);
                  setTeamPage(1);
                }}
              >
                <SelectTrigger id="user-items-per-page" className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-500">
              {filteredAndSortedUsers.length}件中 {Math.min((userPage - 1) * itemsPerPage + 1, filteredAndSortedUsers.length)}-{Math.min(userPage * itemsPerPage, filteredAndSortedUsers.length)}件を表示
            </div>
          </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleUserSort('username')}
                    >
                      <div className="flex items-center gap-1">
                        ユーザー名
                        {userSortField === 'username' && (
                          userSortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleUserSort('email')}
                    >
                      <div className="flex items-center gap-1">
                        メール
                        {userSortField === 'email' && (
                          userSortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleUserSort('team_name')}
                    >
                      <div className="flex items-center gap-1">
                        チーム
                        {userSortField === 'team_name' && (
                          userSortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleUserSort('role')}
                    >
                      <div className="flex items-center gap-1">
                        役割
                        {userSortField === 'role' && (
                          userSortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleUserSort('created_at')}
                    >
                      <div className="flex items-center gap-1">
                        作成日時
                        {userSortField === 'created_at' && (
                          userSortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.team_name}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role === 'admin' ? '管理者' : 'メンバー'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString('ja-JP')}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleResetPassword(user.user_id, user.username)}
                              className="cursor-pointer"
                            >
                              <Key className="h-4 w-4 mr-2" />
                              パスワードリセット
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user.user_id, user.username)}
                              className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              ユーザー削除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* ページネーション */}
              {totalUserPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    ページ {userPage} / {totalUserPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUserPage(Math.max(1, userPage - 1))}
                      disabled={userPage === 1}
                    >
                      前へ
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUserPage(Math.min(totalUserPages, userPage + 1))}
                      disabled={userPage === totalUserPages}
                    >
                      次へ
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* チーム管理セクション */}
      <Collapsible open={teamSectionOpen} onOpenChange={setTeamSectionOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer hover:bg-gray-50 transition-colors">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  チーム管理
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${teamSectionOpen ? 'rotate-180' : ''}`} />
                </CardTitle>
                <CardDescription>
                  システム内のチームを管理します
                </CardDescription>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <Dialog open={createTeamOpen} onOpenChange={setCreateTeamOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      チーム作成
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>新しいチームを作成</DialogTitle>
                      <DialogDescription>
                        新しいチームを作成します。
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="team-name" className="text-right">
                          チーム名 *
                        </Label>
                        <Input
                          id="team-name"
                          value={newTeam.name}
                          onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                          className="col-span-3"
                          placeholder="チーム名を入力"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="team-description" className="text-right">
                          説明
                        </Label>
                        <Textarea
                          id="team-description"
                          value={newTeam.description}
                          onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                          className="col-span-3"
                          placeholder="チームの説明を入力（任意）"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleCreateTeam}>
                        チーム作成
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
                        {/* 検索バーと設定 */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="チーム名、説明で検索..."
                value={teamSearch}
                onChange={(e) => {
                  setTeamSearch(e.target.value);
                  setTeamPage(1);
                }}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredAndSortedTeams.length}件中 {Math.min((teamPage - 1) * itemsPerPage + 1, filteredAndSortedTeams.length)}-{Math.min(teamPage * itemsPerPage, filteredAndSortedTeams.length)}件を表示
            </div>
          </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleTeamSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        チーム名
                        {teamSortField === 'name' && (
                          teamSortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>説明</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleTeamSort('member_count')}
                    >
                      <div className="flex items-center gap-1">
                        メンバー数
                        {teamSortField === 'member_count' && (
                          teamSortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleTeamSort('created_at')}
                    >
                      <div className="flex items-center gap-1">
                        作成日時
                        {teamSortField === 'created_at' && (
                          teamSortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTeams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">{team.name}</TableCell>
                      <TableCell>{team.description || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{team.member_count || 0}人</Badge>
                      </TableCell>
                      <TableCell>{new Date(team.created_at).toLocaleDateString('ja-JP')}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleDeleteTeam(team.id, team.name)}
                              className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              チーム削除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* ページネーション */}
              {totalTeamPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    ページ {teamPage} / {totalTeamPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTeamPage(Math.max(1, teamPage - 1))}
                      disabled={teamPage === 1}
                    >
                      前へ
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTeamPage(Math.min(totalTeamPages, teamPage + 1))}
                      disabled={teamPage === totalTeamPages}
                    >
                      次へ
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}; 