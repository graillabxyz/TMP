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
      site_assets: {
        Row: {
          key: string;
          bucket: string;
          path: string;
          alt: string;
          alt_fr: string | null;
          alt_tr: string | null;
          ready: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          bucket: string;
          path: string;
          alt?: string;
          alt_fr?: string | null;
          alt_tr?: string | null;
          ready?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["site_assets"]["Insert"]
        >;
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
          owner_id: string | null;
          category_id: string | null;
          slug: string;
          company_name: string;
          company_name_fr: string | null;
          name: string;
          city: string;
          country: string;
          summary: string;
          summary_fr: string | null;
          description: string;
          description_fr: string | null;
          verified: boolean;
          year_founded: number;
          employees: string;
          export_markets: string[];
          moq: string;
          response_time: string;
          image_url: string;
          tags: string[];
          tags_fr: string[];
          certifications: string[];
          certifications_fr: string[];
          verification_status: "none" | "pending" | "verified" | "rejected";
          verification_subscription_status:
            | "inactive"
            | "active"
            | "past_due"
            | "canceled";
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          verification_started_at: string | null;
          verification_expires_at: string | null;
          logo_url: string | null;
          status: "draft" | "pending" | "published" | "archived";
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          category_id?: string | null;
          slug: string;
          company_name?: string;
          company_name_fr?: string | null;
          name: string;
          city: string;
          country?: string;
          summary: string;
          summary_fr?: string | null;
          description: string;
          description_fr?: string | null;
          verified?: boolean;
          year_founded: number;
          employees: string;
          export_markets?: string[];
          moq: string;
          response_time: string;
          image_url: string;
          tags?: string[];
          tags_fr?: string[];
          certifications?: string[];
          certifications_fr?: string[];
          verification_status?: "none" | "pending" | "verified" | "rejected";
          verification_subscription_status?:
            | "inactive"
            | "active"
            | "past_due"
            | "canceled";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          verification_started_at?: string | null;
          verification_expires_at?: string | null;
          logo_url?: string | null;
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
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      supplier_verification_documents: {
        Row: {
          id: string;
          supplier_id: string;
          business_license_url: string | null;
          company_registration_url: string | null;
          certifications_url: string | null;
          business_license_path: string | null;
          company_registration_path: string | null;
          certifications_path: string | null;
          notes: string | null;
          submitted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          business_license_url?: string | null;
          company_registration_url?: string | null;
          certifications_url?: string | null;
          business_license_path?: string | null;
          company_registration_path?: string | null;
          certifications_path?: string | null;
          notes?: string | null;
          submitted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["supplier_verification_documents"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "supplier_verification_documents_supplier_id_fkey";
            columns: ["supplier_id"];
            isOneToOne: true;
            referencedRelation: "suppliers";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          name_fr: string | null;
          slug: string;
          description: string;
          description_fr: string | null;
          parent_id: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_fr?: string | null;
          slug: string;
          description?: string;
          description_fr?: string | null;
          parent_id?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      supplier_products: {
        Row: {
          id: string;
          supplier_id: string;
          category_id: string | null;
          title: string;
          title_fr: string | null;
          slug: string;
          description: string;
          description_fr: string | null;
          price_min: number | null;
          price_max: number | null;
          currency: string;
          moq: number | null;
          lead_time: string | null;
          images: string[];
          status: "draft" | "published" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          category_id?: string | null;
          title: string;
          title_fr?: string | null;
          slug: string;
          description: string;
          description_fr?: string | null;
          price_min?: number | null;
          price_max?: number | null;
          currency?: string;
          moq?: number | null;
          lead_time?: string | null;
          images?: string[];
          status?: "draft" | "published" | "archived";
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
          {
            foreignKeyName: "supplier_products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      rfqs: {
        Row: {
          id: string;
          submitter_id: string | null;
          product_id: string | null;
          supplier_id: string | null;
          product_slug: string | null;
          supplier_slug: string | null;
          inquiry_type: "general" | "product";
          product_request: string;
          category_slug: string | null;
          quantity: string;
          destination_country: string;
          target_timeline: string | null;
          notes: string | null;
          attachment_name: string | null;
          attachment_size: number | null;
          attachment_type: string | null;
          attachment_path: string | null;
          status: "new" | "reviewing" | "matched" | "closed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          submitter_id?: string | null;
          product_id?: string | null;
          supplier_id?: string | null;
          product_slug?: string | null;
          supplier_slug?: string | null;
          inquiry_type?: "general" | "product";
          product_request: string;
          category_slug?: string | null;
          quantity: string;
          destination_country: string;
          target_timeline?: string | null;
          notes?: string | null;
          attachment_name?: string | null;
          attachment_size?: number | null;
          attachment_type?: string | null;
          attachment_path?: string | null;
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
          {
            foreignKeyName: "rfqs_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "supplier_products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rfqs_supplier_id_fkey";
            columns: ["supplier_id"];
            isOneToOne: false;
            referencedRelation: "suppliers";
            referencedColumns: ["id"];
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
