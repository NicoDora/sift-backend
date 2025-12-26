import { Inject, Injectable } from "@nestjs/common";
import { User } from "@src/modules/user/domain/entities/user.entity";
import { EmailAlreadyExistsException } from "@src/modules/user/domain/exceptions/user.exceptions";
import { IUserRepository } from "@src/modules/user/domain/repository-interfaces/user.repository.interface";
import { IPasswordHasher } from "@src/modules/user/domain/service-interfaces/password-hasher.interface";
import { Email } from "@src/modules/user/domain/value-objects/email.vo";
import { Nickname } from "@src/modules/user/domain/value-objects/nickname.vo";
import { Password } from "@src/modules/user/domain/value-objects/password.vo";
import { SignUpDto } from "@src/modules/user/presentation/dtos/sign-up.dto";
import { USER_TOKENS } from "@src/modules/user/user.constant";

@Injectable()
export class UserService {
  constructor(
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
      throw new EmailAlreadyExistsException(email.getValue());
    }

    const password = await Password.create(
      signUpDto.password,
      this.passwordHasher,
    );

    const user = User.createLocal({ email, nickname, password });

    await this.userRepository.save(user);
  }

  async getUserByEmail(emailString: string): Promise<User | null> {
    const email = Email.create(emailString);
    return await this.userRepository.findByEmail(email);
  }
}
