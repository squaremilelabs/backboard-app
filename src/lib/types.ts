// Should match with `abstract model WithMetadata` in schema
export interface WithMetadata {
  id: string
  created_at: Date
  updated_at: Date
  created_by_id: string
  title: string
  archived_at: Date | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- to allow for any record type (as long as it extends WithMetadata from schema)
  [key: string]: any
}
