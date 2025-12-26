import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "@src/modules/user/domain/entities/user.entity";
import { EmailAlreadyExistsException } from "@src/modules/user/domain/exceptions/user.exceptions";
import { IUserRepository } from "@src/modules/user/domain/repository-interfaces/user.repository.interface";
import { IPasswordHasher } from "@src/modules/user/domain/service-interfaces/password-hasher.interface";
import { ITokenService } from "@src/modules/user/domain/service-interfaces/token-service.interface";
import { Email } from "@src/modules/user/domain/value-objects/email.vo";
import { Nickname } from "@src/modules/user/domain/value-objects/nickname.vo";
import { Password } from "@src/modules/user/domain/value-objects/password.vo";
import { LoginDto } from "@src/modules/user/presentation/dtos/login.dto";
import { SignUpDto } from "@src/modules/user/presentation/dtos/sign-up.dto";
import { USER_TOKENS } from "@src/modules/user/user.constant";

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_TOKENS.IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(USER_TOKENS.IPasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(USER_TOKENS.ITokenService)
    private readonly tokenService: ITokenService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const email = Email.create(signUpDto.email);
    const nickname = Nickname.create(signUpDto.nickname);

    const isExist = await this.userRepository.existsByEmail(email);
    if (isExist) {
      throw new EmailAlreadyExistsException(email.getValue());
    }

    const password = await Password.create(
      signUpDto.password,
      this.passwordHasher,
    );

    const user = User.createLocal({ email, nickname, password });

    await this.userRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const email = Email.create(loginDto.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(
        "이메일 또는 비밀번호가 일치하지 않습니다.",
      );
    }

    const isPasswordMatch = await user
      .getPassword()
      ?.compare(loginDto.password, this.passwordHasher);

    if (!isPasswordMatch) {
      throw new UnauthorizedException(
        "이메일 또는 비밀번호가 일치하지 않습니다.",
      );
    }

    const accessToken = this.tokenService.generateAccessToken({
      sub: user.getId().getValue(),
      email: user.getEmail().getValue(),
      role: user.getRole().getValue(),
    });

    return { accessToken };
  }
}
