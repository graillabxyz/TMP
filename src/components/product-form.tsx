import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/types";
import type { ProductUpdate } from "@/lib/products";

type ProductFormLabels = {
  title: string;
  productTitle: string;
  category: string;
  description: string;
  minimumOrderQuantity: string;
  priceMin: string;
  priceMax: string;
  currency: string;
  leadTime: string;
  leadTimePlaceholder: string;
  images: string;
  imagePlaceholder: string;
  imageHelp: string;
  status: string;
  draft: string;
  published: string;
  archived: string;
  submit: string;
  cancel: string;
};

type ProductFormProps = {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  labels: ProductFormLabels;
  product?: ProductUpdate & { id: string };
};

export function ProductForm({
  action,
  categories,
  labels,
  product,
}: ProductFormProps) {
  const imageValue = Array.isArray(product?.images)
    ? product?.images?.[0]
    : undefined;

  return (
    <Card className="max-w-4xl bg-white/[0.035]">
      <CardHeader>
        <CardTitle>{labels.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-5">
          {product?.id && <input type="hidden" name="id" value={product.id} />}

          <div className="grid gap-2">
            <Label htmlFor="title">{labels.productTitle}</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={product?.title ?? ""}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category_id">{labels.category}</Label>
            <Select
              id="category_id"
              name="category_id"
              required
              defaultValue={product?.category_id ?? ""}
            >
              <option value="" disabled>
                {labels.category}
              </option>
              {categories.map((category) => (
                <option key={category.slug} value={category.id ?? ""}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">{labels.description}</Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={6}
              defaultValue={product?.description ?? ""}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="moq">{labels.minimumOrderQuantity}</Label>
              <Input
                id="moq"
                name="moq"
                type="number"
                min="1"
                defaultValue={product?.moq ?? ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lead_time">{labels.leadTime}</Label>
              <Input
                id="lead_time"
                name="lead_time"
                placeholder={labels.leadTimePlaceholder}
                defaultValue={product?.lead_time ?? ""}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_1fr_140px]">
            <div className="grid gap-2">
              <Label htmlFor="price_min">{labels.priceMin}</Label>
              <Input
                id="price_min"
                name="price_min"
                type="number"
                min="0"
                step="0.01"
                defaultValue={product?.price_min ?? ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price_max">{labels.priceMax}</Label>
              <Input
                id="price_max"
                name="price_max"
                type="number"
                min="0"
                step="0.01"
                defaultValue={product?.price_max ?? ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currency">{labels.currency}</Label>
              <Select
                id="currency"
                name="currency"
                defaultValue={product?.currency ?? "EUR"}
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="TRY">TRY</option>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image_url">{labels.images}</Label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              placeholder={labels.imagePlaceholder}
              defaultValue={imageValue ?? ""}
            />
            <p className="text-xs text-muted-foreground">{labels.imageHelp}</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">{labels.status}</Label>
            <Select
              id="status"
              name="status"
              defaultValue={product?.status ?? "draft"}
            >
              <option value="draft">{labels.draft}</option>
              <option value="published">{labels.published}</option>
              <option value="archived">{labels.archived}</option>
            </Select>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <Button asChild variant="outline" className="sm:min-w-32">
              <Link href="/dashboard/products">{labels.cancel}</Link>
            </Button>
            <Button type="submit" className="sm:min-w-36">
              {labels.submit}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
