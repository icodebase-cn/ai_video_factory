export interface queryParam {
  sql: string
  params?: any[]
}

export interface insertParam {
  table: string
  data: { [key: string]: any }
}

export interface updateParam {
  table: string
  data: { [key: string]: any }
  condition: string
}

export interface deleteParam {
  table: string
  condition: string
}

export interface bulkInsertOrUpdateParam {
  table: string
  data: any[]
}
