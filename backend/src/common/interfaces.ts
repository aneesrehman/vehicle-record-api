export interface ResponseBody {
  message?: string
  error?: string
  data?: object | object[] | any
}

export interface Vehicle {
  id: string
  make: string
  model: string
  reg: string
  registrationDate: string
}