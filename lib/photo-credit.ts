// Attribution for celebrity photos from Wikimedia Commons (migration 0017).
// CC BY / CC BY-SA require author, license and a link wherever the photo is shown.

export interface PhotoCredit {
  author: string | null
  license: string | null
  licenseUrl: string | null
  filePage: string | null
}

export const PHOTO_CREDIT_COLUMNS = 'image_author, image_license, image_license_url, image_file_page'

export function toPhotoCredit(row: {
  image_author?: string | null
  image_license?: string | null
  image_license_url?: string | null
  image_file_page?: string | null
}): PhotoCredit | null {
  if (!row.image_license && !row.image_file_page) return null
  return {
    author: row.image_author ?? null,
    license: row.image_license ?? null,
    licenseUrl: row.image_license_url ?? null,
    filePage: row.image_file_page ?? null,
  }
}
