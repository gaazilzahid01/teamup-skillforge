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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      colleges: {
        Row: {
          city: string
          collegeid: string
          name: string
        }
        Insert: {
          city: string
          collegeid?: string
          name: string
        }
        Update: {
          city?: string
          collegeid?: string
          name?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          createdat: string | null
          date: string | null
          deadline: string | null
          description: string | null
          eventid: string
          location: string | null
          name: string
          participants: string[] | null
          skills: string[] | null
        }
        Insert: {
          createdat?: string | null
          date?: string | null
          deadline?: string | null
          description?: string | null
          eventid?: string
          location?: string | null
          name: string
          participants?: string[] | null
          skills?: string[] | null
        }
        Update: {
          createdat?: string | null
          date?: string | null
          deadline?: string | null
          description?: string | null
          eventid?: string
          location?: string | null
          name?: string
          participants?: string[] | null
          skills?: string[] | null
        }
        Relationships: []
      }
      friends: {
        Row: {
          createdat: string | null
          id: string
          status: string | null
          userid1: string | null
          userid2: string | null
        }
        Insert: {
          createdat?: string | null
          id?: string
          status?: string | null
          userid1?: string | null
          userid2?: string | null
        }
        Update: {
          createdat?: string | null
          id?: string
          status?: string | null
          userid1?: string | null
          userid2?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friends_userid1_fkey"
            columns: ["userid1"]
            isOneToOne: false
            referencedRelation: "studentdetails"
            referencedColumns: ["userid"]
          },
          {
            foreignKeyName: "friends_userid2_fkey"
            columns: ["userid2"]
            isOneToOne: false
            referencedRelation: "studentdetails"
            referencedColumns: ["userid"]
          },
        ]
      }
      studentdetails: {
        Row: {
          collegeid: string | null
          createdat: string | null
          name: string
          skills: string[] | null
          updatedat: string | null
          userid: string
        }
        Insert: {
          collegeid?: string | null
          createdat?: string | null
          name: string
          skills?: string[] | null
          updatedat?: string | null
          userid?: string
        }
        Update: {
          collegeid?: string | null
          createdat?: string | null
          name?: string
          skills?: string[] | null
          updatedat?: string | null
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "studentdetails_collegeid_fkey"
            columns: ["collegeid"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["collegeid"]
          },
        ]
      }
      teams: {
        Row: {
          createdat: string | null
          deadline: string | null
          description: string | null
          difficulty: string | null
          location: string | null
          members: string[] | null
          name: string
          neededroles: string[] | null
          skills: string[] | null
          tags: string[] | null
          teamid: string
          type: string | null
        }
        Insert: {
          createdat?: string | null
          deadline?: string | null
          description?: string | null
          difficulty?: string | null
          location?: string | null
          members?: string[] | null
          name: string
          neededroles?: string[] | null
          skills?: string[] | null
          tags?: string[] | null
          teamid?: string
          type?: string | null
        }
        Update: {
          createdat?: string | null
          deadline?: string | null
          description?: string | null
          difficulty?: string | null
          location?: string | null
          members?: string[] | null
          name?: string
          neededroles?: string[] | null
          skills?: string[] | null
          tags?: string[] | null
          teamid?: string
          type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
