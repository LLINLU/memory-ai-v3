export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      node_papers: {
        Row: {
          abstract: string
          authors: string
          citations: number
          created_at: string
          date: string | null
          doi: string | null
          id: string
          journal: string
          node_id: string
          region: string
          score: number | null
          tags: Json
          team_id: string | null
          title: string
          tree_id: string
          updated_at: string
          url: string | null
        }
        Insert: {
          abstract: string
          authors: string
          citations?: number
          created_at?: string
          date?: string | null
          doi?: string | null
          id: string
          journal: string
          node_id: string
          region: string
          score?: number | null
          tags?: Json
          team_id?: string | null
          title: string
          tree_id: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          abstract?: string
          authors?: string
          citations?: number
          created_at?: string
          date?: string | null
          doi?: string | null
          id?: string
          journal?: string
          node_id?: string
          region?: string
          score?: number | null
          tags?: Json
          team_id?: string | null
          title?: string
          tree_id?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "node_papers_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "tree_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "node_papers_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "node_papers_tree_id_fkey"
            columns: ["tree_id"]
            isOneToOne: false
            referencedRelation: "technology_trees"
            referencedColumns: ["id"]
          },
        ]
      }
      node_use_cases: {
        Row: {
          created_at: string
          description: string
          id: string
          node_id: string
          releases: number
          team_id: string | null
          title: string
          tree_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id: string
          node_id: string
          releases?: number
          team_id?: string | null
          title: string
          tree_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          node_id?: string
          releases?: number
          team_id?: string | null
          title?: string
          tree_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "node_use_cases_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "tree_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "node_use_cases_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "node_use_cases_tree_id_fkey"
            columns: ["tree_id"]
            isOneToOne: false
            referencedRelation: "technology_trees"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      teams_members: {
        Row: {
          joined_at: string
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          joined_at?: string
          role?: string
          team_id: string
          user_id: string
        }
        Update: {
          joined_at?: string
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      technology_trees: {
        Row: {
          created_at: string
          description: string | null
          id: string
          layer_config: Json | null
          mode: string | null
          name: string
          reasoning: string | null
          scenario_inputs: Json | null
          search_theme: string
          team_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          layer_config?: Json | null
          mode?: string | null
          name: string
          reasoning?: string | null
          scenario_inputs?: Json | null
          search_theme: string
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          layer_config?: Json | null
          mode?: string | null
          name?: string
          reasoning?: string | null
          scenario_inputs?: Json | null
          search_theme?: string
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "technology_trees_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      tree_nodes: {
        Row: {
          axis: Database["public"]["Enums"]["axis_type"]
          children_count: number | null
          created_at: string
          description: string | null
          id: string
          level: number
          name: string
          node_order: number | null
          parent_id: string | null
          path: string | null
          team_id: string | null
          tree_id: string | null
          updated_at: string
        }
        Insert: {
          axis: Database["public"]["Enums"]["axis_type"]
          children_count?: number | null
          created_at?: string
          description?: string | null
          id: string
          level: number
          name: string
          node_order?: number | null
          parent_id?: string | null
          path?: string | null
          team_id?: string | null
          tree_id?: string | null
          updated_at?: string
        }
        Update: {
          axis?: Database["public"]["Enums"]["axis_type"]
          children_count?: number | null
          created_at?: string
          description?: string | null
          id?: string
          level?: number
          name?: string
          node_order?: number | null
          parent_id?: string | null
          path?: string | null
          team_id?: string | null
          tree_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tree_nodes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "tree_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tree_nodes_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tree_nodes_tree_id_fkey"
            columns: ["tree_id"]
            isOneToOne: false
            referencedRelation: "technology_trees"
            referencedColumns: ["id"]
          },
        ]
      }
      use_case_press_releases: {
        Row: {
          created_at: string
          date: string | null
          id: string
          title: string
          url: string
          use_case_id: string
        }
        Insert: {
          created_at?: string
          date?: string | null
          id?: string
          title: string
          url: string
          use_case_id: string
        }
        Update: {
          created_at?: string
          date?: string | null
          id?: string
          title?: string
          url?: string
          use_case_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "use_case_press_releases_use_case_id_fkey"
            columns: ["use_case_id"]
            isOneToOne: false
            referencedRelation: "node_use_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_user_details: {
        Row: {
          created_at: string | null
          email: string | null
          role: string | null
          team_id: string | null
          team_name: string | null
          updated_at: string | null
          user_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_user_team_trees_and_nodes: {
        Args: { user_id: string }
        Returns: {
          team_id: string
          team_name: string
          tree_id: string
          tree_name: string
          tree_description: string
          node_id: string
          node_name: string
          node_description: string
          node_level: number
          node_order: number
        }[]
      }
      get_user_technology_tree_data: {
        Args: { user_id: string }
        Returns: {
          tree_id: string
          tree_name: string
          tree_description: string
          node_id: string
          node_name: string
          node_description: string
          node_level: number
          node_order: number
        }[]
      }
    }
    Enums: {
      axis_type:
        | "Root"
        | "Scenario"
        | "Purpose"
        | "Function"
        | "Measure"
        | "Measure2"
        | "Measure3"
        | "Measure4"
        | "Measure5"
        | "Measure6"
        | "Measure7"
        | "Technology"
        | "How1"
        | "How2"
        | "How3"
        | "How4"
        | "How5"
        | "How6"
        | "How7"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      axis_type: [
        "Root",
        "Scenario",
        "Purpose",
        "Function",
        "Measure",
        "Measure2",
        "Measure3",
        "Measure4",
        "Measure5",
        "Measure6",
        "Measure7",
        "Technology",
        "How1",
        "How2",
        "How3",
        "How4",
        "How5",
        "How6",
        "How7",
      ],
    },
  },
} as const
