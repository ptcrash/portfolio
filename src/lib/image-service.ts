/*
 * Image service: Astro's built-in sharp pipeline, plus one change. The built-in
 * service strips every byte of metadata from its output, which means the WebP
 * files a visitor can save from the gallery carry no author or copyright. This
 * service keeps the EXIF and XMP blocks that are already in the source file, so
 * a photo master stamped with "© Johnny Martin" produces derivatives stamped
 * the same way, and a screenshot with no metadata stays clean.
 *
 * Everything else is the same as astro/assets/services/sharp.
 */
import type { LocalImageService } from 'astro';
import sharpService, { resolveSharpEncoderOptions } from 'astro/assets/services/sharp';
import sharp from 'sharp';

sharp.cache(false);

const fitMap = {
  fill: 'fill',
  contain: 'inside',
  cover: 'cover',
  none: 'outside',
  'scale-down': 'inside',
  outside: 'outside',
  inside: 'inside',
} as const;

const service: LocalImageService = {
  ...sharpService,
  async transform(inputBuffer, transform, config, logger) {
    const bufferFormat = (await sharp(inputBuffer, { failOn: 'none' }).metadata().catch(() => ({ format: undefined }))).format;
    const outputFormat = transform.format ?? bufferFormat;
    if (!bufferFormat || outputFormat === 'svg' || bufferFormat === 'svg') {
      return sharpService.transform(inputBuffer, transform, config, logger);
    }

    const kernel = config.service.config.kernel;
    const result = sharp(inputBuffer, {
      failOn: 'none',
      pages: -1,
      limitInputPixels: config.service.config.limitInputPixels,
    });
    result.rotate();
    if (transform.width && transform.height) {
      const fit = transform.fit ? (fitMap[transform.fit as keyof typeof fitMap] ?? 'inside') : undefined;
      result.resize({
        width: Math.round(transform.width),
        height: Math.round(transform.height),
        kernel,
        fit,
        position: transform.position,
        withoutEnlargement: true,
      });
    } else if (transform.height && !transform.width) {
      result.resize({ height: Math.round(transform.height), withoutEnlargement: true, kernel });
    } else if (transform.width) {
      result.resize({ width: Math.round(transform.width), withoutEnlargement: true, kernel });
    }
    if (transform.background) {
      result.flatten({ background: transform.background });
    }

    // The one addition. Orientation was applied by rotate() above, and sharp
    // removes the EXIF orientation tag when it keeps EXIF after a rotate.
    result.keepExif().keepXmp();

    const encoderOptions = resolveSharpEncoderOptions(
      { format: outputFormat, quality: transform.quality },
      bufferFormat,
      config.service.config,
    );
    if (outputFormat === 'webp') result.webp(encoderOptions);
    else if (outputFormat === 'png') result.png(encoderOptions);
    else if (outputFormat === 'avif') result.avif(encoderOptions);
    else if (outputFormat === 'jpeg' || outputFormat === 'jpg') result.jpeg(encoderOptions);
    else result.toFormat(outputFormat as never, encoderOptions as never);

    return { data: await result.toBuffer(), format: outputFormat };
  },
};

export default service;
