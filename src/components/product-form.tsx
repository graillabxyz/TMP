"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  CheckCircle2,
  ImagePlus,
  PackageOpen,
  Save,
  Send,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ProductFormState } from "@/lib/product-form-state";
import { initialProductFormState } from "@/lib/product-form-state";
import type { ProductErrorCode, ProductField } from "@/lib/product-input";
import { MAX_PRODUCT_IMAGE_BYTES, MAX_PRODUCT_IMAGES } from "@/lib/media";
import type { Locale } from "@/lib/i18n";
import type { ProductUpdate } from "@/lib/products";
import type { Category } from "@/types";

export type ProductFormLabels = {
  detailsTitle: string;
  detailsBody: string;
  productTitle: string;
  productTitlePlaceholder: string;
  productTitleHelp: string;
  category: string;
  categoryPlaceholder: string;
  productDescription: string;
  descriptionPlaceholder: string;
  descriptionHelp: string;
  characters: string;
  orderTitle: string;
  orderBody: string;
  minimumOrderQuantity: string;
  moqPlaceholder: string;
  moqHelp: string;
  priceMin: string;
  priceMax: string;
  pricePlaceholder: string;
  priceHelp: string;
  currency: string;
  leadTime: string;
  leadTimePlaceholder: string;
  leadTimeHelp: string;
  mediaTitle: string;
  mediaBody: string;
  uploadImages: string;
  imageHelp: string;
  replaceImage: string;
  removeImage: string;
  listingPreview: string;
  previewEmptyTitle: string;
  priceOnRequest: string;
  publishingTitle: string;
  publishingBody: string;
  saveDraft: string;
  publishProduct: string;
  updatePublished: string;
  saving: string;
  publishing: string;
  draftHelp: string;
  publishHelp: string;
  requiredError: string;
  titleLengthError: string;
  descriptionLengthError: string;
  integerError: string;
  numberError: string;
  priceRangeError: string;
  invalidOptionError: string;
  imageRequiredError: string;
  imageInvalidError: string;
  imageCountError: string;
  formError: string;
  categoryError: string;
  saveError: string;
  notFoundError: string;
};

type ProductAction = (
  state: ProductFormState,
  payload: FormData,
) => Promise<ProductFormState>;

type ProductFormProps = {
  action: ProductAction;
  categories: Category[];
  cancelHref: string;
  cancelLabel: string;
  locale: Locale;
  labels: ProductFormLabels;
  product?: ProductUpdate & { id: string };
};

