const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const slugPattern = /^[a-z0-9-]{1,120}$/;
const singleLineControlPattern = /[\u0000-\u001f\u007f]/;

export function isValidRfqUuid(value: string) {
  return uuidPattern.test(value);
}

export function isValidOptionalRfqSlug(value: string) {
  return !value || slugPattern.test(value);
}

export function isValidRfqEmail(value: string) {
  return (
    value.length >= 3 &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

export function isValidSingleLineRfqValue(
  value: string,
  options: { min: number; max: number; optional?: boolean },
) {
  if (!value) {
    return Boolean(options.optional);
  }

  return (
    value.length >= options.min &&
    value.length <= options.max &&
    !singleLineControlPattern.test(value)
  );
}

export function hasSpecificProductDetail(
  value: string,
  hasCatalogProduct: boolean,
) {
  const words = value
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word) && word.length > 2);
  const hasSpecSignal =
    /[,/()+-]|\b(gsm|mm|cm|kg|pcs|units|adet|unités|oeko|iso|fsc|ce|cotton|coton|pamuk|aluminum|aluminium|alüminyum|steel|acier|çelik|paper|papier|kağıt|private label|marque privée|özel etiket|packaging|emballage|ambalaj)\b/iu.test(
      value,
    );

  if (hasCatalogProduct) {
    return value.length >= 12 && words.length >= 2;
  }

  return value.length >= 24 && words.length >= 4 && hasSpecSignal;
}

export function hasSpecificQuantity(value: string) {
  return (
    value.length <= 80 &&
    /\d/u.test(value) &&
    /[\p{L}]/u.test(value) &&
    !singleLineControlPattern.test(value)
  );
}

export function sanitizeRfqAttachmentName(
  fileName: string,
  fallbackExtension: string,
) {
  const leafName = fileName.split(/[\\/]/).pop() ?? "";
  const cleanName = leafName
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, 180);

  return cleanName || `attachment.${fallbackExtension}`;
}
