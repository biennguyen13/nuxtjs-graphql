// Lấy giá trị từ cookie bằng key
export function getCookieValue(key) {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim())
  for (const cookie of cookies) {
    const [cookieKey, cookieValue] = cookie.split("=")
    if (cookieKey === key) {
      return cookieValue
    }
  }
  return null // Trả về null nếu không tìm thấy key trong cookie
}

// Thêm giá trị mới vào cookie
export function addCookieValue(key, value) {
  document.cookie = `${key}=${value}; path=/; `
}

export function removeCookieValue(key) {
  document.cookie = `${key}=; path=/; `
}
