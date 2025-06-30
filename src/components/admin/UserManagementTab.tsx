import { useEffect, useState } from 'react';
import { useUserManagement, type NewUser, type NewTeam } from '@/hooks/useUserManagement';
import { UserTableSection } from './UserTableSection';
import { TeamManagementSection } from './TeamManagementSection';
import { downloadUserCSV, downloadMultipleUsersCSV, type UserCSVData } from '@/utils/csvDownload';

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

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isCreatingMultipleUsers, setIsCreatingMultipleUsers] = useState(false);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateUser = async (user: NewUser): Promise<boolean> => {
    setIsCreatingUser(true);
    try {
      const userToCreate = { ...user, role: 'member' as const };
      const success = await createUser(userToCreate);
      if (success) {
        const selectedTeam = teams.find(team => team.id === user.teamId);
        const teamName = selectedTeam ? selectedTeam.name : 'Unknown';
        
        downloadUserCSV({
          username: user.username,
          email: user.email,
          password: user.password,
          teamName: teamName,
          createdAt: new Date().toLocaleString('ja-JP')
        });
      }
      return success;
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleCreateMultipleUsers = async (multipleUsersData: {
    teamId: string;
    users: Array<{ username: string; email: string; password: string; }>;
  }) => {
    if (multipleUsersData.users.length === 0) return;

    setIsCreatingMultipleUsers(true);
    try {
      const selectedTeam = teams.find(team => team.id === multipleUsersData.teamId);
      const teamName = selectedTeam ? selectedTeam.name : 'Unknown';
      const createdAt = new Date().toLocaleString('ja-JP');
      
      const csvData: UserCSVData[] = [];
      let successCount = 0;
      
      for (const user of multipleUsersData.users) {
        const userToCreate = {
          username: user.username,
          email: user.email,
          teamId: multipleUsersData.teamId,
          role: 'member' as const,
          password: user.password
        };
        
        const success = await createUser(userToCreate);
        if (success) {
          successCount++;
          csvData.push({
            username: user.username,
            email: user.email,
            password: user.password,
            teamName,
            createdAt
          });
        }
      }

      if (csvData.length > 0) {
        downloadMultipleUsersCSV(csvData);
      }

      if (successCount > 0) {
        console.log(`${successCount}人のユーザーが正常に作成されました`);
      }
    } finally {
      setIsCreatingMultipleUsers(false);
    }
  };

  const handleCreateTeam = async (team: NewTeam): Promise<boolean> => {
    return await createTeam(team);
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    await deleteUser(userId, username);
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    await deleteTeam(teamId, teamName);
  };

  const handleResetPassword = async (userId: string, username: string) => {
    await resetPassword(userId, username);
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
      <UserTableSection
        users={users}
        teams={teams}
        onDeleteUser={handleDeleteUser}
        onResetPassword={handleResetPassword}
        onCreateUser={handleCreateUser}
        onCreateMultipleUsers={handleCreateMultipleUsers}
        generatePassword={generatePassword}
        copyPasswordToClipboard={copyPasswordToClipboard}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        isCreatingUser={isCreatingUser}
        isCreatingMultipleUsers={isCreatingMultipleUsers}
      />
      
      <TeamManagementSection
        teams={teams}
        onCreateTeam={handleCreateTeam}
        onDeleteTeam={handleDeleteTeam}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};