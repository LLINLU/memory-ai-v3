import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

export interface User {
  user_id: string;
  username: string;
  email: string;
  team_id: string;
  team_name: string;
  role: string;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  created_at: string;
  created_by: string;
  member_count?: number;
}

export interface NewUser {
  username: string;
  email: string;
  teamId: string;
  role: string;
  password: string;
}

export interface NewTeam {
  name: string;
  description: string;
}

export const useUserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminCheckLoading, setAdminCheckLoading] = useState(true);

  // 管理者権限をチェック
  const checkAdminStatus = useCallback(async () => {
    if (!user?.id) {
      setIsAdmin(false);
      setAdminCheckLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('is-app-admin', {
        body: { userId: user.id }
      });

      if (error) {
        console.error('Admin check error:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data?.isAdmin || false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setAdminCheckLoading(false);
    }
  }, [user?.id]);

  // ユーザー一覧を取得
  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('v_user_details')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('ユーザー一覧の取得に失敗しました');
    }
  }, []);

  // チーム一覧を取得
  const fetchTeams = useCallback(async () => {
    try {
      // チーム基本情報を取得
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (teamsError) throw teamsError;

      // 各チームのメンバー数を取得
      const teamsWithMemberCount = await Promise.all(
        (teamsData || []).map(async (team) => {
          const { count } = await supabase
            .from('teams_members')
            .select('*', { count: 'exact', head: true })
            .eq('team_id', team.id);

          return {
            ...team,
            member_count: count || 0
          };
        })
      );

      setTeams(teamsWithMemberCount);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('チーム一覧の取得に失敗しました');
    }
  }, []);

  // データ読み込み
  const loadData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchUsers(), fetchTeams(), checkAdminStatus()]);
    setLoading(false);
  }, [fetchUsers, fetchTeams, checkAdminStatus]);

  // ランダムパスワード生成
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // パスワードをクリップボードにコピー
  const copyPasswordToClipboard = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password);
      toast.success('パスワードをクリップボードにコピーしました');
    } catch (error) {
      console.error('Failed to copy password:', error);
      toast.error('パスワードのコピーに失敗しました');
    }
  };

  // パスワードリセット
  const resetPassword = async (userId: string, username: string) => {
    if (!confirm(`ユーザー「${username}」のパスワードをリセットしますか？新しいパスワードが生成されます。`)) {
      return false;
    }

    try {
      // 新しいパスワードを生成
      const newPassword = generatePassword();

      // Supabase Admin APIを使用してパスワードを更新
      const { data, error } = await supabase.functions.invoke('admin-reset-password', {
        body: { userId, newPassword }
      });

      if (error) {
        throw error;
      }

      // 成功時のメッセージ（新しいパスワードを表示）
      toast.success(
        `パスワードをリセットしました。\n新しいパスワード: ${newPassword}\n（クリップボードにコピーしてください）`,
        {
          duration: 15000,
          action: {
            label: "パスワードをコピー",
            onClick: () => copyPasswordToClipboard(newPassword)
          }
        }
      );

      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('パスワードのリセットに失敗しました: ' + (error as Error).message);
      return false;
    }
  };

  // 新しいユーザーを作成
  const createUser = async (newUser: NewUser) => {
    if (!newUser.username.trim() || !newUser.email.trim() || !newUser.teamId) {
      toast.error('すべての必須項目を入力してください');
      return false;
    }

    try {
      const password = newUser.password.trim() || generatePassword();
      
      // Supabase Edge Functionを使用してユーザーを作成（メール確認不要）
      const { data, error } = await supabase.functions.invoke('admin-create-user', {
        body: {
          email: newUser.email.trim(),
          password: password,
          username: newUser.username.trim(),
          teamId: newUser.teamId,
          role: newUser.role,
        }
      });

      if (error) {
        if (error.message && error.message.includes('already registered')) {
          toast.error('このメールアドレスは既に登録されています');
          return false;
        }
        throw error;
      }

      // 成功メッセージでパスワードも表示
      toast.success(
        `ユーザーが作成されました。\nパスワード: ${password}\n（クリップボードにコピーしてください）`,
        {
          duration: 10000, // 10秒間表示
          action: {
            label: "パスワードをコピー",
            onClick: () => copyPasswordToClipboard(password)
          }
        }
      );
      
      // データを再読み込み
      await Promise.all([fetchUsers(), fetchTeams()]);
      return true;
      
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('ユーザーの作成に失敗しました: ' + (error as Error).message);
      return false;
    }
  };

  // 新しいチームを作成
  const createTeam = async (newTeam: NewTeam) => {
    if (!newTeam.name.trim()) {
      toast.error('チーム名を入力してください');
      return false;
    }

    if (!user?.id) {
      toast.error('ユーザー情報が取得できませんでした');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([
          {
            name: newTeam.name.trim(),
            description: newTeam.description.trim() || null,
            created_by: user.id,
          }
        ])
        .select();

      if (error) throw error;

      toast.success('チームが作成されました');
      fetchTeams();
      return true;
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('チームの作成に失敗しました');
      return false;
    }
  };

  // ユーザー削除
  const deleteUser = async (userId: string, username: string) => {
    if (!confirm(`ユーザー「${username}」を削除しますか？この操作は取り消せません。`)) {
      return false;
    }

    try {
      // 管理者権限でユーザーを完全削除（Supabase Auth含む）
      const { data, error } = await supabase.functions.invoke('admin-delete-user', {
        body: { userId }
      });

      if (error) {
        throw error;
      }

      toast.success('ユーザーが完全に削除されました');
      await Promise.all([fetchUsers(), fetchTeams()]);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('ユーザーの削除に失敗しました: ' + (error as Error).message);
      return false;
    }
  };

  // チーム削除
  const deleteTeam = async (teamId: string, teamName: string) => {
    if (!confirm(`チーム「${teamName}」を削除しますか？関連するデータも削除されます。`)) {
      return false;
    }

    try {
      // Step 1: チームメンバーシップを削除
      const { error: memberError } = await supabase
        .from('teams_members')
        .delete()
        .eq('team_id', teamId);

      if (memberError) {
        console.error('Error deleting team memberships:', memberError);
      }

      // Step 2: チームを削除
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (error) throw error;

      toast.success('チームが削除されました');
      await Promise.all([fetchTeams(), fetchUsers()]);
      return true;
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error('チームの削除に失敗しました');
      return false;
    }
  };

      return {
    // State
    users,
    teams,
    loading,
    isAdmin,
    adminCheckLoading,
    
    // Actions
    loadData,
    fetchUsers,
    fetchTeams,
    createUser,
    createTeam,
    deleteUser,
    deleteTeam,
    resetPassword,
    generatePassword,
    copyPasswordToClipboard,
    checkAdminStatus,
  };
}; 