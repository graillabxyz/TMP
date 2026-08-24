import type { ProductFieldErrors } from "@/lib/product-input";

export type ProductFormState = {
  status: "idle" | "error";
  formError?:
    | "invalid"
    | "category"
    | "image"
    | "save"
    | "notFound"
    | "supplierRequired";
  fieldErrors?: ProductFieldErrors;
};

export const initialProductFormState: ProductFormState = { status: "idle" };
