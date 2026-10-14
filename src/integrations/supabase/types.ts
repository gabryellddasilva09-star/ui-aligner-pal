export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      app_keys: {
        Row: {
          name: string
          value: Json
        }
        Insert: {
          name: string
          value: Json
        }
        Update: {
          name?: string
          value?: Json
        }
        Relationships: []
      }
      appointments: {
        Row: {
          created_at: string
          id: string
          kind: string
          place: string | null
          questions: string | null
          remind: boolean
          starts_at: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string
          place?: string | null
          questions?: string | null
          remind?: boolean
          starts_at: string
          title: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          place?: string | null
          questions?: string | null
          remind?: boolean
          starts_at?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      community_messages: {
        Row: {
          author_name: string
          body: string
          created_at: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          author_name?: string
          body: string
          created_at?: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_records: {
        Row: {
          awakenings: number | null
          bed_time: string | null
          body_pain: Json
          brain_fog: string | null
          brain_fog_note: string | null
          created_at: string
          cycle: string | null
          disposition: string
          fatigue: string
          id: string
          mood: string
          pain: number
          record_date: string
          sleep: string
          triggers: string[]
          updated_at: string
          user_id: string
          wake_time: string | null
        }
        Insert: {
          awakenings?: number | null
          bed_time?: string | null
          body_pain?: Json
          brain_fog?: string | null
          brain_fog_note?: string | null
          created_at?: string
          cycle?: string | null
          disposition: string
          fatigue: string
          id?: string
          mood: string
          pain: number
          record_date?: string
          sleep: string
          triggers?: string[]
          updated_at?: string
          user_id?: string
          wake_time?: string | null
        }
        Update: {
          awakenings?: number | null
          bed_time?: string | null
          body_pain?: Json
          brain_fog?: string | null
          brain_fog_note?: string | null
          created_at?: string
          cycle?: string | null
          disposition?: string
          fatigue?: string
          id?: string
          mood?: string
          pain?: number
          record_date?: string
          sleep?: string
          triggers?: string[]
          updated_at?: string
          user_id?: string
          wake_time?: string | null
        }
        Relationships: []
      }
      medication_logs: {
        Row: {
          created_at: string
          id: string
          medication_id: string
          side_effect: string | null
          slot: string
          taken_on: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          medication_id: string
          side_effect?: string | null
          slot: string
          taken_on?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          medication_id?: string
          side_effect?: string | null
          slot?: string
          taken_on?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_logs_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          active: boolean
          created_at: string
          dose: string | null
          id: string
          name: string
          remind: boolean
          times: string[]
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          dose?: string | null
          id?: string
          name: string
          remind?: boolean
          times?: string[]
          user_id?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          dose?: string | null
          id?: string
          name?: string
          remind?: boolean
          times?: string[]
          user_id?: string
        }
        Relationships: []
      }
      movement_exercise_completions: {
        Row: {
          activity_date: string
          completed_at: string
          exercise_id: string
          user_id: string
        }
        Insert: {
          activity_date: string
          completed_at?: string
          exercise_id: string
          user_id: string
        }
        Update: {
          activity_date?: string
          completed_at?: string
          exercise_id?: string
          user_id?: string
        }
        Relationships: []
      }
      movement_exercise_schedule: {
        Row: {
          exercise_id: string
          updated_at: string
          user_id: string
          weekdays: number[]
        }
        Insert: {
          exercise_id: string
          updated_at?: string
          user_id?: string
          weekdays?: number[]
        }
        Update: {
          exercise_id?: string
          updated_at?: string
          user_id?: string
          weekdays?: number[]
        }
        Relationships: []
      }
      program_enrollments: {
        Row: {
          active: boolean
          created_at: string
          remind: boolean
          remind_time: string
          started_on: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          remind?: boolean
          remind_time?: string
          started_on?: string
          user_id?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          remind?: boolean
          remind_time?: string
          started_on?: string
          user_id?: string
        }
        Relationships: []
      }
      program_progress: {
        Row: {
          completed_at: string
          day: number
          feeling: string | null
          id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          day: number
          feeling?: string | null
          id?: string
          user_id?: string
        }
        Update: {
          completed_at?: string
          day?: number
          feeling?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          pending_body: string | null
          pending_title: string | null
          time_zone: string
          user_id: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          pending_body?: string | null
          pending_title?: string | null
          time_zone?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          pending_body?: string | null
          pending_title?: string | null
          time_zone?: string
          user_id?: string
        }
        Relationships: []
      }
      recipe_schedule: {
        Row: {
          recipe_id: string
          updated_at: string
          user_id: string
          weekdays: number[]
        }
        Insert: {
          recipe_id: string
          updated_at?: string
          user_id?: string
          weekdays?: number[]
        }
        Update: {
          recipe_id?: string
          updated_at?: string
          user_id?: string
          weekdays?: number[]
        }
        Relationships: []
      }
      relaxation_sessions: {
        Row: {
          created_at: string
          id: string
          name: string
          seconds: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          seconds: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          seconds?: number
          user_id?: string
        }
        Relationships: []
      }
      reminders_sent: {
        Row: {
          created_at: string
          key: string
        }
        Insert: {
          created_at?: string
          key: string
        }
        Update: {
          created_at?: string
          key?: string
        }
        Relationships: []
      }
      side_effects: {
        Row: {
          created_at: string
          id: string
          medication_id: string | null
          note: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          medication_id?: string | null
          note: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          medication_id?: string | null
          note?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "side_effects_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_moderator: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
