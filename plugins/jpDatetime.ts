export default defineNuxtPlugin(() => {
  return {
    provide: {
      jpDatetime: {
        date: (src: string | undefined) => {
          if (!src) return null
          const inputString = src
          const inputDate = new Date(inputString)
          const year = inputDate.getFullYear()
          const month = inputDate.getMonth() + 1 // Tháng bắt đầu từ 0, nên cần cộng thêm 1
          const day = inputDate.getDate()
          const formattedDate = `${year}/${month}/${day}`
          return formattedDate
        },
        time: (src: string | undefined) => {
          if (!src) return null
          const inputString = src
          const inputDate = new Date(inputString)
          const hours = inputDate.getUTCHours()
          const minutes = inputDate.getUTCMinutes()
          const seconds = inputDate.getUTCSeconds()
          // Kiểm tra và điều chỉnh nếu cần
          const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
          const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds

          const formattedTime = `${hours}:${formattedMinutes}`
          return formattedTime
        },
        datetime: (src: string | undefined) => {
          if (!src) return null
          const inputString = src
          const inputDate = new Date(inputString)
          inputDate.setMinutes(
            inputDate.getMinutes() + inputDate.getTimezoneOffset() - 540
          )
          const japanTime = inputDate
            .toISOString()
            .slice(0, 19)
            .replace("T", " ")
          const formattedDate = japanTime.replace(/-/g, "/")
          return formattedDate
        },
        jpDatetime: (src: string | undefined) => {
          if (!src) return null
          const inputString = src
          const inputDate = new Date(inputString)
          const day = inputDate.getUTCDate()
          const month = inputDate.getUTCMonth() + 1 // Tháng bắt đầu từ 0, nên cộng thêm 1
          const hours = inputDate.getUTCHours()
          const minutes = inputDate.getUTCMinutes()
          const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
          const formattedDate = `${day}月${month}日 ${hours}:${formattedMinutes}`
          return formattedDate
        },
      },
    },
  }
})
