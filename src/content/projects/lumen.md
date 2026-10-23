---
title: Lumen
description: A tiny CLI for batch-renaming and tagging RAW photo files by EXIF data.
date: 2026-03-15
tags: [Rust, CLI, EXIF]
repo: https://github.com/your-handle/lumen
cover: ../../assets/covers/lumen.jpg
featured: true
---

This is sample content. Replace it with your own write-up, or delete the file.

## Why

Camera filenames like `DSC_0412.NEF` tell you nothing. Lumen renames them by capture
time, camera body, and lens, and writes sidecar tags so your editor can filter by them.

```sh
lumen rename --pattern "{date}-{camera}-{seq}" ./import
```

## Notes

Describe the architecture, the interesting problems, and the result.
