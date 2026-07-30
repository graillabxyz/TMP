import { curatedProductMedia } from "../data/curated-product-media.ts";

const brokenRigidBoxImagePrefix =
  "https://images.unsplash.com/photo-1607344645866-";

const rigidBoxFallbackImage =
  "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=900&q=80";

export function repairKnownSeedImage(
  image: string,
  productSlug?: string | null,
) {
  if (productSlug && productSlug in curatedProductMedia) {
    return curatedProductMedia[productSlug as keyof typeof curatedProductMedia];
  }

  return image.startsWith(brokenRigidBoxImagePrefix)
    ? rigidBoxFallbackImage
    : image;
}

export function repairKnownSeedImages(
  images: string[],
  productSlug?: string | null,
) {
  return images.map((image) => repairKnownSeedImage(image, productSlug));
}