const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function formatBytes(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ProductForm({
  action,
  categories,
  cancelHref,
  cancelLabel,
  locale,
  labels,
  product,
}: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialProductFormState,
  );
  const [pendingIntent, setPendingIntent] = useState<"draft" | "published">(
    "draft",
  );
  const [title, setTitle] = useState(product?.title ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [moq, setMoq] = useState(product?.moq?.toString() ?? "");
  const [leadTime, setLeadTime] = useState(product?.lead_time ?? "");
  const [priceMin, setPriceMin] = useState(
    product?.price_min?.toString() ?? "",
  );
  const [priceMax, setPriceMax] = useState(
    product?.price_max?.toString() ?? "",
  );
  const [currency, setCurrency] = useState(product?.currency ?? "EUR");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [clientImageError, setClientImageError] = useState<
    "imageInvalid" | "imageCount" | null
  >(null);
  const [editedFields, setEditedFields] = useState<Set<ProductField>>(
    new Set(),
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const currentImages = Array.isArray(product?.images) ? product.images : [];
  const displayImages = previewUrls.length > 0 ? previewUrls : currentImages;

  useEffect(() => {
    if (state.status === "error") {
      setEditedFields(new Set());
      errorSummaryRef.current?.focus();
    }
  }, [state]);

  useEffect(() => {
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [previewUrls]);

  const setFiles = (files: File[]) => {
    markEdited("images");
    setClientImageError(null);

    if (files.length > MAX_PRODUCT_IMAGES) {
      setClientImageError("imageCount");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelectedFiles([]);
      setPreviewUrls([]);
      return;
    }
    if (
      files.some(
        (file) =>
          !acceptedImageTypes.has(file.type) ||
          file.size === 0 ||
          file.size > MAX_PRODUCT_IMAGE_BYTES,
      )
    ) {
      setClientImageError("imageInvalid");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelectedFiles([]);
      setPreviewUrls([]);
      return;
    }

    setSelectedFiles(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  };

  const removeSelectedFile = (index: number) => {
    const nextFiles = selectedFiles.filter(
      (_, fileIndex) => fileIndex !== index,
    );
    const transfer = new DataTransfer();
    nextFiles.forEach((file) => transfer.items.add(file));
    if (fileInputRef.current) fileInputRef.current.files = transfer.files;
    setFiles(nextFiles);
  };

  const markEdited = (field: ProductField) => {
    setEditedFields((current) => new Set(current).add(field));
  };

  const errorMessage = (field: ProductField) => {
    const priceRangeIsInvalid =
      field === "price_max" &&
      priceMin !== "" &&
      priceMax !== "" &&
      Number(priceMin) > Number(priceMax);
    const code = priceRangeIsInvalid
      ? "priceRange"
      : field === "images" && clientImageError
        ? clientImageError
        : editedFields.has(field)
          ? undefined
          : state.fieldErrors?.[field];

    const messages: Partial<
      Record<
        ProductErrorCode | "imageRequired" | "imageInvalid" | "imageCount",
        string
      >
    > = {
      required: labels.requiredError,
      titleLength: labels.titleLengthError,
      descriptionLength: labels.descriptionLengthError,
      integer: labels.integerError,
      number: labels.numberError,
      priceRange: labels.priceRangeError,
      invalidOption: labels.invalidOptionError,
      imageRequired: labels.imageRequiredError,
      imageInvalid: labels.imageInvalidError,
      imageCount: labels.imageCountError,
    };

    return code ? messages[code] : undefined;
  };

  const formError =
    state.formError === "category"
      ? labels.categoryError
      : state.formError === "save"
        ? labels.saveError
        : state.formError === "notFound"
          ? labels.notFoundError
          : labels.formError;
  const selectedCategory = categories.find(
    (category) => category.id === categoryId,
  );
  const previewPrice = priceMin
    ? priceMax
      ? `${priceMin}-${priceMax} ${currency}`
      : `${priceMin} ${currency}`
    : priceMax
      ? `${priceMax} ${currency}`
      : labels.priceOnRequest;

  const fieldClass = (field: ProductField) =>
    cn(
      errorMessage(field) &&
        "border-destructive focus-visible:border-destructive",
    );

  return (
    <form action={formAction} className="mx-auto w-full max-w-7xl">
      <input type="hidden" name="locale" value={locale} />
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      {state.status === "error" && (
        <div
          ref={errorSummaryRef}
          role="alert"
          tabIndex={-1}
          className="mb-6 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-red-100 outline-none focus-visible:ring-2 focus-visible:ring-destructive"
        >
          <p className="font-medium">{formError}</p>
        </div>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.025]">
          <section className="p-5 sm:p-7 lg:p-8">
            <div className="mb-6 max-w-2xl">
              <h2 className="text-xl font-semibold text-white">
                {labels.detailsTitle}
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {labels.detailsBody}
              </p>
            </div>

            <div className="grid gap-5">
              <div className="grid gap-2">
                <div className="flex items-end justify-between gap-4">
                  <Label htmlFor="title">{labels.productTitle}</Label>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {title.length}/160
                  </span>
                </div>
                <Input
                  id="title"
                  name="title"
                  required
                  minLength={3}
                  maxLength={160}
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    markEdited("title");
                  }}
                  placeholder={labels.productTitlePlaceholder}
                  aria-invalid={Boolean(errorMessage("title"))}
                  aria-describedby="title-help title-error"
                  className={cn("h-12", fieldClass("title"))}
                />
                <FieldHelp id="title-help">{labels.productTitleHelp}</FieldHelp>
                <FieldError id="title-error" message={errorMessage("title")} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category_id">{labels.category}</Label>
                <Select
                  id="category_id"
                  name="category_id"
                  required
                  value={categoryId}
                  onChange={(event) => {
                    setCategoryId(event.target.value);
                    markEdited("category_id");
                  }}
                  aria-invalid={Boolean(errorMessage("category_id"))}
                  aria-describedby="category-error"
                  className={cn("h-12", fieldClass("category_id"))}
                >
                  <option value="" disabled>
                    {labels.categoryPlaceholder}
                  </option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.id ?? ""}>
                      {category.name}
                    </option>
                  ))}
                </Select>
                <FieldError
                  id="category-error"
                  message={errorMessage("category_id")}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-end justify-between gap-4">
                  <Label htmlFor="description">
                    {labels.productDescription}
                  </Label>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {description.length}/5000 {labels.characters}
                  </span>
                </div>
                <Textarea
                  id="description"
                  name="description"
                  required
                  minLength={20}
                  maxLength={5000}
                  rows={7}
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    markEdited("description");
                  }}
                  placeholder={labels.descriptionPlaceholder}
                  aria-invalid={Boolean(errorMessage("description"))}
                  aria-describedby="description-help description-error"
                  className={cn("min-h-44 resize-y", fieldClass("description"))}
                />
                <FieldHelp id="description-help">
                  {labels.descriptionHelp}
                </FieldHelp>
                <FieldError
                  id="description-error"
                  message={errorMessage("description")}
                />
              </div>
            </div>
          </section>

          <section className="border-t border-white/10 p-5 sm:p-7 lg:p-8">
            <div className="mb-6 max-w-2xl">
              <h2 className="text-xl font-semibold text-white">
                {labels.orderTitle}
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {labels.orderBody}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="moq">{labels.minimumOrderQuantity}</Label>
                <Input
                  id="moq"
                  name="moq"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="1000000000"
                  value={moq}
                  onChange={(event) => {
                    setMoq(event.target.value);
                    markEdited("moq");
                  }}
                  placeholder={labels.moqPlaceholder}
                  aria-invalid={Boolean(errorMessage("moq"))}
                  aria-describedby="moq-help moq-error"
                  className={fieldClass("moq")}
                />
                <FieldHelp id="moq-help">{labels.moqHelp}</FieldHelp>
                <FieldError id="moq-error" message={errorMessage("moq")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lead_time">{labels.leadTime}</Label>
                <Input
                  id="lead_time"
                  name="lead_time"
                  maxLength={120}
                  value={leadTime}
                  onChange={(event) => {
                    setLeadTime(event.target.value);
                    markEdited("lead_time");
                  }}
                  placeholder={labels.leadTimePlaceholder}
                  aria-invalid={Boolean(errorMessage("lead_time"))}
                  aria-describedby="lead-time-help lead-time-error"
                  className={fieldClass("lead_time")}
                />
                <FieldHelp id="lead-time-help">{labels.leadTimeHelp}</FieldHelp>
                <FieldError
                  id="lead-time-error"
                  message={errorMessage("lead_time")}
                />
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_140px]">
              <div className="grid gap-2">
                <Label htmlFor="price_min">{labels.priceMin}</Label>
                <Input
                  id="price_min"
                  name="price_min"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="1000000000000"
                  step="0.01"
                  value={priceMin}
                  onChange={(event) => {
                    setPriceMin(event.target.value);
                    markEdited("price_min");
                    markEdited("price_max");
                  }}
                  placeholder={labels.pricePlaceholder}
                  aria-invalid={Boolean(errorMessage("price_min"))}
                  aria-describedby="price-help price-min-error"
                  className={fieldClass("price_min")}
                />
                <FieldError
                  id="price-min-error"
                  message={errorMessage("price_min")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price_max">{labels.priceMax}</Label>
                <Input
                  id="price_max"
                  name="price_max"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="1000000000000"
                  step="0.01"
                  value={priceMax}
                  onChange={(event) => {
                    setPriceMax(event.target.value);
                    markEdited("price_max");
                  }}
                  placeholder={labels.pricePlaceholder}
                  aria-invalid={Boolean(errorMessage("price_max"))}
                  aria-describedby="price-help price-max-error"
                  className={fieldClass("price_max")}
                />
                <FieldError
                  id="price-max-error"
                  message={errorMessage("price_max")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currency">{labels.currency}</Label>
                <Select
                  id="currency"
                  name="currency"
                  value={currency}
                  onChange={(event) => {
                    setCurrency(event.target.value);
                    markEdited("currency");
                  }}
                  aria-invalid={Boolean(errorMessage("currency"))}
                  className={fieldClass("currency")}
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="TRY">TRY</option>
                </Select>
              </div>
            </div>
            <FieldHelp id="price-help" className="mt-2">
              {labels.priceHelp}
            </FieldHelp>
          </section>
        </div>

        <aside className="grid gap-5 xl:sticky xl:top-24">
          <section className="rounded-lg border border-white/10 bg-white/[0.025] p-5">
            <h2 className="text-base font-semibold text-white">
              {labels.mediaTitle}
            </h2>
            <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
              {labels.mediaBody}
            </p>

            <label
              htmlFor="images"
              className={cn(
                "mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-white/20 bg-black/20 px-4 text-center transition focus-within:ring-2 focus-within:ring-ring hover:border-gold-300/50 hover:bg-gold-300/[0.04]",
                errorMessage("images") && "border-destructive/70",
              )}
            >
              <span className="mb-3 flex size-10 items-center justify-center rounded-md bg-gold-300/10 text-gold-200">
                <ImagePlus className="size-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-white">
                {labels.uploadImages}
              </span>
              <span className="mt-1 text-xs leading-5 text-muted-foreground">
                {currentImages.length ? labels.replaceImage : labels.imageHelp}
              </span>
              <input
                ref={fileInputRef}
                id="images"
                name="images"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                onChange={(event) =>
                  setFiles(Array.from(event.target.files ?? []))
                }
                aria-invalid={Boolean(errorMessage("images"))}
                aria-describedby="images-error"
              />
            </label>
            <FieldError
              id="images-error"
              message={errorMessage("images")}
              className="mt-2"
            />

            {displayImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {displayImages.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-md border border-white/10 bg-charcoal-800"
                  >
                    <Image
                      src={url}
                      alt=""
                      fill
                      unoptimized={url.startsWith("blob:")}
                      className="object-cover"
                      sizes="110px"
                    />
                    {previewUrls.length > 0 && (
                      <button
                        type="button"
                        onClick={() => removeSelectedFile(index)}
                        className="absolute right-1.5 top-1.5 flex size-8 items-center justify-center rounded-md bg-black/75 text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
                        aria-label={labels.removeImage}
                        title={labels.removeImage}
                      >
                        <X className="size-4" aria-hidden="true" />
                      </button>
                    )}
                    {selectedFiles[index] && (
                      <span className="absolute bottom-1.5 left-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] text-white">
                        {formatBytes(selectedFiles[index].size)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.025]">
            <div className="border-b border-white/10 px-5 py-4">
              <h2 className="text-sm font-semibold text-white">
                {labels.listingPreview}
              </h2>
            </div>
            <div className="p-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-charcoal-800">
                {displayImages[0] ? (
                  <Image
                    src={displayImages[0]}
                    alt=""
                    fill
                    unoptimized={displayImages[0].startsWith("blob:")}
                    className="object-cover"
                    sizes="328px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <PackageOpen className="size-9" aria-hidden="true" />
                  </div>
                )}
              </div>
              <p className="mt-4 line-clamp-2 min-h-12 text-base font-semibold leading-6 text-white">
                {title || labels.previewEmptyTitle}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {selectedCategory?.name ?? labels.categoryPlaceholder}
              </p>
              <div className="mt-4 flex items-end justify-between gap-3 border-t border-white/10 pt-3">
                <p className="font-semibold text-gold-100">{previewPrice}</p>
                {moq && (
                  <p className="text-xs text-muted-foreground">MOQ {moq}</p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-gold-300/20 bg-gold-300/[0.04] p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="mt-0.5 size-5 shrink-0 text-gold-200"
                aria-hidden="true"
              />
              <div>
                <h2 className="text-base font-semibold text-white">
                  {labels.publishingTitle}
                </h2>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  {labels.publishingBody}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              <Button
                type="submit"
                name="status"
                value="published"
                disabled={isPending}
                onClick={() => setPendingIntent("published")}
                className="w-full"
              >
                <Send aria-hidden="true" />
                {isPending && pendingIntent === "published"
                  ? labels.publishing
                  : product?.status === "published"
                    ? labels.updatePublished
                    : labels.publishProduct}
              </Button>
              <Button
                type="submit"
                name="status"
                value="draft"
                variant="outline"
                disabled={isPending}
                onClick={() => setPendingIntent("draft")}
                className="w-full"
              >
                <Save aria-hidden="true" />
                {isPending && pendingIntent === "draft"
                  ? labels.saving
                  : labels.saveDraft}
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href={cancelHref}>{cancelLabel}</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              {pendingIntent === "published"
                ? labels.publishHelp
                : labels.draftHelp}
            </p>
          </section>
        </aside>
      </div>
    </form>
  );
}

function FieldHelp({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id: string;
}) {
  return (
    <p
      id={id}
      className={cn("text-xs leading-5 text-muted-foreground", className)}
    >
      {children}
    </p>
  );
}

function FieldError({
  className,
  id,
  message,
}: {
  className?: string;
  id: string;
  message?: string;
}) {
  if (!message) return null;
  return (
    <p id={id} className={cn("text-xs leading-5 text-red-200", className)}>
      {message}
    </p>
  );
}
