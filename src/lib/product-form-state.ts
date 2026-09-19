import type { ProductFieldErrors } from "@/lib/product-input";

export type ProductFormState = {
  status: "idle" | "error" | "success";
  redirectTo?: string;
  formError?:
    | "invalid"
    | "category"
    | "image"
    | "save"
    | "notFound"
    | "supplierRequired"
    | "subscriptionRequired";
  fieldErrors?: ProductFieldErrors;
};

export const initialProductFormState: ProductFormState = { status: "idle" };
