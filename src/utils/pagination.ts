import { Request } from 'express';

export function getPaginationInfo(req: Request) {
  const page = getPage(req);
  const limit = getLimit(req);
  const skip = getSkip(page, limit);
  return { page: page, limit: limit, skip: skip };
}

function getPage(req: Request) {
  let page = req.query.page as string;

  if (!page || isNaN(page as any) || parseInt(page) <= 0) {
    return 1;
  }

  return parseInt(page);
}

function getLimit(req: Request) {
  let limit = req.query.limit as string;

  if (!limit || isNaN(limit as any)|| parseInt(limit) <= 0) {
    return 5;
  }

  return parseInt(limit);
}

function getSkip(page: number, limit: number) {
  return (page - 1) * limit;
}
