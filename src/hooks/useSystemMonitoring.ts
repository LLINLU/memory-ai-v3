import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

interface SystemStats {
  totalTrees: number;
  totalNodes: number;
  totalPapers: number;
  totalUseCases: number;
  activeUsers: number;
  totalTeams: number;
}

interface SystemMonitoringData {
  systemStats: SystemStats | null;
  teamStats: TeamStats[];
  isLoading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
}

export const useSystemMonitoring = (): SystemMonitoringData => {
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSystemStats = async (): Promise<SystemStats> => {
    const [treesResult, nodesResult, papersResult, useCasesResult, usersResult] = await Promise.all([
      supabase.from('technology_trees').select('id', { count: 'exact' }),
      supabase.from('tree_nodes').select('id', { count: 'exact' }),
      supabase.from('node_papers').select('id', { count: 'exact' }),
      supabase.from('node_use_cases').select('id', { count: 'exact' }),
      supabase.auth.admin.listUsers()
    ]);

    // チーム数を取得（重複のないteam_idの数）
    const { data: teamData } = await supabase
      .from('technology_trees')
      .select('team_id')
      .not('team_id', 'is', null);

    const uniqueTeams = new Set(teamData?.map(t => t.team_id) || []);

    return {
      totalTrees: treesResult.count || 0,
      totalNodes: nodesResult.count || 0,
      totalPapers: papersResult.count || 0,
      totalUseCases: useCasesResult.count || 0,
      activeUsers: usersResult.data?.users?.length || 0,
      totalTeams: uniqueTeams.size
    };
  };

  const fetchTeamStats = async (): Promise<TeamStats[]> => {
    // チーム別の統計を取得
    const { data: teamData } = await supabase
      .from('technology_trees')
      .select(`
        id,
        team_id,
        search_theme,
        created_at,
        tree_nodes (
          id,
          node_papers (id),
          node_use_cases (id)
        )
      `)
      .not('team_id', 'is', null)
      .order('created_at', { ascending: false });

    const { data: teamNameData } = await supabase
      .from('v_user_details')
      .select('user_id, email, team_id, team_name')
      .in('team_id', teamData?.map(t => t.team_id) || []);

    // チーム別にグループ化
    const teamMap = new Map<string, TeamStats>();

    if (!teamData) return [];

    teamData.forEach(tree => {
      const teamId = tree.team_id;
      if (!teamId) return;

      if (!teamMap.has(teamId)) {
        teamMap.set(teamId, {
          team_id: teamId,
          team_name: teamNameData?.find(t => t.team_id === teamId)?.team_name || `チーム ${teamId.slice(0, 8)}...`, 
          totalTrees: 0,
          totalNodes: 0,
          totalPapers: 0,
          totalUseCases: 0,
          recentSearches: [],
          lastActivity: ''
        });
      }

      const teamStat = teamMap.get(teamId)!;
      teamStat.totalTrees += 1;
      teamStat.totalNodes += tree.tree_nodes?.length || 0;
      
      // 論文とユースケースをカウント
      tree.tree_nodes?.forEach(node => {
        teamStat.totalPapers += node.node_papers?.length || 0;
        teamStat.totalUseCases += node.node_use_cases?.length || 0;
      });

      // 最近の検索を追加（最大5件）
      if (teamStat.recentSearches.length < 5) {
        teamStat.recentSearches.push({
          search_theme: tree.search_theme || 'テーマなし',
          created_at: tree.created_at,
          tree_id: tree.id
        });
      }

      // 最新の活動日時を更新
      if (!teamStat.lastActivity || new Date(tree.created_at) > new Date(teamStat.lastActivity)) {
        teamStat.lastActivity = tree.created_at;
      }
    });

    // チーム名を取得（ユーザー情報から）
    const teamStatsArray = Array.from(teamMap.values());
    for (const team of teamStatsArray) {
      try {
        const { data: userData } = await supabase.auth.admin.getUserById(team.team_id);
        if (userData.user?.email) {
          team.team_name = userData.user.email.split('@')[0];
        }
      } catch (error) {
        console.warn(`Failed to fetch user data for team ${team.team_id}:`, error);
      }
    }

    // 最新の活動順でソート
    return teamStatsArray.sort((a, b) => 
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    );
  };

  const refreshStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [systemData, teamData] = await Promise.all([
        fetchSystemStats(),
        fetchTeamStats()
      ]);

      setSystemStats(systemData);
      setTeamStats(teamData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
      console.error('Error fetching system monitoring data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshStats();
    
  }, []);

  return {
    systemStats,
    teamStats,
    isLoading,
    error,
    refreshStats
  };
}; 