export class PaginationDto {

  constructor({ page, limit }) {
    this.page = page;
    this.limit = limit;
  }

  static create({page, limit}) {
    if (isNaN(+page) || isNaN(+limit)) return ['Limit and page must be numbers'];

    if (page <= 0) return ['Offset must be greater than 0'];
    if (limit <= 0) return ['Limit must be greater than 0']

    return [undefined, new PaginationDto({ page: parseInt(page), limit: parseInt(limit) })];
  }

}