const auth = { name: "bien" }

let jpma_register_cache = null

try {
  jpma_register_cache = JSON.parse(localStorage.getItem("jpma_register"))
} catch (e) {
  jpma_register_cache = null
}

const registerTemplate = () => ({
  step: 0,
  certificate: [false, false, true, "PDU", false], // CPU, PDU, ITC, PMP
  day1: "OFFLINE", //NONE, ONLINE, OFFLINE
  day2: "OFFLINE", //NONE, ONLINE, OFFLINE
  seminarDay1Id: new Array(200).fill(null),
  seminarDay1Id_: new Array(200).fill(null),
  seminarDay2Id: new Array(200).fill(null),
  seminarDay2Id_: new Array(200).fill(null),
  applicant: {
    firstName: "",
    lastName: "",
    firstNameKana: "",
    lastNameKana: "",
    email: "",
    tel: "",
    fax: "",
    company: "",
    companyKana: "",
    department: "",
    position: "",
    deliveryAddress: "HOME", //HOME, COMPANY
    zipCode: "",
    prefectures: "",
    city: "",
    address: "",
    building: "",
    request: "",
  },
  membership: {
    isPmajMember: false,
    isPmajMemberNo: "",
    pmajMemberNo: "",
    isPmcPmsPmr: false,
    pmajCertificateNo: "",
    isEnaaMember: false,
    isGeneralParticipant: false,
    isStudent: false,
    isPmiMember: false,
    pmiMemberNo: "",
    isItc: false,
    itcNo: "",
  },
  qualification: {
    isCpu: false,
    isItc: false,
    isSmec: false,
    isProEngineer: false,
    isCm: false,
    isPmp: false,
  },
  survey: {
    isPmajEmail: false,
    isYourCompany: false,
    isAcquaintance: false,
    isSns: false,
    isPmajEvent: false,
    isPmajHome: false,
    isWebSearch: false,
  },
  payment: {
    paymentMethod: "CREDIT_CARD", // CREDIT_CARD, BANK_TRANSFER
    isNecessaryReceipt: false,
    isNecessaryInvoice: false,
  },
})
const handleClearRegister = () => {
  const temp = registerTemplate()

  for (const [key, value] of Object.entries(register)) {
    register[key] = temp[key]
  }
}
const register = reactive(jpma_register_cache ?? registerTemplate())

const registerAlert = reactive({
  errors: [],
  push: function (errors: any[]) {
    registerAlert.errors.push(...(Array.isArray(errors) ? errors : [errors]))
  },
  clear: function () {
    registerAlert.errors = []
  },
})

watch(
  () => register,
  (newValue, oldValue) => {
    localStorage.setItem("jpma_register", JSON.stringify(newValue))
  },
  { deep: true }
)

export default defineNuxtPlugin((app) => {
  const store = reactive({ auth, loading: false })
  return {
    provide: {
      store,
      register,
      registerAlert,
      handleClearRegister,
    },
  }
})
