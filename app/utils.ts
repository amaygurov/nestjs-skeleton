import { Request, Response } from 'express';
import * as os from 'os';

export function jsonFormat(tokens, req: Request, res: Response) {
  const { password, ...body } = req.body || {};

  return JSON.stringify({
    'remoteAddress': tokens['remote-addr'](req, res),
    'time': tokens.date(req, res, 'iso'),
    'method': tokens.method(req, res),
    'url': tokens.url(req, res),
    'statusCode': tokens.status(req, res),
    'content-length': tokens.res(req, res, 'content-length'),
    'referrer': tokens.referrer(req, res),
    'userAgent': tokens['user-agent'](req, res),
    'hostname': os.hostname(),
    'pid': process.pid,
    body,
  });
}
