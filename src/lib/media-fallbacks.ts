const brokenRigidBoxImagePrefix =
  "https://images.unsplash.com/photo-1607344645866-";

const rigidBoxFallbackImage =
  "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=900&q=80";

export function repairKnownSeedImage(image: string) {
  return image.startsWith(brokenRigidBoxImagePrefix)
    ? rigidBoxFallbackImage
    : image;
}

export function repairKnownSeedImages(images: string[]) {
  return images.map(repairKnownSeedImage);
}
