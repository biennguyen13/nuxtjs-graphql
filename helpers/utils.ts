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

export async function wait(ms = 1000) {
  return new Promise((res) => {
    setTimeout(() => {
      res(ms)
    }, ms)
  })
}

export const getUriWithParam = (baseUrl, params) => {
  const Url = new URL(baseUrl)
  const urlParams = new URLSearchParams(Url.search)
  for (const key in params) {
    if (params[key] !== undefined) {
      urlParams.set(key, params[key])
    }
  }
  Url.search = urlParams.toString()

  const split = Url.toString().split("?")
  return split[0] + "?" + split[1]
}
