export interface queryParams {
  sql: string
  params?: any[]
}

export interface insertParams {
  table: string
  data: { [key: string]: any }
}

export interface updateParams {
  table: string
  data: { [key: string]: any }
  condition: string
}

export interface deleteParams {
  table: string
  condition: string
}

export interface bulkInsertOrUpdateParams {
  table: string
  data: any[]
}
