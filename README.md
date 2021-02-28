# stellajs
A small Typescript framework to make more structured Nodejs Rest APIs. It includes decorators for defining controllers, endpoints, error handlers, middleware and request validation using JSON schema. It also includes tsyringe for lightweight dependency injection through constructors. Everything I need for my projects.

Here is some code showing how to use the framework.

A controller handling auth (login/register/user info):
``` typescript
import { AuthMiddleware } from "./Auth.middleware";
import {
  Controller,
  Endpoint,
  UseMiddleware,
} from "@mrteapot/stellajs";
import { AuthService } from "./Auth.service";
import { RegistrationSchema } from "./schemas/Registration.schema";
import { LoginSchema } from "./schemas/Login.schema";
import { UserUpdateSchema } from "./schemas/UserUpdate.schema";
import { ChangePasswordSchema } from "./schemas/ChangePassword.schema";
import { HTTPMethod } from "@mrteapot/stellajs/dist/core/decorators/Endpoint";
import { StellaRequest } from "@mrteapot/stellajs/dist/core/interfaces";
import { User } from "shared/types/User";

@Controller("/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Endpoint({
    method: HTTPMethod.POST,
    schema: RegistrationSchema,
    path: "/register",
  })
  async registerUser(req: StellaRequest) {
    await this.authService.register(req.getBody());
  }

  @Endpoint({
    method: HTTPMethod.POST,
    path: "/login",
    schema: LoginSchema
  })
  async login(req: StellaRequest) {
    const token = await this.authService.login(req.getBody());
    return {
      token,
    };
  }

  @Endpoint({
    method: HTTPMethod.GET,
    path: "/me",
  })
  @UseMiddleware(AuthMiddleware)
  async me(req: StellaRequest) {
    const user = await this.authService.getUserInfo(req.getData<User>('user').id);
    return { user };
  }

  @Endpoint({
    method: HTTPMethod.PATCH,
    path: "/me",
    schema: UserUpdateSchema,
  })
  @UseMiddleware(AuthMiddleware)
  async update(req: StellaRequest) {
    await this.authService.updateProfile(req.getData<User>('user').id, req.getBody());
  }

  @Endpoint({
    method: HTTPMethod.PATCH,
    path: "/change-password",
    schema: ChangePasswordSchema,
  })
  @UseMiddleware(AuthMiddleware)
  async updatePassword(req: StellaRequest) {
    await this.authService.changePassword(
      req.getData<User>("user").email,
      req.getBody().oldPassword,
      req.getBody().newPassword
    );
  }
}

```

### Starting the application
``` typescript

import { StellaApplication } from '@mrteapot/stellajs';
import { AuthController } from "./auth/Auth.controller"

const stella = new StellaApplication({
  port: 8989,
  controllers: [
    AuthController,
  ]
});

await this.stella.bootstrap();
```
