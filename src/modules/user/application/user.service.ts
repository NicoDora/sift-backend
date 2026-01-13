import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  UnauthorizedException,
} from "@nestjs/common";
import { User } from "@src/modules/user/domain/entities/user.entity";
import {
  EmailAlreadyExistsException,
  UserNotFoundException,
} from "@src/modules/user/domain/exceptions/user.exceptions";
import { IUserRepository } from "@src/modules/user/domain/repository-interfaces/user.repository.interface";
import { IPasswordHasher } from "@src/modules/user/domain/service-interfaces/password-hasher.interface";
import { Email } from "@src/modules/user/domain/value-objects/email.vo";
import { Nickname } from "@src/modules/user/domain/value-objects/nickname.vo";
import { Password } from "@src/modules/user/domain/value-objects/password.vo";
import {
  SocialProvider,
  SocialProviderType,
} from "@src/modules/user/domain/value-objects/social-provider.vo";
import { UserId } from "@src/modules/user/domain/value-objects/user-id.vo";
import { SignUpDto } from "@src/modules/user/presentation/dtos/sign-up.dto";
import { USER_TOKENS } from "@src/modules/user/user.constant";

@Injectable()
export class UserService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    @Inject(USER_TOKENS.IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(USER_TOKENS.IPasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const email = Email.create(signUpDto.email);
    const nickname = Nickname.create(signUpDto.nickname);

    const isExist = await this.userRepository.existsByEmail(email);
    if (isExist) {
      this.logger.warn(
        `회원가입 실패: 이미 존재하는 이메일 (${signUpDto.email})`,
        UserService.name,
      );
      throw new EmailAlreadyExistsException(email.getValue());
    }

    const password = await Password.create(
      signUpDto.password,
      this.passwordHasher,
    );

    const user = User.createLocal({ email, nickname, password });

    await this.userRepository.save(user);

    this.logger.log(`회원가입 성공: ${signUpDto.email}`, UserService.name);
  }

  async createSocialUser(params: {
    email: string;
    nickname: string;
    socialId: string;
    provider: SocialProviderType;
  }): Promise<User> {
    const email = Email.create(params.email);
    const nickname = Nickname.create(params.nickname);
    const provider = SocialProvider.create(params.provider);
    const user = User.createSocial({
      email,
      nickname,
      socialId: params.socialId,
      provider,
    });

    await this.userRepository.save(user);

    this.logger.log(`소셜 회원가입 성공: ${params.email}`, UserService.name);

    return user;
  }

  async validateCredentials(
    emailString: string,
    passwordString: string,
  ): Promise<User> {
    const email = Email.create(emailString);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      this.logger.warn(
        `로그인 실패: 존재하지 않는 이메일 (${emailString})`,
        UserService.name,
      );
      throw new UnauthorizedException(
        "이메일 또는 비밀번호가 일치하지 않습니다.",
      );
    }

    const password = user.getPassword();
    if (!password) {
      this.logger.warn(
        `로그인 실패: 비밀번호 정보 없음 (${emailString})`,
        UserService.name,
      );
      throw new UnauthorizedException(
        "이메일 또는 비밀번호가 일치하지 않습니다.",
      );
    }

    const isMatched = await password.compare(
      passwordString,
      this.passwordHasher,
    );

    if (!isMatched) {
      this.logger.warn(
        `로그인 실패: 비밀번호 불일치 (${emailString})`,
        UserService.name,
      );
      throw new UnauthorizedException(
        "이메일 또는 비밀번호가 일치하지 않습니다.",
      );
    }

    return user;
  }

  async getUserBySocialId(socialId: string): Promise<User | null> {
    return this.userRepository.findBySocialId(socialId);
  }

  async getUserProfile(id: string): Promise<User> {
    const user = await this.userRepository.findById(UserId.restore(id));

    if (!user) {
      throw new UserNotFoundException(id);
    }

    return user;
  }
}
