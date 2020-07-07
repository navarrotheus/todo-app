export default class Task {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public done_at: string | null,
    public isUpdatingStatus: boolean
    ) {}
}