export interface Page<Entity> {
  results: Entity[];
  nextPageToken?: string;
}
