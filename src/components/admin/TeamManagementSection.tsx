import { useState, useMemo } from 'react';
import { type Team } from '@/hooks/useUserManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Shield, Plus, Trash2, MoreHorizontal, Search, ChevronUp, ChevronDown } from 'lucide-react';

interface TeamManagementSectionProps {
  teams: Team[];
  onCreateTeam: (team: { name: string; description: string }) => Promise<boolean>;
  onDeleteTeam: (teamId: string, teamName: string) => Promise<void>;
  itemsPerPage: number;
  className?: string;
}

export const TeamManagementSection: React.FC<TeamManagementSectionProps> = ({
  teams,
  onCreateTeam,
  onDeleteTeam,
  itemsPerPage,
  className
}) => {
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [teamSearch, setTeamSearch] = useState('');
  const [teamSortField, setTeamSortField] = useState<keyof Team>('created_at');
  const [teamSortDirection, setTeamSortDirection] = useState<'asc' | 'desc'>('desc');
  const [teamPage, setTeamPage] = useState(1);
  const [teamSectionOpen, setTeamSectionOpen] = useState(true);

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

  const paginatedTeams = useMemo(() => {
    const startIndex = (teamPage - 1) * itemsPerPage;
    return filteredAndSortedTeams.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedTeams, teamPage, itemsPerPage]);

  const totalTeamPages = Math.ceil(filteredAndSortedTeams.length / itemsPerPage);

  const handleTeamSort = (field: keyof Team) => {
    if (teamSortField === field) {
      setTeamSortDirection(teamSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setTeamSortField(field);
      setTeamSortDirection('asc');
    }
    setTeamPage(1);
  };

  const handleCreateTeam = async () => {
    const success = await onCreateTeam(newTeam);
    if (success) {
      setNewTeam({ name: '', description: '' });
      setCreateTeamOpen(false);
    }
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    await onDeleteTeam(teamId, teamName);
  };

  return (
    <Collapsible open={teamSectionOpen} onOpenChange={setTeamSectionOpen}>
      <Card className={className}>
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
  );
};