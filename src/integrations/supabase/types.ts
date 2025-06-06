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
        Relationships: [
          {
            foreignKeyName: "teams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_user_details"
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
          updated_at?: string
        }
        Relationships: []
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
            foreignKeyName: "tree_nodes_tree_id_fkey"
            columns: ["tree_id"]
            isOneToOne: false
            referencedRelation: "technology_trees"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          id: string
          team_id: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id: string
          team_id?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          team_id?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "v_user_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_user_details: {
        Row: {
          email: string | null
          id: string | null
          profile_created_at: string | null
          profile_updated_at: string | null
          registered_at: string | null
          team_description: string | null
          team_name: string | null
          username: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
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
