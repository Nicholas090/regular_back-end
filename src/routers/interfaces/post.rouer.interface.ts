import { Router } from 'express';

export default interface IPostRouter {
  init: () => Router,
}
