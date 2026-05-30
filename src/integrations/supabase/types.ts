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
      fare_chart: {
        Row: {
          category: Database["public"]["Enums"]["fare_category"]
          fare: number
          id: string
          up_to_km: number
        }
        Insert: {
          category: Database["public"]["Enums"]["fare_category"]
          fare: number
          id?: string
          up_to_km: number
        }
        Update: {
          category?: Database["public"]["Enums"]["fare_category"]
          fare?: number
          id?: string
          up_to_km?: number
        }
        Relationships: []
      }
      journey_history: {
        Row: {
          destination_id: string | null
          fare: number | null
          id: string
          journey_date: string | null
          source_id: string | null
          user_id: string | null
        }
        Insert: {
          destination_id?: string | null
          fare?: number | null
          id?: string
          journey_date?: string | null
          source_id?: string | null
          user_id?: string | null
        }
        Update: {
          destination_id?: string | null
          fare?: number | null
          id?: string
          journey_date?: string | null
          source_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journey_history_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_history_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      line_stations: {
        Row: {
          id: string
          line_id: string | null
          sequence_number: number
          station_id: string | null
        }
        Insert: {
          id?: string
          line_id?: string | null
          sequence_number: number
          station_id?: string | null
        }
        Update: {
          id?: string
          line_id?: string | null
          sequence_number?: number
          station_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "line_stations_line_id_fkey"
            columns: ["line_id"]
            isOneToOne: false
            referencedRelation: "lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "line_stations_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      lines: {
        Row: {
          color: string
          id: string
          name: string
        }
        Insert: {
          color: string
          id: string
          name: string
        }
        Update: {
          color?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      saved_routes: {
        Row: {
          created_at: string | null
          destination_id: string | null
          id: string
          name: string | null
          source_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          destination_id?: string | null
          id?: string
          name?: string | null
          source_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          destination_id?: string | null
          id?: string
          name?: string | null
          source_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_routes_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_routes_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_routes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_alerts: {
        Row: {
          affected_line_id: string | null
          affected_station_id: string | null
          created_at: string | null
          description: string
          end_time: string | null
          id: string
          severity: string
          start_time: string
          title: string
        }
        Insert: {
          affected_line_id?: string | null
          affected_station_id?: string | null
          created_at?: string | null
          description: string
          end_time?: string | null
          id?: string
          severity: string
          start_time: string
          title: string
        }
        Update: {
          affected_line_id?: string | null
          affected_station_id?: string | null
          created_at?: string | null
          description?: string
          end_time?: string | null
          id?: string
          severity?: string
          start_time?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_alerts_affected_line_id_fkey"
            columns: ["affected_line_id"]
            isOneToOne: false
            referencedRelation: "lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_alerts_affected_station_id_fkey"
            columns: ["affected_station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      station_distances: {
        Row: {
          distance: number
          from_station_id: string | null
          id: string
          to_station_id: string | null
        }
        Insert: {
          distance: number
          from_station_id?: string | null
          id?: string
          to_station_id?: string | null
        }
        Update: {
          distance?: number
          from_station_id?: string | null
          id?: string
          to_station_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "station_distances_from_station_id_fkey"
            columns: ["from_station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "station_distances_to_station_id_fkey"
            columns: ["to_station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      stations: {
        Row: {
          amenities: Json
          id: string
          location: Json
          name: string
          name_hindi: string | null
          nearby_landmarks: string[] | null
        }
        Insert: {
          amenities: Json
          id: string
          location: Json
          name: string
          name_hindi?: string | null
          nearby_landmarks?: string[] | null
        }
        Update: {
          amenities?: Json
          id?: string
          location?: Json
          name?: string
          name_hindi?: string | null
          nearby_landmarks?: string[] | null
        }
        Relationships: []
      }
      train_status: {
        Row: {
          current_station_id: string | null
          delay_minutes: number | null
          direction: string
          id: string
          last_updated: string | null
          line_id: string | null
          location: Json | null
          next_station_id: string | null
          status: string
          train_id: string
        }
        Insert: {
          current_station_id?: string | null
          delay_minutes?: number | null
          direction: string
          id?: string
          last_updated?: string | null
          line_id?: string | null
          location?: Json | null
          next_station_id?: string | null
          status: string
          train_id: string
        }
        Update: {
          current_station_id?: string | null
          delay_minutes?: number | null
          direction?: string
          id?: string
          last_updated?: string | null
          line_id?: string | null
          location?: Json | null
          next_station_id?: string | null
          status?: string
          train_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "train_status_current_station_id_fkey"
            columns: ["current_station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "train_status_line_id_fkey"
            columns: ["line_id"]
            isOneToOne: false
            referencedRelation: "lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "train_status_next_station_id_fkey"
            columns: ["next_station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      train_timings: {
        Row: {
          id: string
          station_id: string | null
          weekday_first_train: string
          weekday_frequency: number
          weekday_last_train: string
          weekend_first_train: string
          weekend_frequency: number
          weekend_last_train: string
        }
        Insert: {
          id?: string
          station_id?: string | null
          weekday_first_train: string
          weekday_frequency: number
          weekday_last_train: string
          weekend_first_train: string
          weekend_frequency: number
          weekend_last_train: string
        }
        Update: {
          id?: string
          station_id?: string | null
          weekday_first_train?: string
          weekday_frequency?: number
          weekday_last_train?: string
          weekend_first_train?: string
          weekend_frequency?: number
          weekend_last_train?: string
        }
        Relationships: [
          {
            foreignKeyName: "train_timings_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      fare_category: "Regular" | "Discounted"
      station_amenity:
        | "parking"
        | "elevator"
        | "restroom"
        | "wheelchairAccess"
        | "wifi"
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
      fare_category: ["Regular", "Discounted"],
      station_amenity: [
        "parking",
        "elevator",
        "restroom",
        "wheelchairAccess",
        "wifi",
      ],
    },
  },
} as const
