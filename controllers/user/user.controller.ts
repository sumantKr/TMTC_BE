import { Request, Response } from "express";
import { Router } from "express";

import { IController } from "../../common/controller.types";
import validationMiddleware from "../../middleware/validation.middleware";

import UserService from "../user/user.service";
import ErrorResponse from "../../common/ErrorResponse";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import SuccessResponse from "../../common/SuccessResponse";
import { isProduction } from "../../constants/env_variables";
import { COOKIE_NAME, JWT_EXPIRY } from "../../constants/constants";
import catchAsync from "../../middleware/catchAsync";
import AuthService from "../authentication/authentication.service";
import { LoginUserDto, RegisterUserDto } from "./user.dto";
import { authMiddleware } from "../../middleware/auth.middleware";

export class UserController implements IController {
  path = "user";
  router: Router = Router();
  private authService: AuthService;
  private userService: UserService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `/registration`,
      validationMiddleware(RegisterUserDto),
      catchAsync(this.registerUser.bind(this))
    );

    this.router.post(
      `/login`,
      validationMiddleware(LoginUserDto),
      catchAsync(this.loginUser.bind(this))
    );
    this.router.post(
      `/logout`,
      authMiddleware,
      catchAsync(this.logoutUser.bind(this))
    );
  }

  private async registerUser(
    request: Request<any, any, RegisterUserDto>,
    response: Response
  ) {
    const { username, email, password, fullName } = request.body;

    const foundUser = await this.userService.findUserByEmailOrUserName(
      email,
      username
    );
    if (foundUser) {
      throw new ErrorResponse({
        message: "User already exists",
        status: StatusCodes.CONFLICT,
      });
    }
    const hashedPassword = await this.authService.createPassword(password);

    const createdUser = await this.userService.createNewUser({
      username,
      email,
      fullName,
      password: hashedPassword,
    });
    const userToSend = createdUser.toObject();
    delete userToSend.password;

    const token = this.authService.generateAccessToken(createdUser);

    return response.send(
      new SuccessResponse({
        status: StatusCodes.CREATED,
        message: getReasonPhrase(StatusCodes.OK),
        data: userToSend,
      })
    );
  }

  private async loginUser(
    request: Request<any, any, LoginUserDto>,
    response: Response
  ) {
    const { email, password, username } = request.body;
    if (!email && !username) {
      throw new ErrorResponse({
        message: "no email or username provided",
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const foundUser = await this.userService.findUserByEmailOrUserName(
      email,
      username
    );
    if (!foundUser) {
      throw new ErrorResponse({
        message: "user not found",
        status: StatusCodes.NOT_FOUND,
      });
    }

    const isPasswordValid = await this.authService.comparePassword(
      password,
      foundUser.password
    );
    const userToSend = foundUser.toObject();
    delete userToSend.password;
    if (!isPasswordValid) {
      throw new ErrorResponse({
        message: "invalid credentials",
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const token = this.authService.generateAccessToken(foundUser);
    response.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction, // use true in production
      maxAge: JWT_EXPIRY, // 1 day
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });
    return response.send(
      new SuccessResponse({
        data: userToSend,
        message: "user logged in successfully",
        status: StatusCodes.OK,
      })
    );
  }
  

  private async logoutUser(request: Request, response: Response) {
    response.cookie(COOKIE_NAME, "", {
      httpOnly: true,
      secure: isProduction,
      maxAge: 0,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });
    response.send(
      new SuccessResponse({
        message: "Logged out successfully",
        status: StatusCodes.OK,
      })
    );
  }
}
