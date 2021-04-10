import { Request, Response } from "express";

export function getData(req: Request, res: Response): Record<string, unknown> {
  const data = req.body;
  if (!data) res.json({ error: true, message: `Error to get data`, result: "Data is mandatory" }).status(400);
  return data;
}

export function getParam(req: Request, res: Response, paramName: string): string {
  const param = req.params[paramName];
  if (!param) res.json({ error: true, message: `Error trying get param`, result: "Param is mandatory" });
  return param;
}

export function sendDbResult(res: Response, promise: Promise<Record<string, unknown>>): void {
  promise
    .then((result) => {
      res.json({ error: false, message: "ok", result });
    })
    .catch((err) => {
      console.log("catch", err);
      res.json({ error: true, message: `Error`, result: err });
    });
}
