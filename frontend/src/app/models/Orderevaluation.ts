export class Orderevaluation  {
  constructor(
    public name_of_product: string,
    public client: string,
    public client_ranking: string,
    public items: number,
    public bonus: number,
    public comment: string
  ) {
  }
}
