import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { CreatePostBody } from '../request.interfaces';


export const validatePostRequestBody = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').optional().isString(),
  body('imageUrl').notEmpty().withMessage('Image URL is required'),
  body('authorId').notEmpty().isInt().withMessage('Author ID must be an integer'),
  (req: Request<CreatePostBody>, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
