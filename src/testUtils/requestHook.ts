import request from 'supertest';
import app from '../app';
import { BookData } from '../types/types';

type RequestBody = BookData; // right now we only have one type of request body

const hook = (method: 'post' | 'get' | 'put' | 'delete') => (path: string, token: string, body?: RequestBody) =>
  request(app)[method](`/api/${path}`).set('Authorization', `Bearer ${token}`).send(body);

const requestWithAuth = {
  post: hook('post'),
  get: hook('get'),
  put: hook('put'),
  delete: hook('delete'),
};

export default requestWithAuth;
