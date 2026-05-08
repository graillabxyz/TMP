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
      profiles: {
        Row: {
          id: string;
          email: string;
          role: "buyer" | "supplier" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: "buyer" | "supplier" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      supplier_categories: {
        Row: {
          id: string;
          name: string;
          name_fr: string | null;
          slug: string;
          description: string;
          description_fr: string | null;
          supplier_count: number;
          display_order: number;
          is_active: boolean;
          status: "draft" | "published" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_fr?: string | null;
          slug: string;
          description: string;
          description_fr?: string | null;
          supplier_count?: number;
          display_order?: number;
          is_active?: boolean;
          status?: "draft" | "published" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["supplier_categories"]["Insert"]
        >;
        Relationships: [];
      };
      supplier_accounts: {
        Row: {
          id: string;
          owner_id: string | null;
          category_id: string | null;
          slug: string;
          company_name: string;
          company_name_fr: string | null;
          city: string;
          country: string;
          summary: string;
          summary_fr: string | null;
          description: string;
          description_fr: string | null;
          verified: boolean;
          year_founded: number | null;
          employees: string;
          export_markets: string[];
          moq: string;
          response_time: string;
          image_url: string;
          tags: string[];
          tags_fr: string[];
          certifications: string[];
          certifications_fr: string[];
          verification_status:
            | "draft"
            | "submitted"
            | "approved"
            | "published"
            | "rejected";
          business_license_url: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          category_id?: string | null;
          slug: string;
          company_name: string;
          company_name_fr?: string | null;
          city: string;
          country?: string;
          summary?: string;
          summary_fr?: string | null;
          description?: string;
          description_fr?: string | null;
          verified?: boolean;
          year_founded?: number | null;
          employees?: string;
          export_markets?: string[];
          moq?: string;
          response_time?: string;
          image_url?: string;
          tags?: string[];
          tags_fr?: string[];
          certifications?: string[];
          certifications_fr?: string[];
          verification_status?:
            | "draft"
            | "submitted"
            | "approved"
            | "published"
            | "rejected";
          business_license_url?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["supplier_accounts"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "supplier_accounts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "supplier_categories";
            referencedColumns: ["id"];
          },
        ];
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
          title: string;
          title_fr: string | null;
          description: string;
          description_fr: string | null;
          category: string;
          category_fr: string | null;
          moq: string;
          image_url: string;
          status: "draft" | "published" | "archived";
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          title: string;
          title_fr?: string | null;
          description?: string;
          description_fr?: string | null;
          category?: string;
          category_fr?: string | null;
          moq?: string;
          image_url?: string;
          status?: "draft" | "published" | "archived";
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
            referencedRelation: "supplier_accounts";
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
