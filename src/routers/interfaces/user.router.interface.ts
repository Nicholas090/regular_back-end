import { Router } from 'express';

export default interface IUserRouter {
  init: () => Router,
}
