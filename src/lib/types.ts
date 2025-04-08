// Should match with `abstract model BaseRecord` in schema
export interface GenericRecord {
  id: string
  created_at: Date
  updated_at: Date
  created_by_id: string
  title: string
  description: string | null
  is_public: boolean
  archived_at: Date | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- to allow for any record type (as long as it extends BaseRecord from schema)
  [key: string]: any
}
