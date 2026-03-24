interface ProjectImageProps {
  src: string;
  alt: string;
  caption?: string;
}

export function ProjectImage({ src, alt, caption }: ProjectImageProps) {
  return (
    <figure className="w-full">
      <div className="rounded-xl border border-border overflow-hidden shadow-lg shadow-black/20">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="text-sm text-muted-foreground mt-3 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
