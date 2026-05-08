export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      supplier_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          supplier_count: number;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          supplier_count?: number;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["supplier_categories"]["Insert"]
        >;
        Relationships: [];
      };
      suppliers: {
        Row: {
          id: string;
          category_id: string | null;
          slug: string;
          name: string;
          city: string;
          country: string;
          summary: string;
          description: string;
          verified: boolean;
          year_founded: number;
          employees: string;
          export_markets: string[];
          moq: string;
          response_time: string;
          image_url: string;
          tags: string[];
          certifications: string[];
          status: "draft" | "pending" | "published" | "archived";
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          slug: string;
          name: string;
          city: string;
          country?: string;
          summary: string;
          description: string;
          verified?: boolean;
          year_founded: number;
          employees: string;
          export_markets?: string[];
          moq: string;
          response_time: string;
          image_url: string;
          tags?: string[];
          certifications?: string[];
          status?: "draft" | "pending" | "published" | "archived";
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["suppliers"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "suppliers_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "supplier_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      supplier_products: {
        Row: {
          id: string;
          supplier_id: string;
          name: string;
          category: string;
          moq: string;
          image_url: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          name: string;
          category: string;
          moq: string;
          image_url: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["supplier_products"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "supplier_products_supplier_id_fkey";
            columns: ["supplier_id"];
            isOneToOne: false;
            referencedRelation: "suppliers";
            referencedColumns: ["id"];
          },
        ];
      };
      rfqs: {
        Row: {
          id: string;
          product_request: string;
          category_slug: string | null;
          quantity: string;
          destination_country: string;
          target_timeline: string | null;
          notes: string | null;
          attachment_name: string | null;
          attachment_size: number | null;
          attachment_type: string | null;
          status: "new" | "reviewing" | "matched" | "closed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_request: string;
          category_slug?: string | null;
          quantity: string;
          destination_country: string;
          target_timeline?: string | null;
          notes?: string | null;
          attachment_name?: string | null;
          attachment_size?: number | null;
          attachment_type?: string | null;
          status?: "new" | "reviewing" | "matched" | "closed";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["rfqs"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "rfqs_category_slug_fkey";
            columns: ["category_slug"];
            isOneToOne: false;
            referencedRelation: "supplier_categories";
            referencedColumns: ["slug"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
