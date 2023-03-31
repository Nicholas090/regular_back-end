import { NextFunction, Response } from 'express';
import ApiError from '../exceptions/api.error';
import { TypedRequestBody } from '../requestType';
import { RegistrationBody } from '../request.interfaces';
const createUserValid = (req: TypedRequestBody<RegistrationBody>, res: Response, next: NextFunction): void => {
  const body = req.body;
  const errors: string[] = [];

  const user: RegistrationBody = {
	  email: '',
	  password: '',
	  nickname: '',
	  name: '',
  };

	type RegistrationKeys = keyof RegistrationBody;

	Object.keys(user).forEach((key) => {
	  if (!body.hasOwnProperty(key)) {
	    errors.push(`Request body doesn't have ${key} property !`);
	  }
	});

	Object.keys(body).forEach((e: RegistrationKeys) => {
	  if (!user.hasOwnProperty(e)) {
	    errors.push(`User model doesn't have ${e} property !`);
	  }
	  if (e === 'email') {
	    const reqExEmail = /^[a-z0-9](\.?[a-z0-9]){1,}@ukr\.net$/;
	    if (!reqExEmail.test(body[e])) {
	      errors.push('email is incorrect');
	    }
	  }

	  if (e === 'password') {
	    if (body[e].length < 3) {
	      errors.push('password length should be longer than 3 symbols!');
	    }
	  }

	  if (e === 'name') {
	    if (body[e].length < 4) {
	      errors.push('lastName length should be longer than 4 symbols!');
	    }
	  }

	  if (e === 'nickname') {
	    if (body[e].length < 4) {
	      errors.push('userNickName length should be longer than 4 symbols!');
	    }
	  }
	});

	if (errors.length !== 0) {
	  console.log(errors);
	  ApiError.validationUserError(errors[0]);
	}

	next();
};


export { createUserValid };
